import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import SubwayMap from './subwayMap/SubwayMap'
import SelectedStation from './SelectedStation'
import SpiritStats from './SpiritStats'
import Spirit from './Spirit'

import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <h1>Metrogatchi</h1>
      <SubwayMap />
      <SelectedStation />
      <div className="spirit-container">
      <Spirit />
      <SpiritStats />
      </div>
    </>
  )
}

export default App
