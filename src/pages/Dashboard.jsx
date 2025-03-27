import { useState, useEffect } from "react";
import axios from "axios";
import TripForm from "../components/TripForm";
import MapComponent from "../components/MapComponent";
import { MapContainer } from "react-leaflet";
import RefreshTripButton from "../components/RefreshTripButton"

const Dashboard = () => {
    const [currentTrip, setCurrentTrip] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCurrentTrip = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await axios.get("http://localhost:8000/api/trip-history/");
                const trips = response.data;
                if (trips.length > 0) {
                    setCurrentTrip(trips[0]);
                }
            } catch (err) {
                setError(`Failed to fetch the current trip. Please try again later. ${err.response?.data?.message || err.message}`);

            } finally {
                setLoading(false);
            }
        };

        fetchCurrentTrip();
    }, []);

    const handleTripSubmit = (tripData) => {
        setCurrentTrip(tripData);
        setError(null);
    };

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6 text-primary">Dashboard</h1>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="w-full">
                    <TripForm onTripSubmit={handleTripSubmit} />
                </div>
                <div className="bg-white p-4 rounded-lg shadow-md w-full min-h-[400px] relative z-10">


                    <div className="flex items-center justify-between w-full mb-4">
                        <h2 className="text-xl font-semibold text-primary">Current Trip Map </h2>
                        <RefreshTripButton tripData={currentTrip} onRefreshComplete={setCurrentTrip} />
                    </div>



                    {loading ? (
                        <p className="text-gray-600">Loading current trip...</p>
                    ) : error ? (
                        <p className="text-red-600">{error}</p>
                    ) : currentTrip ? (
                        <MapContainer
                            center={[39.8283, -98.5795]}
                            zoom={4}
                            style={{ height: "400px", width: "100%", zIndex: 10 }}
                            className="relative z-10"
                        >
                            <MapComponent route={currentTrip.route_data} />
                        </MapContainer>
                    ) : (
                        <p className="text-gray-600">No current trip available. Plan a trip to see the map.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;