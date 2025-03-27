import { useState, useEffect, useCallback } from "react";
import MapComponent from "../components/MapComponent";
import { MapContainer } from "react-leaflet";
import RefreshTripButton from "../components/RefreshTripButton"
import API from "../utils/axiosInstance";


const TripMaps = () => {
    const [trips, setTrips] = useState([]);
    const [filterDate, setFilterDate] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);


    const fetchTrips = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const params = filterDate ? { day: filterDate } : {};
            const response = await API.get("/trip-history/", { params });
            setTrips(response.data);
        } catch (err) {
            setError(`Failed to fetch trips. Please try again later. ${err.response?.data?.message || err.message}`);
        } finally {
            setLoading(false);
        }
    }, [filterDate]);


    useEffect(() => {
        fetchTrips();
    }, [fetchTrips]);

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6 text-primary">All Trip Maps</h1>
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
                <p className="text-gray-600">Loading trips...</p>
            ) : error ? (
                <p className="text-red-600">{error}</p>
            ) : trips.length > 0 ? (
                trips.map(trip => (
                    <div key={trip.id} className="bg-white p-4 rounded-lg shadow-md mb-6 w-full relative z-10">

                        <div className="flex items-center justify-between w-full mb-4">
                            <h2 className="text-xs font-semibold text-primary">Trip on: {new Intl.DateTimeFormat("en-US", { dateStyle: "long" }).format(new Date(trip.created_at))}</h2>
                            <RefreshTripButton tripData={trip} onRefreshComplete={fetchTrips} />
                        </div>


                        <MapContainer
                            center={[39.8283, -98.5795]}
                            zoom={4}
                            style={{ height: "400px", width: "100%", zIndex: 10 }}
                            className="relative z-10"
                        >
                            <MapComponent route={trip.route_data} />
                        </MapContainer>
                    </div>
                ))
            ) : (
                <p className="text-gray-600">No trips found for the selected date.</p>
            )}
        </div >
    );
};

export default TripMaps;