import React, { useEffect, useRef, useState, useCallback } from 'react';
import getStations from "../data/database";
import axios from "axios";

function SubwayMap() {
    const minLat = 40.512764
    const minLon = -74.251961;
    const canvasHeight = 600
    const canvasWidth = 800
    const maxLat = 40.903125
    const maxLon = -73.755405
    const [stations, setStations] = useState([])

    // { name: 'Station 1', latitude: 40.775036, longitude: -73.912034 },
    const canvasRef = useRef(null);

    useEffect(() => {
        axios({
            url: "https://data.ny.gov/resource/39hk-dx4f.json",
            method: "GET",
            data: {
                "$limit" : 500, // there are only 496
                // "$$app_token" : "YOURAPPTOKENHERE"
            }
        }).then((blob) => {            
            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas before drawing
                blob.data.forEach(station => {
                    const { x, y } = convertCoordinatesToCanvas(station.gtfs_latitude, station.gtfs_longitude,);
                    drawStation(ctx, x, y, station.stop_name);
                });
            }
            setStations(blob.data);
        });
    }, []);

    const convertCoordinatesToCanvas = (lat, lon) => {
        const normalizedLat = (lat - minLat) / (maxLat - minLat);
        const normalizedLon = (lon - minLon) / (maxLon - minLon);

        const x = normalizedLon * canvasWidth;
        const y = (1 - normalizedLat) * canvasHeight; // Invert y to match canvas coordinate system
        return { x, y };
    };

    const drawStation = (ctx, x, y, name) => {
        ctx.beginPath();
        ctx.arc(x, y, 5, 0, Math.PI * 2, true); // Draw a small circle for the station
        ctx.fillStyle = 'blue';
        ctx.fill();
        ctx.strokeText(name, x + 10, y); // Optional: add the station name
        ctx.closePath();
    };

    return (
        <canvas ref={canvasRef} width={canvasWidth} height={canvasHeight} style={{ border: '1px solid black' }} />
    )
}

export default SubwayMap
