import { createContext, useContext, useState } from 'react';
import rescueAgencies from '../constants';
export const LocationContext = createContext();

export const LocationProvider = ({ children }) => {
  const [locationState, setLocationState] = useState({
    previousLocation: { latitude: 8.5241, longitude: 76.9366 },
    currentLocation: { latitude: rescueAgencies[0].latitude, longitude: rescueAgencies[0].longitude }
  });

  const setLocation = (newLocation) => {
    setLocationState(prevState => ({
      previousLocation: prevState.currentLocation,
      currentLocation: newLocation
    }));
  };

  return (
    <LocationContext.Provider value={{ locationState, setLocation }}>
      {children}
    </LocationContext.Provider>
  );
};
export const useLocationContext = () => useContext(LocationContext);