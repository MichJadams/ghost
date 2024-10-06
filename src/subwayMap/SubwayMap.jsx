import React, { useEffect, useRef, useState, useCallback } from 'react';
import getStations from "../data/database";

function SubwayMap() {
    const minLat = 40.512764
    const minLon = -74.251961;
    const canvasHeight = 600
    const canvasWidth = 800
    const maxLat = 40.903125
    const maxLon = -73.755405
    const [stations, setStations] = useState([])

    const fetchData = useCallback(async () => {
        console.log("fetching subway data");
        const stations = await getStations();
        setStations(stations);
    })

    const canvasRef = useRef(null);

    const onMouseDown = (event) => {
        console.log("mouse down", event);
    };

    const onWheel = (event) => {
        event.preventDefault(); // prevents the whole page from scrolling
        console.log("wheel", event);
    }

    const setupEvents = (canvas) => {
        canvas.addEventListener("mousedown", onMouseDown);
        canvas.addEventListener("wheel", onWheel, { passive: false });
    }

    const clearEvents = (canvas) => {
        canvas.removeEventListener("mousedown", onMouseDown);
        canvas.removeEventListener("wheel", onWheel, { passive: false });
    }

    useEffect(() => {
        console.log("useEffect");
        const canvas = canvasRef.current;
        setupEvents(canvas);

        const ctx = canvas.getContext('2d');
        fetchData();
        console.log(stations)

        if (ctx) {
            ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas before drawing

            stations.forEach(station => {
                const { x, y } = convertCoordinatesToCanvas(station.gtfs_latitude, station.gtfs_longitude,);
                drawStation(ctx, x, y, station.stop_name);
            });
        }

        return () => {
            clearEvents(canvas);
        };
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
        // ctx.strokeText(name, x + 10, y); // Optional: add the station name
        ctx.closePath();
    };

    return (
        <canvas ref={canvasRef} width={canvasWidth} height={canvasHeight} style={{ border: '1px solid black' }} />
    )
}

export default SubwayMap
