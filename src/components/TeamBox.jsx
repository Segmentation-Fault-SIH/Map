import React from 'react'
import { useLocationContext } from '../context'
const TeamBox = ({team}) => {
  const {locationState , setLocationState, setLocation } = useLocationContext();
  return (
    <div className="w-full h-10 bg-slate-500 ">
        
        <button onClick={() => setLocation({ latitude: team.latitude, longitude:team.longitude }
        ,console.log(locationState. currentLocation.latitude)
          )}
          className="w-full bg-transparent border-blue-50"
          >{team.name}</button>
    </div>
  )
}

export default TeamBox