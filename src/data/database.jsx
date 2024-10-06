import axios from "axios";

async function getStations() {
    return axios({
        url: "https://data.ny.gov/resource/39hk-dx4f.json",
        method: "GET",
        data: {
            "$limit": 500, // there are only 496
            // "$$app_token" : "YOURAPPTOKENHERE"
        }
    }).then((blob) => {
        return blob.data;
    });
}

export { getStations };
