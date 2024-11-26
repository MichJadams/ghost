import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import SubwayMap from './subwayMap/SubwayMap'
import SelectedStation from './SelectedStation'
import SpiritStats from './SpiritStats'
import Spirit from './Spirit'
import SubwayMapFirstPerson from "./SubwayMapFirstPerson/SubwayMapFirstPerson.jsx";
import './index.css'


import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <h1>Metrogatchi</h1>
        <SubwayMapFirstPerson />
      {/*<SubwayMap />*/}
      {/*<SelectedStation stationName={'125th St'} stationComplexName={'125 St (4,5,6)'} />*/}
    </>
  )
}

export default App
