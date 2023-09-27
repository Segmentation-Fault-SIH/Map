import { render } from 'preact'
import { App } from './app.jsx'
import './index.css'
import  {LocationProvider}  from './context/index.js'
render(

<LocationProvider>
<App />
</LocationProvider>

,

document.getElementById('app'))
