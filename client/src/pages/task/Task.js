import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Card, Button } from 'react-bootstrap';
import axios from 'axios';
import { tokenData } from '../../services/context';
import { useParams, useNavigate } from 'react-router-dom';

const Task = () => {
    const [task, setTask] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [clickComplete, setClickComplete] = useState(false);
    const [user, setUser] = useState(null);
    const navigate = useNavigate();
    const { taskSlug } = useParams();
    const [linkStatus, setLinkStatus] = useState([]);
    const [allLinkVisited, setAllLinkVisited] = useState(false);

    useEffect(() => {
        setLoading(true);

        axios
            .get(`https://xp-earner.onrender.com/api/v1/tasks/${taskSlug}`)
            .then((res) => {
                setTask(res.data.data.data);
                setLoading(false);
            })
            .catch((err) => {
                setLoading(false);
                setError(err.response.data.message);
                console.log(err);
            });

        const token = tokenData();
        if (token) {
            setLoading(true);

            axios
                .get('https://xp-earner.onrender.com/api/v1/users/me', {
                    withCredentials: true,
                    credentials: 'include',
                })
                .then((res) => {
                    setUser(res.data.data.data);
                    setLoading(false);
                })
                .catch((err) => {
                    setLoading(false);
                    setError(err.response.data.message);
                    console.log(err);
                });
        }
    }, [taskSlug, clickComplete]);

    useEffect(() => {
        if (task && task.links) {
            setLinkStatus(Array(task.links.length).fill(false));
        }
    }, [task]);

    const handleLinkClick = (index) => {
        const newLinkStatus = [...linkStatus];
        newLinkStatus[index] = true;
        setLinkStatus(newLinkStatus);

        if (newLinkStatus.every(status => status)) {
            setAllLinkVisited(true);
        }
    };

    const checkCompleted = () => {
        if (user) {
            const completedTasks = user.completed_tasks || [];
            return completedTasks.some(
                (completedTask) => completedTask.task_id._id === task._id
            );
        }
        return false;
    };

    const handleCompleteTask = async () => {
        const token = tokenData();
        if (token) {
            if (!checkCompleted()) {
                const data = {
                    task_id: task._id,
                };
                try {
                    await axios.patch(
                        `https://xp-earner.onrender.com/api/v1/users/complete-task/${task._id}`,
                        data,
                        {
                            withCredentials: true,
                            credentials: 'include',
                        }
                    );
                    alert('Task Completed Successfully 🎉');
                    setClickComplete(!clickComplete);
                } catch (err) {
                    setError(err.response.data.message);
                    console.log(err);
                }
            }
        } else {
            setError('You must be logged in to complete a task');
            setTimeout(() => {
                setError('');
                navigate('/login');
            }, 3000);
        }
    };

    if (loading) {
        return (
            <div className="container mt-5">
                <h2>Loading...</h2>
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

    if (!task) {
        return (
            <div className="container mt-5">
                <h2>Task not found</h2>
            </div>
        );
    }

    return (
        <div className="container mt-5">
            <h2>Task Details</h2>
            <Card>
                <Card.Body>
                    <Card.Title>{task.name}</Card.Title>
                    <Card.Body>{task.description}</Card.Body>
                    <br />
                    <Card.Subtitle>Reward: {task.xp_points} points</Card.Subtitle>
                    <br />
                    <ul>
                        {task.links && task.links.map((link, index) => 
                        (
                            <li key={index}>
                                <a href={link} target='_blank' rel='noopener noreferrer' onClick={() => handleLinkClick(index)}>
                                    Visit Link {index + 1}
                                </a>
                            </li>
                        ))}
                    </ul>
                    <br />
                    {!checkCompleted() ? (
                        <Button variant="success" onClick={handleCompleteTask} disabled={!allLinkVisited}>
                            {allLinkVisited ? 'Complete Task' : 'Claim Reward'}
                        </Button>
                    ) : (
                        <Button variant="success" disabled>
                            Reward Claimed
                        </Button>
                    )}
                </Card.Body>
            </Card>
        </div>
    );
};

export default Task;
