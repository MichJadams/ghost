import React, { useEffect, useRef, useState, useCallback } from 'react';
import {getStations} from "../data/database";
import axios from "axios";

function SubwayMap() {
    const canvasHeight = 600
    const canvasWidth = 600
    var canvasZoom = 1;
    var canvasCenter = { lat: 40.72, lon: -74.00 }
    var canvasDrag = false;
    var canvasClosest = null;
    var stations = []

    const canvasRef = useRef(null);

    const onMouseDown = (event) => {
        // console.log(event);
        if (event.button == 0) {
            const canvas = canvasRef.current;
            const [x, y] = convertClientToCanvas(event.clientX, event.clientY, canvas);
            const [lat, lon] = convertCanvasToCoordinates(x, y, canvasZoom, canvasCenter);
            canvasCenter = {
                lat: lat,
                lon: lon,
            }
            draw();
        } else if (event.button == 1) {
            canvasDrag = true;
        }
    };

    const onMouseUp = (event) => {
        // console.log(event);
        if (event.button == 1) {
            canvasDrag = false;
        }
    };

    const onWheel = (event) => {
        event.preventDefault(); // prevents the whole page from scrolling

        canvasZoom -= event.deltaY * 0.001;

        if (event.deltaY < 0) {
            // also nudge the center towards the mouse pointer a little when zooming in
            const [mouseX, mouseY] = convertClientToCanvas(event.clientX, event.clientY, canvasRef.current);
            const [lat, lon] = convertCanvasToCoordinates(mouseX, mouseY, canvasZoom, canvasCenter);

            const dLat = lat - canvasCenter.lat;
            const dLon = lon - canvasCenter.lon;
            canvasCenter.lat += dLat / 10; // vibes
            canvasCenter.lon += dLon / 10; // vibes
        }

        draw();
    }

    const onMouseMove = (event) => {
        // console.log(event);

        if (canvasDrag) {
            // drag map
            const baseZoom = 500; // XXX: dupliated in converCoordinatesToCanvase
            // not sure why this formula works lol I kinda just stumbled into it
            canvasCenter.lat += event.movementY / (baseZoom * 2 * 2**canvasZoom);
            canvasCenter.lon -= event.movementX / (baseZoom * 2 * 2**canvasZoom);
            draw();
        }

        // update selected station
        const canvas = canvasRef.current;
        const [mouseX, mouseY] = convertClientToCanvas(event.clientX, event.clientY, canvas);
        const [mouseLat, mouseLon] = convertCanvasToCoordinates(mouseX, mouseY, canvasZoom, canvasCenter);
        var closest = null;
        var closestDist = null;
        stations.forEach(station => {
            // naive... but fast enough!
            const dLat = mouseLat - Number(station.gtfs_latitude);
            const dLon = mouseLon - Number(station.gtfs_longitude);
            const dist = Math.sqrt(dLat**2 + dLon**2);
            if (closestDist == null || dist < closestDist) {
                closest = station;
                closestDist = dist;
            }
        });
        canvasClosest = closest;
        // console.log("closest", closest.stop_name);

        draw();
    }

    const setupEvents = (canvas) => {
        canvas.addEventListener("mousedown", onMouseDown);
        canvas.addEventListener("mouseup", onMouseUp);
        canvas.addEventListener("mousemove", onMouseMove);
        canvas.addEventListener("wheel", onWheel, { passive: false });
    }

    const clearEvents = (canvas) => {
        canvas.removeEventListener("mousedown", onMouseDown);
        canvas.removeEventListener("mouseup", onMouseUp);
        canvas.removeEventListener("mousemove", onMouseMove);
        canvas.removeEventListener("wheel", onWheel, { passive: false });
    }

    useEffect(() => {
        const canvas = canvasRef.current;
        setupEvents(canvas);

        axios({
            url: "https://data.ny.gov/resource/39hk-dx4f.json",
            method: "GET",
            data: {
                "$limit" : 500, // there are only 496
                // "$$app_token" : "YOURAPPTOKENHERE"
            }
        }).then((blob) => {            
            stations = blob.data;
            draw();
        });

        return () => {
            clearEvents(canvas);
        }
    }, []);

    const draw = () => {
        // console.log("draw");
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (ctx) {
            ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas before drawing
            stations.forEach(station => {
                const { x, y } = convertCoordinatesToCanvas(
                    Number(station.gtfs_latitude),
                    Number(station.gtfs_longitude),
                    canvasZoom,
                    canvasCenter,
                );
                drawStation(ctx, x, y, station.stop_name, station == canvasClosest);
            });
        } else {
            console.log("No canvas?");
        }
    }

    const convertCoordinatesToCanvas = (lat, lon, zoom, center) => {
        const baseZoom = 500
        // normalized values will be 0, 0 if they are directly on `center`
        const normalizedLon = (lon - center.lon) * baseZoom
        const normalizedLat = (lat - center.lat) * baseZoom

        const x = (canvasWidth / 2) + normalizedLon * 2**zoom;
        const y = (canvasHeight / 2) - normalizedLat * 2**zoom; // Invert y to match canvas coordinate system

        // test inverse function
        // const [ inLat, inLon ] = convertCanvasToCoordinates(x, y, zoom, center);
        // console.log("in", lat, lon, "out", inLat, inLon);

        return { x, y };
    };

    const convertCanvasToCoordinates = (x, y, zoom, center) => {
        const normX = (x - (canvasWidth / 2)) / 2**zoom;
        const normY = -(y - (canvasHeight / 2)) / 2**zoom;

        const baseZoom = 500 // XXX: duplicated in convertCoordinatesToCanvas
        const lon = normX / baseZoom + center.lon;
        const lat = normY / baseZoom + center.lat;

        return [ lat, lon ];
    }

    const convertClientToCanvas = (clientX, clientY, canvas) => {
        const rect = canvas.getBoundingClientRect();
        const x = (clientX - rect.left) * (canvas.width / rect.width);
        const y = (clientY - rect.top) * (canvas.height / rect.height);
        return [x, y];
    }

    const drawStation = (ctx, x, y, name, highlight) => {
        ctx.beginPath();
        var size = 3;
        if (highlight) size = 6;
        ctx.arc(x, y, size, 0, Math.PI * 2, true);
        var color = "blue";
        if (highlight) color = "red";
        ctx.fillStyle = color;
        ctx.fill();
        if (canvasZoom > 4) {
            ctx.strokeText(name, x + 10, y);
        }
        ctx.closePath();
    };

    return (
        <canvas ref={canvasRef} width={canvasWidth} height={canvasHeight} style={{ border: '1px solid black' }} />
    )
}

export default SubwayMap
