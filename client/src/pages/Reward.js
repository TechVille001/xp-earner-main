import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../services/authContext';
import toast from 'react-hot-toast';
import { Avatar } from '@telegram-apps/telegram-ui';

const Reward = ({ user, setShouldRefetch }) => {
  const { authState } = useContext(AuthContext);
  const [dailyNextClaim, setDailyNextClaim] = useState(null);
  const [hour12NextClaim, set12HourNextClaim] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(43200);
  const [claimAmount, setClaimAmount] = useState(0);
  const [incrementingAmount, setIncrementingAmount] = useState(0);


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
        toast.success(`You have received ${response.data.points} points!`, {
          position: "top-center",
          autoClose: 5000, 
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined, 
          style: {
            backgroundColor: "#fff",
            color: "#ffa000", 
            fontWeight: "bold",
            fontSize: "16px",
          }

        });
        setDailyNextClaim(new Date(response.data.nextDailyClaim));


        // Toggle shouldRefetch to trigger re-fetch of user data
        setShouldRefetch(prev => !prev);

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

        // Toggle shouldRefetch to trigger re-fetch of user data
        setShouldRefetch(prev => !prev);
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
    <div className="flex flex-col items-center h-fit w-full mb-5 mx-5">

      <div className='relative flex w-full h-fit flex-col rounded-xl p-2 shadow-md shadow-yellow-500'>
        <div className='relative flex w-full h-fit flex-row justify-between py-2 px-1' >
          <div className='relative flex w-full h-fit'>
            <Avatar
              size={20}
              src="50.png"
              className="flex h-full  my-auto align-middle circle-outer  delay-[10000ms]"
            />
            <p className="relative flex justify-center ml-2 items-center text-gray-400 font-bold">
              20000
            </p>
          </div>

          <button
            className={`inset font-medium text-xs  rounded-lg  ${(hour12NextClaim && hour12NextClaim > new Date()) || isLoading
              ? 'bg-gray-700 px-1 py-[1px] text-gray-400 w-fit whitespace-nowrap '
              : 'text-white cb py-1 px-4 '}`}
            onClick={claim12HourReward}
            disabled={(hour12NextClaim && hour12NextClaim > new Date()) || isLoading}
          >
            <span>{timeLeft > 0 && timeLeft < 43200 ? "Mining..." : "Mine"}</span>
            {hour12NextClaim && hour12NextClaim > new Date() && (
              <span className="block">
                {calculateRemainingTime(hour12NextClaim)}
              </span>
            )}
          </button>
        </div>

        <div className="w-full rounded-xl h-fit relative mt-1 bg-slate-900">
          <div
            className="relative h-7 rounded-xl bg-gradient-to-r from-transparent via-yellow-700 to-transparent "
            style={{ width: `${(timeLeft / 43200) * 100}%` }}
          >
            <div
              className="relative h-7 rounded-xl bg-yellow-600 animated w-full"
            >
            </div>
          </div>
        </div>
      </div>

      <div className="relative w-full flex flex-row justify-between  rounded-xl mt-4 p-2 shadow-sm-light shadow-yellow-500">

        <Avatar
          size={30}
          src="50.png"
          className="flex h-full  my-auto align-middle circle-outer  delay-[10000ms]"
        />
        <div className='relative flex flex-col'>
          <p className='text-yellow-700 font-bold'>Daily Reward</p>
          <p className='text-gray-300 font-mono text-sm'>+10K-20K</p>
        </div>
        <button
          className={`inset font-medium text-xs px-2 w-fit rounded-lg mt-4 ${(dailyNextClaim && dailyNextClaim > new Date()) || isLoading
            ? `bg-gray-700 text-gray-400 `
            : `text-white bg-yellow-500 border-solid border-yellow-800 border-[1px] transition-transform transform active:scale-95`}`}
          onClick={claimDailyReward}
          disabled={(dailyNextClaim && dailyNextClaim > new Date()) || isLoading}
        >
          <span>Claim</span>
          {dailyNextClaim && dailyNextClaim > new Date() && (
            <span className="block">
              {calculateRemainingTime(dailyNextClaim)}
            </span>
          )}
        </button>


      </div>
    </div>
  );
};

export default Reward;
