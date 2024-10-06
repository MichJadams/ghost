import axios from "axios";

async function getStations() {
    return axios({
        url: "https://data.ny.gov/resource/39hk-dx4f.json",
        method: "GET",
        data: {
          "$limit" : 500, // there are only 496
          // "$$app_token" : "YOURAPPTOKENHERE"
        }
    }).then((blob) => {
        return blob.data;
    });
}

async function selectedStationByStationId(stationId){
//     const query = SELECT
//     `station_name`,
//     `station_complex`,
//     `lines`,
//     `historical`,
//     `borough`,
//     `county`,
//     `latitude`,
//     `longitude`,
//     `wifi_available`,
//     `at_t`,
//     `sprint`,
//     `t_mobile`,
//     `verizon`,
//     `location`,
//     `georeference`
//   WHERE caseless_one_of(`station_name`, "103rd St")
//   ORDER BY `:id` ASC NULL LAST
//   LIMIT 100
//   OFFSET 0
    const alternativeUrl = "https://data.ny.gov/resource/pwa9-tmie.json?$query="
    return axios({
        url: "https://data.ny.gov/resource/pwa9-tmie.json",
        method: "GET",
        data: {
        "$limit" : 500, // there are only 496
        // "$$app_token" : "YOURAPPTOKENHERE"
        }
    }).then((blob) => {
        console.log("get got the goods", blob)
        return blob.data;
    });
}

async function selectedStationByComplexId(complexId){

}

export default getStations;
