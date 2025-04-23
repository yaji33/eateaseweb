import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import LocationPicker from "@/components/business/GeoMapping";

export default function Page() {
  const [isEditing, setIsEditing] = useState(false);
  const [businessData, setBusinessData] = useState({
    businessName: "Mac&Gab Food Hub",
    description:
      "A cozy café serving fresh pastries, handcrafted coffee, and all-day breakfast.",
    location: {
      lat: 13.1339,
      lng: 123.7333,
      address: "123 Food Street, Albay",
    },
    contact: "+63 912 345 6789",
    openingHours: "8:00 AM - 10:00 PM",
    logo: null,
    coverImage: null,
  });

  const handleChange = (e) => {
    setBusinessData({ ...businessData, [e.target.name]: e.target.value });
  };

  const handleLocationSelect = async (location) => {
    // Convert Lat/Lng to Address (Reverse Geocoding)
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${location.lat}&lon=${location.lng}`
    );
    const data = await response.json();
    const address = data.display_name || "Unknown Address";

    setBusinessData((prevData) => ({
      ...prevData,
      location: { lat: location.lat, lng: location.lng, address },
    }));
  };

  const handleFileChange = (e) => {
    setBusinessData({ ...businessData, [e.target.name]: e.target.files[0] });
  };
  const handleSave = () => {
    setIsEditing(false);
    console.log("Saved Data:", businessData);
  };

  // Get the user's current coordinates (if allowed)
  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          // Update the business data with the user's current location
          setBusinessData((prevData) => ({
            ...prevData,
            location: {
              lat: latitude,
              lng: longitude,
              address: "Retrieving address...", // Show "Retrieving address..." while fetching the address
            },
          }));

          // Reverse geocode the coordinates to get the address
          fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          )
            .then((response) => response.json())
            .then((data) => {
              const address = data.display_name || "Unknown Address";
              setBusinessData((prevData) => ({
                ...prevData,
                location: {
                  lat: latitude,
                  lng: longitude,
                  address,
                },
              }));
            });
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    } else {
      console.log("Geolocation is not available in this browser.");
    }
  };

  return (
    <div className="flex w-full max-w-5xl mx-auto flex-col min-h-screen bg-background_1 font-poppins px-4 pt-20 gap-5">
      <h1 className="font-semibold text-xl">Profile Page</h1>
      {isEditing ? (
        <div className="flex flex-col bg-white p-5 rounded-md shadow-md">
          <Input
            name="businessName"
            placeholder="Business Name"
            value={businessData.businessName}
            onChange={handleChange}
            className="mt-3"
          />
          <Textarea
            name="description"
            placeholder="Tell us about your business..."
            value={businessData.description}
            onChange={handleChange}
            className="mt-3"
          />
          <div className="mt-4">
            <p className="text-sm text-gray-600">Pick Your Location</p>
            <div className="map-container" style={{ height: "400px" }}>
              <LocationPicker
                location={businessData.location}
                onLocationSelect={handleLocationSelect}
              />
            </div>
            <p className="text-gray-700 mt-2">
              Selected Address: {businessData.location.address}
            </p>
            <Button className="mt-3" onClick={getCurrentLocation}>
              Use My Current Location
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3">
            <div>
              <label className="text-gray-700 text-sm">Phone Number</label>
              <Input
                name="contact"
                placeholder="Phone Number"
                value={businessData.contact}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="text-gray-700 text-sm">Opening Hours</label>
              <select
                name="openingHours"
                className="border rounded-md p-2 w-full"
                value={businessData.openingHours}
                onChange={handleChange}
              >
                <option>8:00 AM - 10:00 PM</option>
                <option>9:00 AM - 9:00 PM</option>
              </select>
            </div>
          </div>

          <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="border p-2 rounded-md">
              <p className="text-sm text-gray-600">Upload Logo</p>
              <input type="file" name="logo" onChange={handleFileChange} />
            </div>
            <div className="border p-2 rounded-md">
              <p className="text-sm text-gray-600">Upload Cover Image</p>
              <input
                type="file"
                name="coverImage"
                onChange={handleFileChange}
              />
            </div>
          </div>

          <div className="mt-5 flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
            <Button className="bg-activeBackgroundDark" onClick={handleSave}>
              Save Changes
            </Button>
          </div>
        </div>
      ) : (
        <>
          {businessData.coverImage && (
            <div className="mt-4 rounded-md">
              <img
                src={URL.createObjectURL(businessData.coverImage)}
                alt="Cover"
                className="w-full rounded-md object-cover"
              />
            </div>
          )}

          <p className="text-lg font-semibold ">
            {businessData.businessName}
          </p>
          <div className="flex gap-5">
            {businessData.logo && (
              <div>
                <img
                  src={URL.createObjectURL(businessData.logo)}
                  alt="Business Logo"
                  className="w-28 rounded-md object-cover mt-1"
                />
              </div>
            )}
            <div className="rounded-md flex-1 ">
              <p className="text-gray-700 mt-2">{businessData.description}</p>
              <p className="mt-3">
                📍 <span className="font-medium">Address:</span>{" "}
                {businessData.location.address}
              </p>
              <p>
                📞 <span className="font-medium">Phone:</span>{" "}
                {businessData.contact}
              </p>
              <p>
                ⏰ <span className="font-medium">Hours:</span>{" "}
                {businessData.openingHours}
              </p>
            </div>
          </div>

          <div className="rounded-md">
            <p className="text-sm text-gray-600">Location on Map</p>
            <div className="map-container" style={{ height: "400px" }}>
              <LocationPicker
                location={businessData.location}
                onLocationSelect={handleLocationSelect}
              />
            </div>
          </div>

          <div className="flex justify-end py-3">
            <Button variant="outline" onClick={() => setIsEditing(true)}>
              Edit
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
