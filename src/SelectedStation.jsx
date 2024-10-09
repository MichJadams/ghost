import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { selectedStationByStationName } from './data/dataSelectedStation'
import SpiritStats from './SpiritStats';
import Spirit from './Spirit';
// import './SelectedStation.css'; // Optional: For styling

function SelectedStation({ stationName, stationComplexName }) {
    const station = {
        name: "test",
        crowded: "not crowded",
        art: "art",
        wifi: "none",
        accessible: "maybe"
    }
    const [stationData, setStationData] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedTime, setSelectedTime] = useState("The Darkest Hour");

    const fetchStationData = async (stationName, stationComplexName) => {
        try {
            const data = await selectedStationByStationName(stationName, stationComplexName, selectedTime);
            console.log("fetch station data: \n")
            console.log(data.artUrls)
            if (data) {
                setStationData({ ...data, stationName });
            } else {
                setError('Failed to fetch data.');
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (event) => {
        setSelectedTime(event.target.value);
    };

    useEffect(() => {
        fetchStationData(stationName, stationComplexName); // Call the async function

        const handleHashChange = () => {
            const hash = window.location.hash.substring(1);
            const params = new URLSearchParams(hash);
            const selectedStationName = params.get('selectedStationName');
            const selectedComplexId = params.get('selectedComplexId');
            fetchStationData(selectedStationName, selectedComplexId); // Call the async function
        };

        // Listen for hash changes
        window.addEventListener('hashchange', handleHashChange);

        // Cleanup the event listener when the component unmounts
        return () => {
            window.removeEventListener('hashchange', handleHashChange);
        };

    }, [])
    if (!station) {
        return <div>No station selected.</div>;
    }

    if (loading) {
        return (<div>Loading ... </div>)
    }
    if (error) {
        return (<div>Error ...{error}</div>)
    }
    return (
        <div className="selected-station">

            <h2>Selected Station Details</h2>
            {loading ? "nothing" : stationData.hasWifi}
            <table className="station-table flex justify-around">
                <tbody>
                    <tr>
                        <th >Name</th>
                        <td>{stationData.stationName}</td>
                    </tr>
                    <tr>
                        <th>Crowded</th>
                        <td>{stationData.totalRides ? stationData.totalRides : 'undefined'}</td>
                        <th>
                            <select id="timeOfDay" value={selectedTime} onChange={handleChange}>
                                <option value="The Darkest Hour">The Darkest Hour (3am - 6am)</option>
                                <option value="Dawn">Dawn (6am - 8am)</option>
                                <option value="Morning">Morning (8am - 12pm)</option>
                                <option value="Early Afternoon">Early Afternoon (12pm - 3pm)</option>
                                <option value="Later Afternoon">Later Afternoon (3pm - 5pm)</option>
                                <option value="Dusk">Dusk (5pm - 7pm)</option>
                                <option value="Evening">Evening (7pm - 9pm)</option>
                                <option value="Night">Night (9pm - 12am)</option>
                                <option value="Late Night">Late Night (12am - 3am)</option>
                            </select>
                        </th>

                    </tr>
                    <tr>
                        <th>Art</th>
                        <td> {"hard coded right now"}</td>
                    </tr>
                    <tr>
                        <th>WiFi</th>
                        <td>{stationData.hasWifi ? 'Yes' : 'No'}</td>
                    </tr>
                    <tr>
                        <th>Accessible</th>
                        <td> {"hard coded right now"}</td>
                    </tr>
                </tbody>
            </table>
            <div >
                {stationData && stationData.artUrls && stationData.artUrls.map((url, index) => (
                    <img key={index} src={url} alt={`Image ${index + 1}`} />
                ))}
            </div>
            <div className="spirit-container bg-stone-200 flex-col items-center">
                <Spirit />
                <SpiritStats />
            </div>
        </div>
    );
};

export default SelectedStation;
