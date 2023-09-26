import { useState } from 'preact/hooks'
import preactLogo from './assets/preact.svg'
import viteLogo from '/vite.svg'
import './app.css'
import Tracking from './components/mapPage'
export function App() {
  const [count, setCount] = useState(0)

  return (
   <div className="w-full">
     <Tracking/>
   </div>

  
  

   
  )
}
