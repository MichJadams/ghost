import React, { useEffect, useRef } from 'react';

function SubwayMap() {
    const minLat = 0
    const minLon = 0;
    const canvasHeight = 600
    const canvasWidth = 800
    const maxLat = canvasWidth
    const maxLon = canvasWidth
    const stations = [
        { name: 'Station 1', latitude: 40.775036, longitude: -73.912034 },
        { name: 'Station 2', latitude: 40.770258, longitude: -73.917843 },
        // Add more stations
    ];
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        if (ctx) {
            ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas before drawing

            // For each station, calculate the position on the canvas and draw
            stations.forEach(station => {
                const { x, y } = convertCoordinatesToCanvas(station.latitude, station.longitude,);
                drawStation(ctx, x, y, station.name);
            });
        }
    }, [stations]);

    // ugh need to work on this more ... 
    const convertCoordinatesToCanvas = (lat, lon) => {
        const normalizedLat = (lat - minLat) / (maxLat - minLat);
        const normalizedLon = (lon - minLon) / (maxLon - minLon);

        const x = normalizedLon * canvasWidth;
        const y = (1 - normalizedLat) * canvasHeight; // Invert y to match canvas coordinate system
        console.log("normalized x and y", x, y)
        return { x, y };
    };

    const drawStation = (ctx, x, y, name) => {
        // console.log("drawing here", x, y)
        x = 0 
        y = 0 
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