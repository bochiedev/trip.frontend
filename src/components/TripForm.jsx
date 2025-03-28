import { useState } from "react";
import { toast } from "react-toastify";
import AsyncSelect from "react-select/async";
import API from "../utils/axiosInstance";


const TripForm = ({ onTripCreated }) => {
    const [currentLocation, setCurrentLocation] = useState(null);
    const [pickupLocation, setPickupLocation] = useState(null);
    const [dropoffLocation, setDropoffLocation] = useState(null);
    const [currentCycleHours, setCurrentCycleHours] = useState(0);

    // Function to fetch location suggestions from the backend
    const loadOptions = async (inputValue) => {
        if (!inputValue || inputValue.length < 1) {
            return [];
        }

        try {
            const response = await API.get("/locations/", {
                params: { q: inputValue },
            });
            return response.data.map((location) => ({
                value: location.name,
                label: location.name,
                latitude: location.latitude,
                longitude: location.longitude,
            }));
        } catch (error) {
            console.error("Error fetching location suggestions:", error);
            toast.error("Failed to fetch location suggestions. Please try again.", {
                position: "top-right",
                autoClose: 5000,
            });
            return [];
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!currentLocation || !pickupLocation || !dropoffLocation) {
            toast.error("Please select all locations.", {
                position: "top-right",
                autoClose: 5000,
            });
            return;
        }

        try {
            const response = await API.post("/plan-trip/", {
                current_location: {
                    name: currentLocation.label,
                    latitude: currentLocation.latitude,
                    longitude: currentLocation.longitude,
                },
                pickup_location: {
                    name: pickupLocation.label,
                    latitude: pickupLocation.latitude,
                    longitude: pickupLocation.longitude,
                },
                dropoff_location: {
                    name: dropoffLocation.label,
                    latitude: dropoffLocation.latitude,
                    longitude: dropoffLocation.longitude,
                },
                current_cycle_hours: currentCycleHours,
            }, {
                timeout: 10000,
            });

            if (response.status === 201) {
                console.log("");
                toast.success("Trip created successfully!", {
                    position: "top-right",
                    autoClose: 5000,
                });
                onTripCreated(response.data);

            } else {
                toast.error("Error Occured, Try again Later!", {
                    position: "top-right",
                    autoClose: 5000,
                });
            }


            setCurrentLocation(null);
            setPickupLocation(null);
            setDropoffLocation(null);
            setCurrentCycleHours(0);

        } catch (error) {
            const errorMessage = error.response?.data?.error || "Failed to create trip. Please try again.";

            console.error("Error creating trip:", errorMessage);
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4 text-primary">Create a Trip</h2>

            <form onSubmit={handleSubmit}>
                <div>
                    <label className="block text-gray-700">Current Location</label>
                    <AsyncSelect
                        cacheOptions
                        defaultOptions
                        loadOptions={loadOptions}
                        value={currentLocation}
                        onChange={setCurrentLocation}
                        placeholder="Type to search for a location..."
                        className="w-full p-2 border rounded"
                        isClearable
                        required
                    />
                </div>
                <div>
                    <label className="block text-gray-700">Pickup Location</label>
                    <AsyncSelect
                        cacheOptions
                        defaultOptions
                        loadOptions={loadOptions}
                        value={pickupLocation}
                        onChange={setPickupLocation}
                        placeholder="Type to search for a location..."
                        className="w-full p-2 border rounded"
                        isClearable
                        required
                    />
                </div>
                <div>
                    <label className="block text-gray-700">Dropoff Location</label>
                    <AsyncSelect
                        cacheOptions
                        defaultOptions
                        loadOptions={loadOptions}
                        value={dropoffLocation}
                        onChange={setDropoffLocation}
                        placeholder="Type to search for a location..."
                        className="w-full p-2 border rounded"
                        isClearable
                        required
                    />
                </div>
                <div>
                    <label className="block text-gray-700">Current Cycle Hours</label>
                    <input
                        type="number"
                        value={currentCycleHours}
                        onChange={(e) => setCurrentCycleHours(e.target.value)}
                        placeholder="Current Cycle Hours"
                        className="w-full p-2 border rounded"
                        required
                    />
                </div>
                <button type="submit" className="w-full bg-primary text-white p-2 mt-5 rounded hover:bg-opacity-90">
                    Create Trip
                </button>

            </form>
        </div>
    );
};

export default TripForm;
