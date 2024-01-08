import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import logo from '../assets/logo.png';

export default function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [authenticated, setAuthenticated] = useState(false);

    const validCredentials = [
        { username: 'javaid@pmc.com', password: 'javaid@123' },
        { username: 'noman@pmc.com', password: 'noman@123' },
        { username: 'pmcsaudi@gmail.com', password: 'pmcsaudi@123' },
    ];

    const handleSubmit = (e) => {
        e.preventDefault();

        const matchedUser = validCredentials.find(
            (user) => user.username === username && user.password === password
        );

        if (matchedUser) {
            setAuthenticated(true);
        } else {
            setError('Invalid username or password');
        }
    };

    if (authenticated) {
        return <Navigate to="/" />;
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100">
            <div className="max-w-md w-full bg-white p-8 shadow-md rounded-md">
                <div className="mb-8 text-center">
                    <img src={logo} alt="Logo" className="mx-auto h-16" />
                    <h2 className="text-2xl font-semibold mt-4">Login</h2>
                </div>
                <form onSubmit={handleSubmit}>
                    {error && <div className="text-red-500 mb-4">{error}</div>}
                    <div className="mb-4">
                        <label htmlFor="username" className="block text-gray-600">
                            Username
                        </label>
                        <input
                            type="text"
                            id="username"
                            className="w-full border-gray-300 border rounded-md p-2 mt-1 focus:outline-none focus:ring focus:border-blue-300"
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
                            className="w-full border-gray-300 border rounded-md p-2 mt-1 focus:outline-none focus:ring focus:border-blue-300"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white rounded-md py-2 hover:bg-blue-600 transition duration-300"
                    >
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
}
