import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet'; // Import Leaflet library
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
  const [userLocation, setUserLocation] = useState(null);
  const [isSidebarExpanded, setSidebarExpanded] = useState(false);
  const [selectedAgency, setSelectedAgency] = useState(null);
  const [mapCenter, setMapCenter] = useState({ lat: 51.505, lng: -0.09 }); // Default center
  const mapRef = useRef(null); // Reference to the map instance
  const markersRef = useRef([]); // Reference to markers

  useEffect(() => {
    // Use the browser's Geolocation API to get the user's current location
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (error) => {
        console.error('Error getting user location:', error);
      }
    );
  }, []);

  const toggleSidebar = () => {
    //setSidebarExpanded(!isSidebarExpanded);
  };

  const selectAgency = (agency) => {
    setSelectedAgency(agency);

    // Clear previous markers
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    // Center the map on the selected agency
    if (mapRef.current && agency.latitude && agency.longitude) {
      mapRef.current.flyTo([agency.latitude, agency.longitude], 13); // You can adjust the zoom level (13 in this example)

      // Add a new marker for the selected agency
      const marker = L.marker([agency.latitude, agency.longitude], {
        icon: L.divIcon({ className: 'location-icon' }),
      }).addTo(mapRef.current);

      marker.bindPopup(agency.name).openPopup();
      markersRef.current.push(marker);
    }
  };

  const LocationMarker = () => {
    const map = useMap(); // Use this hook to get access to the map instance

    useEffect(() => {
      // Check if userLocation is available before flying
      if (userLocation) {
        map.flyTo([userLocation.latitude, userLocation.longitude], map.getZoom());
      }
    }, [userLocation]);

    return (
      userLocation && (
        <Marker
          position={[userLocation.latitude, userLocation.longitude]}
          icon={L.divIcon({ className: 'location-icon' })} // Create a custom location icon
        >
          <Popup>You are here</Popup>
        </Marker>
      )
    );
  };

  // Define the threshold distance (e.g., 10 kilometers)
  const thresholdDistance = 100;

  // Filter rescue agencies based on userLocation and threshold distance
  const filteredAgencies = rescueAgencies.filter((agency) => {
    if (userLocation && agency.latitude && agency.longitude) {
      const distance = calculateDistance(
        userLocation.latitude,
        userLocation.longitude,
        agency.latitude,
        agency.longitude
      );
      return distance <= thresholdDistance;
    }
    return false;
  });

  return (
    <div className="flex flex-col md:flex-row w-screen h-screen m-0 p-0">
      {/* Sidebar */}
      <div
        className={`${
          isSidebarExpanded ? 'w-full md:w-40 bg-white' : 'w-26 md:w-1/6 bg-white'
        } transition-width duration-300 ease-in-out m-0 p-0 flex flex-col`}
      >
        <button
          className="w-full p-2 rounded-none text-green-500 transition ease-in-out delay-150 bg-green-500 hover:bg-indigo-500 duration-100"
          onClick={toggleSidebar}
        >
          {!isSidebarExpanded ? '>>' : '<<'}
        </button>
        <div className="p-4 text-black">
          {/* Display filtered agencies in the sidebar with spaces */}
          {filteredAgencies.map((agency, index) => (
            <div
              key={agency.name}
              className={`flex flex-nowrap p-2 ${
                selectedAgency === agency ? 'bg-gray-300' : ''
              }`}
              onClick={() => selectAgency(agency)}
            >
              <TeamBox team={agency} />
              {index !== filteredAgencies.length - 1 && <div className="h-4" />}
            </div>
          ))}
        </div>
      </div>

      {/* Content */}
      <div
        className={`${
          isSidebarExpanded ? 'md:ml-0' : 'md:ml-0'
        } w-full flex-1 bg-black transition-margin-left duration-300 ease-in-out m-0 p-0`}
      >
        <MapContainer
          center={mapCenter}
          zoom={11}
          scrollWheelZoom={true}
          style={{ height: '100%', width: '100%' }}
          ref={mapRef} // Assign the map reference to the ref
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {userLocation && <LocationMarker />}
        </MapContainer>
      </div>
    </div>
  );
};

export default Tracking;
