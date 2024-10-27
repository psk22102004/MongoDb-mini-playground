import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [errorMsg, setErrorMsg] = useState('hidden');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await axios.post('https://mongodb-mini-playground.onrender.com/api/validateUser', { userName, password });
        console.log(`response.data is ${JSON.stringify(response.data)}`);
        if (response.data.message === 'existing user') {
            navigate(`/home/${userName}`, { state: { _id: response.data._id, userName } });
        } else if (response.data.message === 'invalid password') {
            setErrorMsg('visible');
        } else {
            console.log(response.data.message);
            navigate(`home/${userName}`, { state: { _id: response.data._id, userName } });
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-black">
            <form onSubmit={handleSubmit} className="bg-[#212529] p-8 rounded-lg shadow-lg w-96">
                <h2 className="text-white text-2xl text-center mb-6">Login</h2>
                <input
                    name="userName"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    placeholder="Username"
                    className="border-2 border-white rounded-lg p-2 mb-4 w-full bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                    name="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    className="border-2 border-white rounded-lg p-2 mb-4 w-full bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <h1 className={`text-red-600 text-center mb-4 ${errorMsg}`}>Invalid Password!</h1>
                <button
                    type="submit"
                    className="bg-black text-white rounded-lg py-2 w-full hover:bg-gray-800 transition duration-200"
                >
                    Submit
                </button>
            </form>
        </div>
    );
};

export default Login;
