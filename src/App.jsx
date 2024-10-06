import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import SubwayMap from './subwayMap/SubwayMap'
import HexagonalGrid from './subwayMap/HexagonalGrid'
import './App.css'

function App() {
  const [count, setCount] = useState(0)
  useEffect(()=>{
    getData()
  })

  return (
    <>
      <h1>Metrogatchi</h1>
      <SubwayMap />
      <HexagonalGrid row={10} col={10} />
    </>
  )
}

export default App
