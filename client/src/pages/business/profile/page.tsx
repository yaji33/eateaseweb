import { useState, useEffect } from "react";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import LocationPicker from "@/components/business/GeoMapping";

interface BusinessData {
  businessName: string;
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  businessProfile: string | null;
  businessBanner: string | null;
  contact: string;
  openingHours: {
    monday: string;
    tuesday: string;
    wednesday: string;
    thursday: string;
    friday: string;
    saturday: string;
    sunday: string;
  };
  logo: File | null;
  logoPreview: string | null;
  coverImage: File | null;
  coverImagePreview: string | null;
  profileImageBase64?: string;
  bannerImageBase64?: string;
}

export default function Page() {
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);

  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [businessData, setBusinessData] = useState<BusinessData>({
    businessName: "",
    location: {
      lat: 13.1339,
      lng: 123.7333,
      address: "",
    },
    businessProfile: null,
    businessBanner: null,
    contact: "",
    openingHours: {
      monday: "",
      tuesday: "",
      wednesday: "",
      thursday: "",
      friday: "",
      saturday: "",
      sunday: "",
    },
    logo: null,
    logoPreview: null,
    coverImage: null,
    coverImagePreview: null,
  });

  const [error, setError] = useState<string | null>(null);

  // Fetch restaurant data when component mounts
  useEffect(() => {
    const fetchRestaurantData = async () => {
      try {
        setLoading(true);
        // Get the auth token from localStorage
        const token = localStorage.getItem("token");

        if (!token) {
          setError("You need to be logged in to view this page");
          setLoading(false);
          return;
        }

        const response = await axios.get(
          "http://localhost:5001/api/restaurant_dummy/profile",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // Set the raw restaurant data
        setRestaurant(response.data);

        // Update the businessData state with fetched data
        setBusinessData({
          businessName: response.data.name || "",
          location: {
            lat: response.data.address?.coordinates?.latitude || 13.1339,
            lng: response.data.address?.coordinates?.longitude || 123.7333,
            address: response.data.address?.text || "",
          },
          contact: response.data.contact || "",
          openingHours: {
            monday: response.data.operating_hours?.monday || "",
            tuesday: response.data.operating_hours?.tuesday || "",
            wednesday: response.data.operating_hours?.wednesday || "",
            thursday: response.data.operating_hours?.thursday || "",
            friday: response.data.operating_hours?.friday || "",
            saturday: response.data.operating_hours?.saturday || "",
            sunday: response.data.operating_hours?.sunday || "",
          },
          logo: null,
          logoPreview: null,
          coverImage: null,
          coverImagePreview: null,
          businessProfile: response.data.business_profile || "",
          businessBanner: response.data.business_banner || "",
        });

        setLoading(false);
      } catch (err) {
        console.error("Error fetching restaurant data:", err);
        setError(
          err.response?.data?.message || "Failed to load restaurant data"
        );
        setLoading(false);
      }
    };

    fetchRestaurantData();
  }, []);

  const handleChange = (e) => {
    setBusinessData({ ...businessData, [e.target.name]: e.target.value });
  };

  const handleOperatingHoursChange = (day: string, value: string) => {
    setBusinessData((prev) => ({
      ...prev,
      openingHours: {
        ...prev.openingHours,
        [day]: value,
      },
    }));
  };

  const handleLocationSelect = async (location: {
    lat: number;
    lng: number;
  }) => {
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

  const fileToBase64 = (file: File) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64String = (reader.result as string).split(",")[1];
        resolve(base64String);
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Create preview for UI
      const previewUrl = URL.createObjectURL(file);

      if (e.target.name === "logo") {
        setBusinessData({
          ...businessData,
          logo: file,
          logoPreview: previewUrl,
        });
      } else if (e.target.name === "coverImage") {
        setBusinessData({
          ...businessData,
          coverImage: file,
          coverImagePreview: previewUrl,
        });
      }
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      // Get the auth token from localStorage
      const token = localStorage.getItem("token");

      if (!token) {
        setError("You need to be logged in to save changes");
        setSaving(false);
        return;
      }

      // Prepare the base data
      const updateData = {
        name: businessData.businessName,

        contact: businessData.contact,
        address: {
          text: businessData.location.address,
          coordinates: {
            latitude: businessData.location.lat,
            longitude: businessData.location.lng,
          },
        },
        operating_hours: businessData.openingHours,
      };

      // Handle logo upload if changed
      if (businessData.logo) {
        const logoBase64 = await fileToBase64(businessData.logo);
        updateData.profileImageBase64 = logoBase64;
      }

      // Handle cover image upload if changed
      if (businessData.coverImage) {
        const coverBase64 = await fileToBase64(businessData.coverImage);
        updateData.bannerImageBase64 = coverBase64;
      }

      // Send the update request
      const response = await axios.put(
        "http://localhost:5001/api/restaurant_dummy/profile",
        updateData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      // Update the restaurant data with the response
      setRestaurant(response.data);

      // Reset the file inputs
      setBusinessData((prevData) => ({
        ...prevData,
        logo: null,
        coverImage: null,
        businessProfile:
          response.data.business_profile || prevData.businessProfile,
        businessBanner:
          response.data.business_banner || prevData.businessBanner,
      }));

      setSaving(false);
      setIsEditing(false);

      alert("Profile updated successfully!");
    } catch (err) {
      console.error("Error saving restaurant data:", err);
      setSaving(false);
      alert(err.response?.data?.message || "Failed to update profile");
    }
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

  const getDaySchedule = () => {
    // Get current day of the week
    const days = [
      "sunday",
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
    ];
    const today = days[new Date().getDay()];
    return businessData.openingHours[today] || "Closed";
  };

  if (loading)
    return (
      <div className="flex w-full max-w-5xl mx-auto flex-col min-h-screen bg-background_1 font-poppins px-4 pt-20 gap-5">
        <h1 className="font-semibold text-xl">Profile Page</h1>
        <div className="text-center py-10">Loading restaurant data...</div>
      </div>
    );

  if (error)
    return (
      <div className="flex w-full max-w-5xl mx-auto flex-col min-h-screen bg-background_1 font-poppins px-4 pt-20 gap-5">
        <h1 className="font-semibold text-xl">Profile Page</h1>
        <div className="text-center py-10 text-red-500">Error: {error}</div>
      </div>
    );

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
                location={{
                  lat: businessData.location.lat,
                  lng: businessData.location.lng,
                }}
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

          {/* Operating Hours Section */}
          <div className="mt-4">
            <p className="text-sm text-gray-600">Operating Hours</p>
            <div className="grid grid-cols-1 gap-2 mt-2">
              {Object.keys(businessData.openingHours).map((day) => (
                <div key={day} className="flex items-center">
                  <span className="w-24 capitalize">{day}:</span>
                  <Input
                    value={businessData.openingHours[day]}
                    onChange={(e) =>
                      handleOperatingHoursChange(day, e.target.value)
                    }
                    placeholder="e.g. 9:00 AM - 5:00 PM"
                    className="flex-1"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="border p-2 rounded-md">
              <p className="text-sm text-gray-600">
                Upload Business Profile Image
              </p>
              {(businessData.logoPreview || businessData.businessProfile) && (
                <div className="mb-2">
                  <img
                    src={
                      businessData.logoPreview || businessData.businessProfile
                    }
                    alt="Profile Preview"
                    className="w-24 h-24 object-cover rounded-md mt-2"
                  />
                </div>
              )}
              <input type="file" name="logo" onChange={handleFileChange} />
            </div>
            <div className="border p-2 rounded-md">
              <p className="text-sm text-gray-600">Upload Business Banner</p>
              {(businessData.coverImagePreview ||
                businessData.businessBanner) && (
                <div className="mb-2">
                  <img
                    src={
                      businessData.coverImagePreview ||
                      businessData.businessBanner
                    }
                    alt="Banner Preview"
                    className="w-full h-24 object-cover rounded-md mt-2"
                  />
                </div>
              )}
              <input
                type="file"
                name="coverImage"
                onChange={handleFileChange}
              />
            </div>
          </div>

          <div className="mt-5 flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setIsEditing(false)}
              disabled={saving}
            >
              Cancel
            </Button>
            <Button
              className="bg-activeBackgroundDark"
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>
      ) : (
        <>
          {/* Display Banner */}
          {businessData.businessBanner && (
            <div className="mt-4 rounded-md">
              <img
                src={businessData.businessBanner}
                alt="Business Banner"
                className="w-full h-72 rounded-md object-cover"
              />
            </div>
          )}

          <div className="flex gap-5">
            {/* Display Logo */}
            {businessData.businessProfile && (
              <div>
                <img
                  src={businessData.businessProfile}
                  alt="Business Logo"
                  className="w-28 h-28 rounded-md object-cover mt-1"
                />
              </div>
            )}
            <div className="rounded-md flex-1 ">
              <p className="text-lg font-semibold ">
                {businessData.businessName}
              </p>
              <p className="mt-3">
                📍 <span className="font-medium">Address:</span>{" "}
                {businessData.location.address}
              </p>
              <p>
                ⏰ <span className="font-medium">Today's Hours:</span>{" "}
                {getDaySchedule()}
              </p>
              {restaurant && restaurant.rating > 0 && (
                <p>
                  ⭐ <span className="font-medium">Rating:</span>{" "}
                  {restaurant.rating.toFixed(1)} ({restaurant.rating_count}{" "}
                  reviews)
                </p>
              )}
            </div>
          </div>

          <div className="rounded-md mt-4">
            <p className="text-sm text-gray-600">Location on Map</p>
            <div className="map-container" style={{ height: "400px" }}>
              <LocationPicker
                location={{
                  lat: businessData.location.lat,
                  lng: businessData.location.lng,
                }}
                onLocationSelect={() => {}} // Read-only in view mode
                readOnly={true}
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
