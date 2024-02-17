import { useEffect, useState } from 'react';
import logo from '../../../assets/logo.png';
import { useRecoilState } from 'recoil';
import { isAuthenticatedState, tokenState } from '@/atoms/authState';
import { useNavigate } from 'react-router-dom';
import toast from "react-hot-toast";


export default function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const Navigate = useNavigate();


    // Use Recoil to manage authentication state and token
    const [isAuthenticated, setIsAuthenticated] = useRecoilState(isAuthenticatedState); // eslint-disable-line no-unused-vars
    const [token, setToken] = useRecoilState(tokenState); // eslint-disable-line no-unused-vars

    

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('https://pmcsaudi-uat.smaftco.com:3083/login/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    "email": username,
                    "password": password
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`HTTP error! Status: ${response.status}, Message: ${errorData.errors.non_field_errors}`);
            }

            const data = await response.json();

            if (data && data.Token && data.Token.access) {
                // Store the token in both Recoil state and localStorage
                setToken(data.Token.access);
                localStorage.setItem('token',data.Token.access);
                // Store the user's email in localStorage
                localStorage.setItem('userEmail', username);
                setIsAuthenticated(true);
                toast.success('SuccessFully logined');
                Navigate('/');
                
                
            } else {
                console.error('Error: Unexpected response format');
                toast.error('Unable to login Please Check the Entered Details');
            }
        } catch (error) {
            setError(`Error: ${error.message}`);
            toast.error('Unable to login Please Check the Entered Details');

        }
    };

    useEffect(() => {
        setError(''); // Clear error message when username or password is updated
    }, [username, password]);


   

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 bg-white rounded-md shadow-md">
                <div className="mb-8 text-center">
                    <img src={logo} alt="Logo" className="h-16 mx-auto" />
                    <h2 className="mt-4 text-2xl font-semibold">Login</h2>
                </div>
                <form onSubmit={handleSubmit}>
                    {error && <div className="mb-4 text-red-500">{error}</div>}
                    <div className="mb-4">
                        <label htmlFor="username" className="block text-gray-600">
                            Username
                        </label>
                        <input
                            type="text"
                            id="username"
                            className="w-full p-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300"
                            placeholder="Enter your username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="password" className="block text-gray-600">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            className="w-full p-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full py-2 text-white transition duration-300 bg-blue-500 rounded-md hover:bg-blue-600"
                    >
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
}
