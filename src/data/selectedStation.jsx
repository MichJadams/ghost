import axios from "axios";
async function selectedStationByStationName(stationName) {
    const [hasWifiResult] = await Promise.allSettled([hasWifi(stationName)])
    const result = {
        hasWifi: hasWifiResult.value
    }
    return result
}

async function hasWifi(stationName) {
    const alternativeUrl = "https://data.ny.gov/resource/pwa9-tmie.json?$query=SELECT%0A%20%20%60station_name%60%2C%0A%20%20%60station_complex%60%2C%0A%20%20%60lines%60%2C%0A%20%20%60historical%60%2C%0A%20%20%60borough%60%2C%0A%20%20%60county%60%2C%0A%20%20%60latitude%60%2C%0A%20%20%60longitude%60%2C%0A%20%20%60wifi_available%60%2C%0A%20%20%60at_t%60%2C%0A%20%20%60sprint%60%2C%0A%20%20%60t_mobile%60%2C%0A%20%20%60verizon%60%2C%0A%20%20%60location%60%2C%0A%20%20%60georeference%60%0AWHERE%20caseless_one_of(%60station_name%60%2C%20%22103rd%20St%22)%0AORDER%20BY%20%60%3Aid%60%20ASC%20NULL%20LAST%0ALIMIT%20100%0AOFFSET%200"
    return axios({
        url: alternativeUrl,
        method: "GET",
        data: {
            "$limit": 500, // there are only 496
            // "$$app_token" : "YOURAPPTOKENHERE"
        }
    }).then((blob) => {
        return blob.data.every(stop => stop.wifi_available ==="Yes")? "Yes": "No"
    });
}
export { selectedStationByStationName }