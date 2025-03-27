import { useState } from "react";
import axios from "axios";
import { FiRefreshCcw } from "react-icons/fi";
import { toast } from "react-toastify";


const RefreshTripButton = ({ tripData, onRefreshComplete }) => {
    const [loading, setLoading] = useState(false);

    const handleRefresh = async () => {
        setLoading(true);
        try {
            const response = await axios.post("http://localhost:8000/api/create-route-data/", { trip_id: tripData.id });


            if (response.status === 200) {
                console.log("");
                toast.success("Map Route Data Refreshed Successfully!", {
                    position: "top-right",
                    autoClose: 5000,
                });

                onRefreshComplete();

            } else {
                toast.error("Error Occured, Try again Later!", {
                    position: "top-right",
                    autoClose: 5000,
                });
            }

        } catch (err) {
            toast.error(`Error Occured, Try again Later! ${err.response?.data?.message || err.message}`, {
                position: "top-right",
                autoClose: 5000,
            });

        } finally {

            setLoading(false);
        }

    };

    return (
        <div className="relative group">
            <button
                onClick={handleRefresh}
                className="flex items-center justify-center w-12 h-12 bg-primary text-white rounded-full shadow-lg hover:bg-opacity-90 transition duration-300"
                disabled={loading}
            >
                {loading ? (
                    <span className="animate-spin">
                        <FiRefreshCcw size={15} />
                    </span>
                ) : (
                    <FiRefreshCcw size={18} />
                )}
            </button>

            {/* Tooltip */}
            <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-gray-700 text-white text-xs rounded-md px-4 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                Refresh route data
            </div>
        </div >

    );
};

export default RefreshTripButton;