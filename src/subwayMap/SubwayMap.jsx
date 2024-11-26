import React, { useEffect, useRef, useState, useCallback } from 'react';
import {getStations} from "../data/database";
import axios from "axios";

class MapMath {
    constructor() {
        this.canvasHeight = 600; // const
        this.canvasWidth = 600; // const
        this.scale = 500; // const
        this.zoom =  1;
        this.center =  { lat: 40.72, lon: -74.00 };
        this.drag = false;
        this.closest = null;
    }

    convertCoordinatesToCanvas(lat, lon) {
        // normalized values will be 0, 0 if they are directly on `center`
        const normalizedLon = (lon - this.center.lon) * this.scale
        const normalizedLat = (lat - this.center.lat) * this.scale

        const x = (this.canvasWidth / 2) + normalizedLon * 2**this.zoom;
        const y = (this.canvasHeight / 2) - normalizedLat * 2**this.zoom; // Invert y to match canvas coordinate system

        // test inverse function
        // const [ inLat, inLon ] = convertCanvasToCoordinates(x, y, zoom, center);
        // console.log("in", lat, lon, "out", inLat, inLon);

        return { x, y };
    }

    convertCanvasToCoordinates(x, y) {
        const normX = (x - (this.canvasWidth / 2)) / 2**this.zoom;
        const normY = -(y - (this.canvasHeight / 2)) / 2**this.zoom;

        const lon = normX / this.scale + this.center.lon;
        const lat = normY / this.scale + this.center.lat;

        return [ lat, lon ];
    }
}

function SubwayMap() {
    var map = new MapMath();
    var stations = []
    var closestStation = null;
    const canvasRef = useRef(null);

    const convertClientToCanvas = (clientX, clientY, canvas) => {
        const rect = canvas.getBoundingClientRect();
        const x = (clientX - rect.left) * (canvas.width / rect.width);
        const y = (clientY - rect.top) * (canvas.height / rect.height);
        return [x, y];
    }

    const doSomethingWithStation = (station) => {
        console.log("michaela fill this in", station.complex_id);
        window.location.hash = `selectedStationName=${station.stop_name}&selectedComplexId=${station.complex_id}`;
    }

    const onMouseDown = (event) => {
        // console.log(event);
        if (event.button == 0 && closestStation != null) {
            doSomethingWithStation(closestStation);
        } else if (event.button == 1) {
            map.drag = true;
        }

    };
    const onMouseUp = (event) => {
        // console.log(event);
        if (event.button == 1) {
            map.drag = false;
        }
    };

    const onWheel = (event) => {
        event.preventDefault(); // prevents the whole page from scrolling

        map.zoom -= event.deltaY * 0.001;

        if (event.deltaY < 0) {
            // also nudge the center towards the mouse pointer a little when zooming in
            const [mouseX, mouseY] = convertClientToCanvas(event.clientX, event.clientY, canvasRef.current);
            const [lat, lon] = map.convertCanvasToCoordinates(mouseX, mouseY);

            const dLat = lat - map.center.lat;
            const dLon = lon - map.center.lon;
            map.center.lat += dLat / 10; // vibes
            map.center.lon += dLon / 10; // vibes
        }

        draw();
    }

    const onMouseMove = (event) => {
        // console.log(event);

        if (map.drag) {
            // drag map
            // not sure why this formula works lol I kinda just stumbled into it
            map.center.lat += event.movementY / (map.scale * 2 * 2**map.zoom);
            map.center.lon -= event.movementX / (map.scale * 2 * 2**map.zoom);
            draw();
        }

        // update selected station
        const canvas = canvasRef.current;
        const [mouseX, mouseY] = convertClientToCanvas(event.clientX, event.clientY, canvas);
        const [mouseLat, mouseLon] = map.convertCanvasToCoordinates(mouseX, mouseY);
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
        closestStation = closest;
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
            console.log(stations)
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
                const { x, y } = map.convertCoordinatesToCanvas(
                    Number(station.gtfs_latitude),
                    Number(station.gtfs_longitude),
                    map.zoom,
                    map.center,
                );
                drawStation(ctx, x, y, station.stop_name, station == closestStation);
            });
        } else {
            console.log("No canvas?");
        }
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
        if (map.zoom > 4) {
            ctx.strokeText(name, x + 10, y);
        }
        ctx.closePath();
    };

    return (
        <canvas ref={canvasRef} width={map.canvasWidth} height={map.canvasHeight} style={{ border: '1px solid black' }} />
    )
}

export default SubwayMap
