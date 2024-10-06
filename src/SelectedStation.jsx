import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {selectedStationByStationName} from './data/selectedStation'
// import './SelectedStation.css'; // Optional: For styling

function SelectedStation() {
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

    useEffect(() => {
        const fetchStationData = async () => {
            try {
                const data = await selectedStationByStationName("125th St");
                if (data) {
                    console.log("data", data)
                    setStationData(data);
                } else {
                    setError('Failed to fetch data.');
                }
            } catch (err) {
                setError(err.message);
            } finally {
                console.log("this is the data", stationData)
                setLoading(false);
            }
        };

        fetchStationData(); // Call the async function
    }, [])
    if (!station) {
        return <div>No station selected.</div>;
    }

    const { name, crowded, art, wifi, accessible } = station;

    if (loading) {
        return (<div>Loading ... </div>)
    }
    if (error) {
        return (<div>Error ...{error}</div>)
    }
    return (
        <div className="selected-station">
            <h2>Selected Station Details</h2>
            {loading? "nothing": stationData.hasWifi}
            <table className="station-table">
                <tbody>
                    <tr>
                        <th>Name</th>
                        <td>{name}</td>
                    </tr>
                    <tr>
                        <th>Crowded</th>
                        <td>{crowded ? 'Yes' : 'No'}</td>
                    </tr>
                    <tr>
                        <th>Art</th>
                        <td>{art ? 'Available' : 'Not Available'}</td>
                    </tr>
                    <tr>
                        <th>WiFi</th>
                        <td>{wifi ? 'Yes' : 'No'}</td>
                    </tr>
                    <tr>
                        <th>Accessible</th>
                        <td>{accessible ? 'Yes' : 'No'}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

export default SelectedStation;
