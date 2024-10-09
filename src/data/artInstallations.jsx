import Papa from 'papaparse';

async function findStationArtByName(stationName) {
    console.log("got this station name", stationName)
  return new Promise((resolve, reject) => {
    // Fetch the CSV file
    fetch('./permnentArtInstallations.csv')
      .then((response) => response.text())
      .then((text) => {
        // Parse the CSV file
        Papa.parse(text, {
          header: true, // Treat the first row as the header
          complete: (result) => {
            const data = result.data;

            // Find the row with the matching Station Name
            const matchingRow = data.find(
              (row) => row['Station Name'] && row['Station Name'].trim() === stationName.trim()
            );

            if (matchingRow) {
              resolve(matchingRow); // Return the matching row
            } else {
              resolve(null); // Return null if no match is found
            }
          },
          error: (error) => {
            reject(`Error parsing CSV file: ${error}`);
          }
        });
      })
      .catch((error) => {
        reject(`Error fetching CSV file: ${error}`);
      });
  });
}

export {findStationArtByName}

