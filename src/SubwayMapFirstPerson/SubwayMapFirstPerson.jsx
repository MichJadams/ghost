import React, {useEffect, useRef, useState, useCallback} from 'react';
import axios from "axios";

function SubwayMapFirstPerson() {
    let stations = [];
    const randomNumber = Math.floor(Math.random() * 497);
    const [selectedStation, setSelectedStation] = useState({})
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;

        axios({
            url: "https://data.ny.gov/resource/39hk-dx4f.json",
            method: "GET",
            data: {
                "$limit": 500, // there are only 496
                // "$$app_token" : "YOURAPPTOKENHERE"
            }
        }).then((blob) => {
            stations = blob.data;
            console.log("This is a selectefdsfdsfsd station", stations[0])

            setSelectedStation(stations[randomNumber]);
            setButtons(stations[randomNumber]);

            console.log("This is a selected station", selectedStation)

        });

    }, []);

    return (
        <div>
            <h1>{selectedStation.north_direction_label ? selectedStation.north_direction_label : "Loading"}</h1>
            <button>hello?</button>
            <div>
                { selectedStation.daytime_routes ?
                    selectedStation.daytime_routes.split(" ").map((line)=>(<button className="bg-slate-100 px-6 py-1 m-1 rounded">{line}</button>)) : "Loading"
                }
            </div>
        </div>
    );
}

export default SubwayMapFirstPerson