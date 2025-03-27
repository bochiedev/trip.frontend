const LogSheet = ({ logSheets }) => {
    if (!logSheets || logSheets.length === 0) return <p>No log sheets available.</p>;

    return (
        <div>
            {logSheets.map((log, index) => (
                <div key={index} className="mb-4">
                    <h3 className="text-lg font-medium text-primary">Day {index + 1}</h3>
                    <img src={`data:image/png;base64,${log}`} alt={`ELD Log Day ${index + 1}`} className="w-full" />
                </div>
            ))}
        </div>
    );
};

export default LogSheet;