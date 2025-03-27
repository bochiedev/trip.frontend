import { useEffect } from "react";
import { MapContainer, TileLayer, Polyline, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";

// Function to create a colored divIcon marker
const createColoredMarker = (color) => {
    return L.divIcon({
        className: "custom-div-icon",
        html: `
      <div style="
        background-color: ${color};
        width: 24px;
        height: 24px;
        border-radius: 50%;
        border: 2px solid white;
        box-shadow: 0 0 5px rgba(0,0,0,0.5);
      "></div>
    `,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
        popupAnchor: [0, -12],
    });
};

const MapComponent = ({ route }) => {
    const map = useMap();

    useEffect(() => {
        if (route && route.geometry && route.geometry.length > 0) {
            setTimeout(() => {
                map.invalidateSize();
                const bounds = route.geometry.map(coord => [coord[1], coord[0]]);
                map.fitBounds(bounds);
            }, 500);
        }
    }, [map, route]);

    if (!route || !route.geometry) return null;

    return (
        <>
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <Polyline positions={route.geometry.map(coord => [coord[1], coord[0]])} color="#008080" />
            {route.stops && route.stops.map((stop, index) => {
                // Determine marker color based on stop type
                let markerColor;
                switch (stop.location.toLowerCase()) {
                    case "start":
                        markerColor = "#008080"; // Green for start
                        break;
                    case "start/pickup":
                        markerColor = "#008080"; // Slightly darker green for combined start/pickup
                        break;
                    case "pickup":
                        markerColor = "#ff9900"; // Orange for pickup
                        break;
                    case "dropoff":
                        markerColor = "#ff0000"; // Red for dropoff
                        break;
                    case "fueling":
                        markerColor = "#b247ff"; // Blue for fueling
                        break;
                    case "rest break":
                    case "sleeper berth":
                    case "off duty":
                        markerColor = "#800080"; // Purple for rest stops
                        break;
                    default:
                        markerColor = "#f54860"; // Default color for other stops (e.g., Driving, or named fuel/rest stops)
                }

                return (
                    <Marker
                        key={index}
                        position={[stop.lat, stop.lon]}
                        icon={createColoredMarker(markerColor)}
                    >
                        <Popup>
                            <div>
                                <strong>{stop.location}</strong>
                                <br />
                                Time: {stop.time.toFixed(2)} hrs
                                <br />
                                Duty Status: {stop.duty_status.replace("_", " ")}
                                <br />
                                Miles Traveled: {stop.miles_traveled.toFixed(2)} miles
                            </div>
                        </Popup>
                    </Marker>
                );
            })}
        </>
    );
};

export default MapComponent;