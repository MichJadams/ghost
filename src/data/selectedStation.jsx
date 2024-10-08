import axios from "axios";

async function selectedStationByStationName(stationName, stationComplexId, timeOfDay) {
    const [hasWifiResult, crowdedLevelResult, artResult] = await Promise.allSettled([
        hasWifi(stationName),
        // at some point maybe we pick a different day
        crowdedLevel("2024-09-24", timeOfDay, stationComplexId),
        art(stationName)
    ])
    const result = {
        hasWifi: hasWifiResult.value,
        totalRides: crowdedLevelResult.value,
        artResult: artResult.value
    }
    return result
}

async function hasWifi(stationName) {
    const query = getStationQuery(stationName)

    const alternativeUrl = `https://data.ny.gov/resource/pwa9-tmie.json?$query=${query}`
    return axios({
        url: alternativeUrl,
        method: "GET",
        data: {
            "$limit": 100, // there should only be between 1 and 10, this is the number of "stations" that componse a "station complex"
            // "$$app_token" : "YOURAPPTOKENHERE"
        }
    }).then((blob) => {
        return blob.data.every(stop => stop.wifi_available === "Yes") ? "Yes" : "No"
    });
}

async function crowdedLevel(date, timeOfDayName, stationComplexId) {
    const { start, end } = convertTimeOfDayToTimeStamp(date, timeOfDayName);
    const transitQuery = getTransitRangeQuery(stationComplexId, start, end)
    const url = `https://data.ny.gov/resource/wujg-7c2s.json?$query=${transitQuery}`

    return axios({
        url: url,
        method: "GET",
        data: {
            "$limit": 500,
            // "$$app_token" : "YOURAPPTOKENHERE"
        }
    }).then((blob) => {
        return blob.data.reduce((acc, cur) => acc += Number(cur.ridership), 0)
    }).catch((err) => {
        console.error("Error in crowdedLevel: ", err)
    })
}

async function art(stationName) {
    const artQuery = getArtQuery(stationName)
    const url = `https://data.ny.gov/resource/4y8j-9pkd.json?$query=${artQuery}`

    return axios({
        url: url,
        method: "GET",
        data: {
            "$limit": 500,
            // "$$app_token" : "YOURAPPTOKENHERE"
        }
    }).then((blob) => {
        return blob.data
    }).catch((err) => {
        console.error("Error in art: ", err)
    })
}
function convertTimeOfDayToTimeStamp(date, name) {
    const nameToTimeStamp = {
        "The Darkest Hour": {
            start: "03:00:00",
            end: "06:00:00"
        },
        "Dawn": {
            start: "06:00:00",
            end: "08:00:00"
        },
        "Morning": {
            start: "08:00:00",
            end: "12:00:00"
        },
        "Early Afternoon": {
            start: "12:00:00",
            end: "15:00:00"
        },
        "Later Afternoon": {
            start: "15:00:00",
            end: "17:00:00"
        },
        "Dusk": {
            start: "17:00:00",
            end: "19:00:00"
        },
        "Evening": {
            start: "19:00:00",
            end: "21:00:00"
        },
        "Night": {
            start: "21:00:00",
            end: "00:00:00"
        },
        "Late Night": {
            start: "00:00:00",
            end: "03:00:00"
        }
    };
    return {
        start: `${date}T${nameToTimeStamp[name].start}`,
        end: `${date}T${nameToTimeStamp[name].end}`
    }
}

function getTransitRangeQuery(station_complex_id, startTimestamp, endTimestamp) {
    const query = `
      SELECT
        \`transit_timestamp\`,
        \`transit_mode\`,
        \`station_complex_id\`,
        \`station_complex\`,
        \`borough\`,
        \`payment_method\`,
        \`fare_class_category\`,
        \`ridership\`,
        \`transfers\`,
        \`latitude\`,
        \`longitude\`,
        \`georeference\`
      WHERE
        caseless_one_of(\`station_complex_id\`, "${station_complex_id}")
        AND (\`transit_timestamp\`
             BETWEEN "${startTimestamp}" :: floating_timestamp
             AND "${endTimestamp}" :: floating_timestamp)
      ORDER BY \`transit_timestamp\` DESC NULL LAST
      LIMIT 100
      OFFSET 0
    `;

    return encodeURIComponent(query);
}

function getStationQuery(stationName) {
    const query = `
      SELECT
        \`station_name\`,
        \`station_complex\`,
        \`lines\`,
        \`historical\`,
        \`borough\`,
        \`county\`,
        \`latitude\`,
        \`longitude\`,
        \`wifi_available\`,
        \`at_t\`,
        \`sprint\`,
        \`t_mobile\`,
        \`verizon\`,
        \`location\`,
        \`georeference\`
      WHERE caseless_one_of(\`station_name\`, "${stationName}")
      ORDER BY \`:id\` ASC NULL LAST
      LIMIT 100
      OFFSET 0
    `;

    return encodeURIComponent(query);
}

function getArtQuery(stationName) {
    const query = `SELECT
        \`agency\`,
        \`station_name\`,
        \`line\`,
        \`artist\`,
        \`art_title\`,
        \`art_date\`,
        \`art_material\`,
        \`art_description\`,
        \`art_image_link\`
        WHERE caseless_one_of(\`station_name\`, "${stationName}")
        `;

    return encodeURIComponent(query);
}
export { selectedStationByStationName }