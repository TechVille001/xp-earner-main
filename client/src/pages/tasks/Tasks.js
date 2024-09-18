import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Card, Button, Tabs, Tab } from 'react-bootstrap';
import { BsArrowRight } from 'react-icons/bs';
import { Avatar } from '@telegram-apps/telegram-ui';
import { useNavigate } from 'react-router-dom';
import LearnToEarn from '../Learn/Learn';
import './CustomTabs.css';  // Add this import

const Tasks = () => {
    const navigate = useNavigate();
    const [tasks, setTasks] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('tasks');

    useEffect(() => {
        setLoading(true);
        axios
            .get('https://xp-earner.onrender.com/api/v1/tasks', {
                withCredentials: true,
                credentials: 'include',
            })
            .then((res) => {
                console.log('data', res);
                setTasks(res.data.data.data);
                setLoading(false);
            })
            .catch((err) => {
                setLoading(false);
                setError(err.response.data.message);
                console.log(err);
            });
    }, []);

    if (loading) {
        return (
            <div className="flex flex-row container w-screen h-screen m-auto justify-items-center">
                <div className="relative flex self-center m-auto w-full">
                    <svg
                        aria-hidden="true"
                        className="inline container m-auto w-10 h-10 text-grey-700 animate-spin dark:text-gray-600 fill-yellow-500"
                        viewBox="0 0 100 101"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                            fill="currentColor"
                        />
                        <path
                            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                            fill="currentFill"
                        />
                    </svg>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mt-5">
                <h2>{error}</h2>
            </div>
        );
    }

    return (
        <div className="container mt-5">

            <img
                className="w-2/3 h-2/3 tp"
                src="start.png"
            />
            <Tabs
                activeKey={activeTab}
                onSelect={(k) => setActiveTab(k)}
                className="mb-3 flex bg-transparent border-0 justify-around  "
            >
                <Tab eventKey="tasks" title="Tasks"
                    tabClassName="custom-tab-button">
                    <div id='tasks'>

                        <h2 className='flex text-white/90 font-mono text-lg text-center w-full justify-center'>Complete Tasks For More Rewards</h2>
                        <div className="row pb-24 px-4" >
                            {tasks &&
                                tasks.length > 0 &&
                                tasks.map((task) => (
                                    <div key={task.id} className="col-lg-4 mb-2">
                                        <Card className="relative w-[90dvw] flex flex-row justify-between bg-transparent rounded-xl mt-4 mx-5 shadow-sm-light shadow-yellow-500">
                                            <Card.Body className=''>
                                                <div className='cardBody'>
                                                    <div className='cardLeft'>
                                                        <Card.Title className='text-white m-2 whitespace-nowrap text-sm w-fit'>{task.name}</Card.Title>
                                                        <div className='flex flex-row'>
                                                            <Avatar
                                                                size={15}
                                                                src="50.png"
                                                                className="inline h-full my-auto align-middle circle-outer delay-[10000ms]"
                                                            />
                                                            <Card.Text className='text-white text-xs ml-1 font-semibold'>
                                                                {task.xp_points}
                                                            </Card.Text>
                                                        </div>
                                                    </div>
                                                    <div className='cardRight'>
                                                        <Button
                                                            className='bg-yellow-500 border-0'
                                                            onClick={() => {
                                                                navigate(`/task/${task.slug}`);
                                                            }}
                                                            variant="primary"
                                                        >
                                                            <BsArrowRight />
                                                        </Button>
                                                    </div>
                                                </div>
                                            </Card.Body>
                                        </Card>
                                    </div>
                                ))}
                        </div>
                    </div>
                </Tab>
                <Tab eventKey="learnToEarn" title="Learn2Earn"
                    tabClassName="custom-tab-button">
                    <LearnToEarn />
                </Tab>
            </Tabs>
        </div>
    );
};

export default Tasks;
