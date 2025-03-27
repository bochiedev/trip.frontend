import { Outlet, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import Menu from "./Menu";

const Layout = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            navigate("/login");
        }
    }, [user, navigate]);

    if (!user) {
        return null;
    }

    return (
        <div className="flex min-h-screen">
            <Menu />
            <div className="flex-1 p-6 bg-gray-100 md:ml-[0.5rem] ml-0 md:mt-0 mt-16 overflow-y-auto h-screen">
                <Outlet />
            </div>
        </div>
    );
};

export default Layout;