import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css'; // Don't forget to import Leaflet's CSS!
import rescueAgencies  from '../constants'
import TeamBox from './TeamBox';
const Tracking = () => {
  const [isSidebarExpanded, setSidebarExpanded] = useState(false);

  const toggleSidebar = () => {
    setSidebarExpanded(!isSidebarExpanded);
  };

  const LocationMarker = () => {
    const [position, setPosition] = useState(null);
    const map = useMapEvents({
      click() {
        map.locate();
      },
      locationfound(e) {
        setPosition(e.latlng);
        map.flyTo(e.latlng, map.getZoom());
      },
    });

    return position === null ? null : (
      <Marker position={position}>
        <Popup>You are here</Popup>
      </Marker>
    );
  }

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
        <div className="p-4 text-white"></div>
        {rescueAgencies.map((team) => (
  <div key={team.id} 
  className='flex flex-nowrap'
  >
    <TeamBox team={team}/>
    
  </div>
))}
      </div>

      {/* Content */}
      <div
      className={`${isSidebarExpanded ? 'md:ml-0' : 'md:ml-0'} w-full flex-1 bg-black transition-margin-left duration-300 ease-in-out m-0 p-0`}
    >
        <MapContainer
          center={{ lat: 51.505, lng: -0.09 }}
          zoom={11}
          scrollWheelZoom={true}
          style={{ height: "100%", width: "100%" }}  // Make sure the map takes up the full space of the parent container
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
