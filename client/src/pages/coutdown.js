import React, { useState, useEffect } from 'react';

const Countdown = ({ onPointClaim, minClaim, maxClaim }) => {
  const [timeLeft, setTimeLeft] = useState(0); // Time left in seconds
  const [isCounting, setIsCounting] = useState(false);
  const [claimAmount, setClaimAmount] = useState(null);

  useEffect(() => {
    console.log('useEffect called');
    console.log('isCounting:', isCounting);
    console.log('timeLeft:', timeLeft);

    let timer;
    if (isCounting && timeLeft < 100) {
      timer = setInterval(() => {
        setTimeLeft((prevTime) => prevTime + 1);
      }, 1000);
    } else if (timeLeft === 100) {
      setIsCounting(false);
      const randomClaim = Math.floor(Math.random() * (maxClaim - minClaim + 1)) + minClaim;
      setClaimAmount(randomClaim);
    }
    return () => clearInterval(timer);
  }, [isCounting, timeLeft, minClaim, maxClaim]);

  const startCountdown = () => {
    console.log('Button clicked');
    if (timeLeft === 100) {
      onPointClaim(claimAmount);
      setTimeLeft(0);
      setClaimAmount(null);
    }
    setIsCounting(true);
  };

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col items-center w-full m-5">
      <div className="w-full rounded-full h-fit mb-12 relative mt-1 border-2 border-slate-900">
       
          <div
            className=" relative h-8 rounded-full bg-gradient-to-r from-slate-900 to to-blue-900"
            style={{ width: `${(timeLeft / 100) * 100}%` }}
          >
          </div>
           <span className="absolute inset-0 rounded-full flex justify-center items-center text-white font-bold">
            {timeLeft === 100 ? `Your Reward : ${claimAmount}` : formatTime(timeLeft)}
          </span>
      </div>

      <div className='relative w-full flex flex-row justify-between '>
        <button
          onClick={startCountdown}
          className={`${timeLeft === 100 ? '' : ' animate-pulse'
            } text-white font-bold py-2 px-4 rounded-full mt-4 border-solid border-[1px] border-slate-800 bg-gradient-to-b from-slate-900 to-purple-900 hover:bg-transparent`}
        >
          {timeLeft === 100 ? 'Claim' : 'Mine'}
        </button>
        <button

          className=
          ' text-white font-bold py-2 px-4 rounded-full mt-4 border-solid border-[1px] border-slate-800 bg-gradient-to-b from-slate-900 to-purple-900 hover:bg-transparent'
        >
          Daily Reward
        </button>

      </div>

    </div>
  );
};

export default Countdown;
