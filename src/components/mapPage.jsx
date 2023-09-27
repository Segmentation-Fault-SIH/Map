import React, { useState, useEffect } from 'react';
import { useLocationContext } from '../context';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import rescueAgencies from '../constants';
import TeamBox from './TeamBox';

// Function to calculate distance between two sets of latitude and longitude coordinates
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of the Earth in kilometers
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance in kilometers
  return distance;
}

const Tracking = () => {
  const { locationState } = useLocationContext();
  const [isSidebarExpanded, setSidebarExpanded] = useState(false);

  const toggleSidebar = () => {
    setSidebarExpanded(!isSidebarExpanded);
  };

  const LocationMarker = () => {
    const map = useMap(); // Use this hook to get access to the map instance

    useEffect(() => {
      // Check if both previous and current locations are valid before flying
      if (
        locationState.previousLocation.latitude &&
        locationState.previousLocation.longitude &&
        locationState.currentLocation.latitude &&
        locationState.currentLocation.longitude
      ) {
        // Fly from the previous location to the current location
        map.flyTo(
          [locationState.currentLocation.latitude, locationState.currentLocation.longitude],
          map.getZoom()
        );
      }
    }, []); // Empty dependency array to ensure this effect runs only once when the component is initially rendered.

    return (
      <Marker position={[locationState.currentLocation.latitude, locationState.currentLocation.longitude]}>
        <Popup>You are here</Popup>
      </Marker>
    );
  };

  // Define the threshold distance (e.g., 10 kilometers)
  const thresholdDistance = 10;

  // Filter rescue agencies based on current location and threshold distance
  const filteredAgencies = rescueAgencies.filter((agency) => {
    if (
      locationState.currentLocation.latitude &&
      locationState.currentLocation.longitude &&
      agency.latitude &&
      agency.longitude
    ) {
      const distance = calculateDistance(
        locationState.currentLocation.latitude,
        locationState.currentLocation.longitude,
        agency.latitude,
        agency.longitude
      );
      return distance <= thresholdDistance;
    }
    return false;
  });

  return (
    <div className="flex flex-col md:flex-row w-screen h-screen bg-white m-0 p-0">
      {/* Sidebar */}
      <div
        className={`${
          isSidebarExpanded ? 'w-full md:w-40' : 'w-26 md:w-1/6'
        } bg-green-500 transition-width duration-300 ease-in-out m-0 p-0 flex flex-col`}
      >
        <button
          className="w-full p-2 rounded-none text-white transition ease-in-out delay-150 bg-blue-500 hover:bg-indigo-500 duration-100"
          onClick={toggleSidebar}
        >
          {!isSidebarExpanded ? '>>' : '<<'}
        </button>
        <div className="p-4 text-white">
          {/* Display filtered agencies in the sidebar */}
          {filteredAgencies.map((agency) => (
            <div key={agency.name} className="flex flex-nowrap">
              <TeamBox team={agency} />
            </div>
          ))}
        </div>
      </div>

      {/* Content */}
      <div
        className={`${isSidebarExpanded ? 'md:ml-0' : 'md:ml-0'} w-full flex-1 bg-black transition-margin-left duration-300 ease-in-out m-0 p-0`}
      >
        <MapContainer
          center={{ lat: locationState.currentLocation.latitude, lng: locationState.currentLocation.longitude }}
          zoom={11}
          scrollWheelZoom={true}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <LocationMarker />
        </MapContainer>
      </div>
    </div>
  );
};

export default Tracking;
