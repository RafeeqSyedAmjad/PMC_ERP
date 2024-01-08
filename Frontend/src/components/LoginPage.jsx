
import logo from '../assets/logo.png';

export default function LoginPage() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100">
            <div className="max-w-md w-full bg-white p-8 shadow-md rounded-md">
                <div className="mb-8 text-center">
                    <img src={logo} alt="Logo" className="mx-auto h-16" />
                    <h2 className="text-2xl font-semibold mt-4">Login</h2>
                </div>
                <form>
                    <div className="mb-4">
                        <label htmlFor="username" className="block text-gray-600">Username</label>
                        <input
                            type="text"
                            id="username"
                            className="w-full border-gray-300 border rounded-md p-2 mt-1 focus:outline-none focus:ring focus:border-blue-300"
                            placeholder="Enter your username"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="password" className="block text-gray-600">Password</label>
                        <input
                            type="password"
                            id="password"
                            className="w-full border-gray-300 border rounded-md p-2 mt-1 focus:outline-none focus:ring focus:border-blue-300"
                            placeholder="Enter your password"
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
