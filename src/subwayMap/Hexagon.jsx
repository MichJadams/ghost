import React from 'react';
import './Hexagon.css'; // Make sure to add the styles

const Hexagon = ({ x, y }) => {
  return (
    <div className="hexagon" style={{ left: x, top: y }}>
      {/* You can put anything inside the hexagon */}
    </div>
  );
};

export default Hexagon;
