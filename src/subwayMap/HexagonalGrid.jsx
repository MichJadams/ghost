import React from 'react';
import Hexagon from './Hexagon';

function HexagonalGrid ({ rows, cols }) {
  const hexWidth = 100;
  const hexHeight = 57.74;
  const hexSpacing = 5; // Space between hexagons

  const hexagons = [];

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const x = col * (hexWidth + hexSpacing) + (row % 2) * (hexWidth / 2);
      const y = row * (hexHeight + hexSpacing);
      hexagons.push(<Hexagon key={`${row}-${col}`} x={x} y={y} />);
    }
  }

  return (
    <div style={{ position: 'relative', width: '100%', height: '100vh' }}>
      {hexagons}
    </div>
  );
};

export default HexagonalGrid;
