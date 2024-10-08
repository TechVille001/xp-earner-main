import React, { useState, useEffect, useContext } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { AuthContext } from '../../../services/authContext';

const Login = () => {
    const navigate = useNavigate();
    const { login } = useContext(AuthContext);

    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        axios
            .post(
                'https://xp-earner.onrender.com/api/v1/login',
                {
                    name: formData.name,
                    password: formData.password,
                },
                {
                    withCredentials: true,
                    credentials: 'include',
                },
            )
            .then((res) => {
                const token = res.data.token;
                login(token);
                //sessionStorage.setItem('JWT', token);
                window.Telegram.WebApp.expand();
                console.log('Token set in sessionStorage:', sessionStorage.getItem('JWT'));
                console.log(res);
                window.Telegram.WebApp.expand();
                // redirect to home page
                navigate('/');
                toast.success('Login Successful');
            })
            .catch((err) => {
                console.log(err);
                toast.error(err.response.data.message);
            });
    };

    return (
        <div
            className="container mt-5"
        >
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="email">Username</label>
                    <input
                        type="text"
                        className="form-control"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        className="form-control"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                </div>
                <button type="submit" className="btn btn-primary bg-yellow-500 border-0">
                    Login
                </button>
                <p className="mt-3 text-white">
                    Don't have an account? <a href="/register" className='text-yellow-500'>Register</a>
                </p>
            </form>
        </div>
    );
};

export default Login;