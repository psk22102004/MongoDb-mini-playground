import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { driver } from 'driver.js'; // Import the 'driver' function
import 'driver.js/dist/driver.css'; // Import the CSS

const Login = () => {
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [errorMsg, setErrorMsg] = useState('hidden');
    const [isLoading, setIsLoading] = useState(false); // Loading state
    const navigate = useNavigate();

    useEffect(() => {
        const driverObj = driver({
            showProgress: true,
            steps: [
                {
                    element: '#username-input',
                    popover: {
                        title: 'Step 1: Username',
                        description: 'If you are new, adding your credentials will create an account. If you already have an account, use the correct username.',
                        side: 'right',
                        align: 'start',
                    },
                },
                {
                    popover: {
                        title: 'Demo Login',
                        description: 'For demo purposes, use the username "Psk22102004" and password "pass".',
                        side: 'top',
                        align: 'center',
                    },
                },
                {
                    popover: {
                        title: "You're Ready!",
                        description: "You're now ready to explore the app. Enjoy!",
                        side: 'top',
                        align: 'center',
                    },
                },
            ],
        });

        driverObj.drive();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true); // Start loading

        try {
            const response = await axios.post('https://mongodb-mini-playground.onrender.com/api/validateUser', { userName, password });
            console.log(`response.data is ${JSON.stringify(response.data)}`);

            if (response.data.message === 'existing user') {
                navigate(`/home/${userName}`, { state: { _id: response.data._id, userName } });
            } else if (response.data.message === 'invalid password') {
                setErrorMsg('visible');
            } else {
                navigate(`home/${userName}`, { state: { _id: response.data._id, userName } });
            }
        } catch (error) {
            console.error('Error while validating user:', error);
            setErrorMsg('visible');
        } finally {
            setIsLoading(false); // Stop loading
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-black relative">
           
            {/* Loader */}
        {isLoading && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 z-50">
            <div className="flex flex-col items-center space-y-4">
              <img
                src="../dbLoader.gif"
                alt="Loading"
                className="w-full rounded-xl"
              />
              <p className="text-white text-2xl sm:text-3xl font-bold bg-black">
                Fetching Product Details...
              </p>
            </div>
          </div>
        )}

            <h1 className="text-white font-poppins text-3xl m-4 mb-10 font-bold">MongoDb Mini Playground</h1>
            <form onSubmit={handleSubmit} className="bg-[#212529] p-8 rounded-lg shadow-lg w-96">
                <h2 className="text-white text-2xl text-center mb-6 font-poppins">Login</h2>
                <input
                    id="username-input"
                    name="userName"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    placeholder="Username"
                    className="username-input border-2 border-white rounded-lg p-2 mb-4 w-full bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                    id="password-input"
                    name="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    className="password-input border-2 border-white rounded-lg p-2 mb-4 w-full bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <h1 className={`text-red-600 text-center mb-4 ${errorMsg}`}>Invalid Password!</h1>
                <button
                    type="submit"
                    className="login-button bg-black text-white rounded-lg py-2 w-full hover:bg-gray-800 transition duration-200"
                >
                    Submit
                </button>
            </form>
        </div>
    );
};

export default Login;
