import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/logo.svg";

const Login = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [driverNumber, setDriverNumber] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        try {
            await login(driverNumber, password);
            navigate("/dashboard");
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-secondary">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md mx-4">
                <img src={logo} alt="Logo" className="h-16 mx-auto mb-6" />
                <h2 className="text-2xl font-bold text-center mb-6 text-primary">Driver Login</h2>
                {error && (
                    <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-4">
                        {error}
                    </div>
                )}
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700">Driver Number</label>
                        <input
                            type="text"
                            value={driverNumber}
                            onChange={(e) => setDriverNumber(e.target.value)}
                            className="w-full p-2 border rounded"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-2 border rounded"
                            required
                        />
                    </div>
                    <button type="submit" className="w-full bg-primary text-white p-2 rounded hover:bg-opacity-90">
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;