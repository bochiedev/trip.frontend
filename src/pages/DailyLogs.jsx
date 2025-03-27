import { useState, useEffect } from "react";
import LogSheet from "../components/LogSheet";
import API from "../utils/axiosInstance";


const DailyLogs = () => {
    const [trips, setTrips] = useState([]);
    const [filterDate, setFilterDate] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTrips = async () => {
            setLoading(true);
            setError(null);
            try {
                const params = filterDate ? { day: filterDate } : {};
                const response = await API.get("/trip-history/", { params });
                setTrips(response.data);
            } catch (err) {
                setError(`Failed to fetch logs. Please try again later. ${err.response?.data?.message || err.message}`);

            } finally {
                setLoading(false);
            }
        };

        fetchTrips();
    }, [filterDate]);

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6 text-primary">Daily Logs</h1>
            <div className="mb-6 w-full max-w-sm">
                <label className="block text-gray-700 mb-2">Filter by Date</label>
                <input
                    type="date"
                    value={filterDate}
                    onChange={(e) => setFilterDate(e.target.value)}
                    className="w-full p-2 border rounded"
                />
            </div>
            {loading ? (
                <p className="text-gray-600">Loading logs...</p>
            ) : error ? (
                <p className="text-red-600">{error}</p>
            ) : trips.length > 0 ? (
                trips.map(trip => (
                    <div key={trip.id} className="bg-white p-4 rounded-lg shadow-md mb-6 w-full">
                        <h2 className="text-xl font-semibold mb-4 text-primary">
                            Logs for Trip on {new Date(trip.created_at).toLocaleDateString()}
                        </h2>
                        <LogSheet logSheets={trip.log_sheets} />
                    </div>
                ))
            ) : (
                <p className="text-gray-600">No logs found for the selected date.</p>
            )}
        </div>
    );
};

export default DailyLogs;