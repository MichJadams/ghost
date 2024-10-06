import React from 'react';
import PropTypes from 'prop-types';
//import './SelectedStation.css'; // Optional: For styling

function SelectedStation ({ station }) {
  if (!station) {
    return <div>No station selected.</div>;
  }

  const { name, crowded, art, wifi, accessible } = station;

  return (
    <div className="selected-station">
      <h2>Selected Station Details</h2>
      <table className="station-table">
        <tbody>
          <tr>
            <th>Name</th>
            <td>{name}</td>
          </tr>
          <tr>
            <th>Crowded</th>
            <td>{crowded ? 'Yes' : 'No'}</td>
          </tr>
          <tr>
            <th>Art</th>
            <td>{art ? 'Available' : 'Not Available'}</td>
          </tr>
          <tr>
            <th>WiFi</th>
            <td>{wifi ? 'Yes' : 'No'}</td>
          </tr>
          <tr>
            <th>Accessible</th>
            <td>{accessible ? 'Yes' : 'No'}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default SelectedStation;
