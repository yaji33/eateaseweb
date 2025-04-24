import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

interface LocationPickerProps {
  location: {
    lat: number;
    lng: number;
  };
  onLocationSelect: (location: { lat: number; lng: number }) => Promise<void>;
  readOnly?: boolean; 
}

const containerStyle = {
  width: "100%",
  height: "400px",
};

const LocationPicker: React.FC<LocationPickerProps> = ({ location, businessName }) => {
  return (
    <MapContainer center={location} zoom={15} style={containerStyle}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {/* Place a marker at the current location */}
      <Marker position={location}>
        <Popup>
          {businessName ? (
            <div>{businessName}</div>
          ) : (
            <div>Business Name not available</div>
          )}
        </Popup>
      </Marker>
    </MapContainer>
  );
};

export default function LocationPage() {
  const [location, setLocation] = useState({
    lat: 13.1339, // Default coordinates if geolocation fails
    lng: 123.7333,
  });

  const [businessName, setBusinessName] = useState("Mac&Gab Food Hub"); 

  useEffect(() => {
    // Check if geolocation is available
    if (navigator.geolocation) {
      // Get the current position of the user
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ lat: latitude, lng: longitude });
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    } else {
      console.log("Geolocation is not available in this browser.");
    }
  }, []);

  return (
    <div className="flex flex-col items-center">
      <h1 className="text-xl font-semibold mb-5">Your Current Location</h1>
      <LocationPicker location={location} businessName={businessName} />
      <p className="mt-4">
        Current Coordinates: {location.lat}, {location.lng}
      </p>
    </div>
  );
}
