import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { AuthContext } from "./AuthContext";

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [accessToken, setAccessToken] = useState(localStorage.getItem("accessToken"));
    const [refreshToken, setRefreshToken] = useState(localStorage.getItem("refreshToken"));

    const fetchUserProfile = useCallback(async () => {
        try {
            const response = await axios.get("http://localhost:8000/api/profile/");
            setUser(response.data);
        } catch (error) {
            logout();
            throw new Error(`Error: ${error.response?.data?.message || error.message}`);
        }
    }, []);

    useEffect(() => {
        if (accessToken) {
            axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
            fetchUserProfile();
        }
    }, [accessToken, fetchUserProfile]);

    const login = async (driverNumber, password) => {
        try {
            const response = await axios.post("http://localhost:8000/api/login/", {
                driver_number: driverNumber,
                password,
            });
            const { access, refresh } = response.data;
            setAccessToken(access);
            setRefreshToken(refresh);
            localStorage.setItem("accessToken", access);
            localStorage.setItem("refreshToken", refresh);
            axios.defaults.headers.common["Authorization"] = `Bearer ${access}`;
            await fetchUserProfile();
        } catch (error) {
            throw new Error(`Invalid credentials: ${error.response?.data?.message || error.message}`);
        }
    };

    const logout = () => {
        setAccessToken(null);
        setRefreshToken(null);
        setUser(null);
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        delete axios.defaults.headers.common["Authorization"];
    };

    const refreshAccessToken = useCallback(async () => {
        try {
            const response = await axios.post("http://localhost:8000/api/token/refresh/", {
                refresh: refreshToken,
            });
            const { access } = response.data;
            setAccessToken(access);
            localStorage.setItem("accessToken", access);
            axios.defaults.headers.common["Authorization"] = `Bearer ${access}`;
            return access;
        } catch (error) {
            logout();
            throw new Error(`Session expired. Please log in again: ${error.response?.data?.message || error.message}`);
        }
    }, [refreshToken]);

    useEffect(() => {
        const interceptor = axios.interceptors.response.use(
            response => response,
            async error => {
                const originalRequest = error.config;
                if (error.response?.status === 401 && !originalRequest._retry) {
                    originalRequest._retry = true;
                    try {
                        const newAccessToken = await refreshAccessToken();
                        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
                        return axios(originalRequest);
                    } catch (refreshError) {
                        return Promise.reject(refreshError);
                    }
                }
                return Promise.reject(error);
            }
        );

        return () => axios.interceptors.response.eject(interceptor);
    }, [refreshToken, refreshAccessToken]);

    return (
        <AuthContext.Provider value={{ user, accessToken, login, logout, refreshAccessToken }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;