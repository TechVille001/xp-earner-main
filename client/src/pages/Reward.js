import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../services/authContext';
import toast from 'react-hot-toast';

const Reward = ({ user }) => {
  const { authState } = useContext(AuthContext);
  const [dailyNextClaim, setDailyNextClaim] = useState(null);
  const [hour12NextClaim, set12HourNextClaim] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(43200);
  const [claimAmount, setClaimAmount] = useState(0);

  useEffect(() => {
    if (user.lastDailyClaim) {
      const nextDaily = new Date(new Date(user.lastDailyClaim).getTime() + 24 * 60 * 60 * 1000);
      setDailyNextClaim(nextDaily);
    }
    if (user.last12HourClaim) {
      const next12Hour = new Date(new Date(user.last12HourClaim).getTime() + 12 * 60 * 60 * 1000);
      set12HourNextClaim(next12Hour);
    }
  }, [user]);

  const claimDailyReward = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post('https://xp-earner.onrender.com/api/v1/claim-daily-reward', { userId: user._id },
        {
          headers: {
            Authorization: `Bearer ${authState.token}`,
          }
        },
      );
      if (response.data.success) {
        toast.success(`You have received ${response.data.points} points!`);
        setDailyNextClaim(new Date(response.data.nextDailyClaim));
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error('Error claiming daily reward:', error);
      toast.error('An error occurred. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const claim12HourReward = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post('https://xp-earner.onrender.com/api/v1/claim-12hour-reward', { userId: user._id },
        {
          headers: {
            Authorization: `Bearer ${authState.token}`,
          }
        },
      );
      if (response.data.success) {
        toast.success(`You have received ${response.data.points} points!`);
        set12HourNextClaim(new Date(response.data.next12HourClaim));
        setClaimAmount(response.data.points);
        setTimeLeft(43200); // Reset timer
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error('Error claiming 12-hour reward:', error);
      toast.error('An error occurred. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const calculateRemainingTime = (nextClaim) => {
    const now = new Date();
    const diff = nextClaim - now;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    return `${hours}h ${minutes}m ${seconds}s`;
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (hour12NextClaim) {
        const diff = Math.floor((hour12NextClaim - new Date()) / 1000);
        setTimeLeft(diff > 0 ? diff : 0);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [hour12NextClaim]);

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours}h ${minutes}m ${secs}s`;
  };

  return (
    <div className="flex flex-col items-center h-fit w-full mb-5 mt-4 mx-5">
      <div className="w-full rounded-2xl h-fit relative mt-1 border-2 border-slate-900">
        <div
          className="relative h-9 rounded-xl bg-gradient-to-r from-yellow-800 via-yellow-600 to-yellow-900"
          style={{ width: `${(timeLeft / 43200) * 100}%` }}
        ></div>
        <span className="absolute inset-0 flex justify-center items-center text-white font-bold">
          {timeLeft === 43200 ? `Your Reward: ${claimAmount}` : formatTime(timeLeft)}
        </span>
      </div>
      <div className="relative w-full flex flex-row justify-between">
      <button
          className="text-white inset font-medium text-xs px-4 rounded-full mt-4  bg-yellow-500 border-solid border-yellow-800 border-[1px] transition-transform transform active:scale-95"
          onClick={claimDailyReward}
          disabled={(dailyNextClaim && dailyNextClaim > new Date()) || isLoading}
        >
          <span>Daily Reward</span>
          {dailyNextClaim && dailyNextClaim > new Date() && (
            <span className="block">
              {calculateRemainingTime(dailyNextClaim)}
            </span>
          )}
        </button>
        <button
          className="text-white inset font-medium text-xs py-2 px-4 rounded-full mt-4 bg-yellow-500 border-solid border-yellow-800 border-[1px] transition-transform transform active:scale-95"
          onClick={claim12HourReward}
          disabled={(hour12NextClaim && hour12NextClaim > new Date()) || isLoading}
        >
          <span>Mine</span>
          {hour12NextClaim && hour12NextClaim > new Date() && (
            <span className="block">
              {calculateRemainingTime(hour12NextClaim)}
            </span>
          )}
        </button>

      </div>
    </div>
  );
};

export default Reward;
