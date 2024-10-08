import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BsCopy, BsPersonAdd } from 'react-icons/bs';
import { Avatar } from '@telegram-apps/telegram-ui';

const Friends = () => {
    const [bonus, setBonus] = useState(0);
    const [friendCount, setFriendCount] = useState(0);
    const [copySuccess, setCopySuccess] = useState('');
    const [userId, setUserId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const token = sessionStorage.getItem('JWT');
        if (token) {
            fetchUserData(token);
            fetchUserStats(token);
        } else {
            setLoading(false);
            setError('User is not authenticated');
        }
    }, []);

    const fetchUserData = (token) => {
        axios
            .get('https://xp-earner.onrender.com/api/v1/users/me', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then((res) => {
                const userData = res.data.data.data;
                setLoading(false);
            })
            .catch((err) => {
                setError(err.response?.data?.message || 'Failed to fetch user data');
                setLoading(false);
            });
    };

    const fetchUserStats = (token, userId) => {
        axios
            .get(`https://xp-earner.onrender.com/api/v1/user-stats/${userId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then((res) => {
                const { referralBonus, friendsInvited } = res.data.data;
                setBonus(referralBonus);
                setFriendCount(friendsInvited);
            })
            .catch((err) => {
                console.error('Failed to fetch user stats:', err);
            });
    };

    useEffect(() => {
        if (window.Telegram?.WebApp) {
            const initData = window.Telegram.WebApp.initDataUnsafe;

            if (initData && initData.user) {
                setUserId(initData.user.id.toString() || '');
            }
        }
    }, []);

    const referralLink = userId ? `https://t.me/EkehiBot?start=${userId}`: '';

    const handleCopy = () => {
        navigator.clipboard.writeText(referralLink)
            .then(() => {
                setCopySuccess('Copied Successfully 😊');
                setTimeout(() => {
                    setCopySuccess('');
                }, 2000);
            })
            .catch((error) => {
                console.error('Failed to copy text: ', error);
            });
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>Error: {error}</p>;
    }

    return (
        <div id='Friends' className="container mt-5">
            <h1 className="text-yellow-700 font-bold text-4xl">Invite Friends</h1>
            <p className='text-white mt-3 text-l font-mono'>Invite friends to earn more points</p>
            <div className="relative flex flex-row w-full mt-4">
                <button
                    className="relative flex font-semibold text-medium justify-center text-center w-2/3 bg-yellow-500 border-2 border-yellow-500 rounded-xl text-white m-auto py-3 shadow-inner transform transition-transform duration-150 ease-in-out"
                    onClick={() => window.open(`https://t.me/share/url?url=${referralLink}&text=Join%20me%20on%20Ekehi%20Bot`, '_blank')}
                >
                    Invite Friends <BsPersonAdd className='text-white ml-3 text-xl font-bold' />
                </button>
                <button
                    className="relative flex font-semibold text-medium justify-center text-center w-fit bg-transparent border-2 border-yellow-500 rounded-xl text-white m-auto p-3 transform transition-transform duration-150 ease-in-out"
                    onClick={handleCopy}
                >
                    Copy <BsCopy className='text-yellow-500 ml-2 mt-1' />
                </button>
            </div>
            {copySuccess && <p className="text-yellow-500 text-center text-lg font-bold mt-2">{copySuccess}</p>}

            <h2 className="relative text-white font-bold mt-4 ml-2 text-start w-full">Your Referral Bonus:</h2>
            <div className='relative flex w-full h-fit border-2 mt-3 rounded-xl p-3 border-b-0 shadow-yellow-500 shadow-xl border-yellow-500'>
                <Avatar
                    size={50}
                    src="50.png"
                    className="flex h-full my-auto align-middle circle-outer delay-[10000ms]"
                />
                <p className="relative flex justify-center ml-2 items-center text-gray-400 font-mono text-xl">
                    {bonus} points
                </p>
            </div>

            <div className="flex flex-col w-full relative mt-5 p-2">
                <h2 className="relative text-white font-bold">Friends Invited:</h2>
                <p className="relative text-white text-xl">{friendCount} Friends Invited</p>
            </div>
        </div>
    );
};

export default Friends;