import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import SubwayMap from './subwayMap/SubwayMap'
import SpiritStats from './SpiritStats'
import Spirit from './Spirit'
import HexagonalGrid from './subwayMap/HexagonalGrid'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <h1>Metrogatchi</h1>
      <SubwayMap />
      <div class="spirit-container">
      <Spirit />
      <SpiritStats />
      </div>
      <HexagonalGrid row={10} col={10} />
    </>
  )
}

export default App
