import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {selectedStationByStationName} from './data/selectedStation'
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
    const [inputValue, setInputValue] = useState('');

    const fetchStationData = async (stationName, stationComplexName) => {
        try {
            const data = await selectedStationByStationName(stationName, stationComplexName);
            if (data) {
                console.log("data from insidefetchStationData", data, stationName, stationComplexName)
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

        const handleHashChange = () => {
            const hash = window.location.hash.substring(1);
            const params = new URLSearchParams(hash);
            const selectedStationName = params.get('selectedStationName'); // "active"
            const selectedComplexId = params.get('selectedComplexId');     // "date"
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
            {loading? "nothing": stationData.hasWifi}
            <table className="station-table flex justify-around">
                <tbody>
                    <tr>
                        <th >Name</th>
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
            <div className="spirit-container bg-stone-200 flex-col items-center">
                <Spirit />
                <SpiritStats />
            </div>
        </div>
    );
};

export default SelectedStation;
