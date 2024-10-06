import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { selectedStationByStationName } from './data/selectedStation'
import './SelectedStation.css';

function SelectedStation({stationName, stationComplexName}) {
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
    const [inputValue, setInputValue] = useState('');

    const fetchStationData = async (stationName, stationComplexName) => {
        try {
            const data = await selectedStationByStationName(stationName, stationComplexName);
            if (data) {
                console.log("data from insidefetchStationData", data,stationName, stationComplexName )
                setStationData(data);
            } else {
                setError('Failed to fetch data.');
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleClick = async (event) => {
        await fetchStationData(inputValue)
    }
    useEffect(() => {
        fetchStationData(stationName, stationComplexName); // Call the async function
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
            <div>
                For Testing:
                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Enter station name..."
                />
                <button onClick={handleClick}>Check</button>
            </div>
            <h2>Selected Station Details</h2>
            {loading ? "nothing" : stationData.hasWifi}
            <table className="station-table">
                <tbody>
                    <tr>
                        <th>Name</th>
                        <td>{name}</td>
                    </tr>
                    <tr>
                        <th>Crowded</th>
                        <td>{stationData.totalRides ? stationData.totalRides : 'undefined'}</td>
                    </tr>
                    <tr>
                        <th>Art</th>
                        <td>{art ? 'Available' : 'Not Available'}</td>
                    </tr>
                    <tr>
                        <th>WiFi</th>
                        <td>{stationData.hasWifi ? 'Yes' : 'No'}</td>
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
