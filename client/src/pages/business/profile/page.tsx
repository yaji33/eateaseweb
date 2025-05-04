import { useState, useEffect } from "react";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import LocationPicker from "@/components/business/GeoMapping";

const API_URL = import.meta.env.VITE_API_URL;

interface BusinessData {
  name: string;
  address: {
    street: string;
    city: string;
    province: string;
    zip: string;
    coordinates: {
      latitude: number | null;
      longitude: number | null;
    };
  };
  contact: string;
  business_profile: string;
  restaurant_photo: string;
  restaurant_description: string;
  operating_hours: {
    open: string;
    close: string;
  };
  status: number;
  logo: File | null;
  logoPreview: string | null;
  coverImage: File | null;
  coverImagePreview: string | null;
  profileImageBase64?: string;
  bannerImageBase64?: string;
}

interface Restaurant {
  id: string;
  name: string;
  rating: number;
  rating_count: number;
  business_profile: string;
  restaurant_photo: string;
  restaurant_description: string;
  status: number;
  address: {
    street: string;
    city: string;
    province: string;
    zip: string;
    coordinates: {
      latitude: number | null;
      longitude: number | null;
    };
  };
  contact: string;
  operating_hours: {
    open: string;
    close: string;
  };
}

interface UpdateData {
  name: string;
  business_profile: string;
  restaurant_photo: string;
  restaurant_description: string;
  contact: string;
  address: {
    street: string;
    city: string;
    province: string;
    zip: string;
    coordinates: {
      latitude: number | null;
      longitude: number | null;
    };
  };
  operating_hours: {
    open: string;
    close: string;
  };
  profileImageBase64?: string;
  bannerImageBase64?: string;
}

export default function Page() {
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [loading, setLoading] = useState(true);
  const [launchLoading, setLaunchLoading] = useState(false);

  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [businessData, setBusinessData] = useState<BusinessData>({
    name: "",
    address: {
      street: "",
      city: "",
      province: "",
      zip: "",
      coordinates: {
        latitude: null,
        longitude: null,
      },
    },
    contact: "",
    business_profile: "",
    restaurant_photo: "",
    restaurant_description: "",
    operating_hours: {
      open: "",
      close: "",
    },
    status: 0, // Default status
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
          `${API_URL}/api/restaurants/profile`,
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
          name: response.data.name || "",
          address: {
            street: response.data.address?.street || "",
            city: response.data.address?.city || "",
            province: response.data.address?.province || "",
            zip: response.data.address?.zip || "",
            coordinates: {
              latitude: response.data.address?.coordinates?.latitude || 13.1339,
              longitude:
                response.data.address?.coordinates?.longitude || 123.7333,
            },
          },
          contact: response.data.contact || "",
          operating_hours: {
            open: response.data.operating_hours?.open || "",
            close: response.data.operating_hours?.close || "",
          },
          status: response.data.status || 0,
          logo: null,
          logoPreview: null,
          coverImage: null,
          coverImagePreview: null,
          business_profile: response.data.business_profile || "",
          restaurant_photo: response.data.restaurant_photo || "",
          restaurant_description: response.data.restaurant_description || "",
        });

        setLoading(false);
      } catch (err) {
        if (axios.isAxiosError(err)) {
          setError(
            err.response?.data?.message || "Failed to load restaurant data"
          );
        } else if (err instanceof Error) {
          setError(err.message || "An unexpected error occurred");
        } else {
          setError("An unexpected error occurred");
        }
        setLoading(false);
      }
    };

    fetchRestaurantData();
  }, []);

  interface ChangeEvent {
    target: {
      name: string;
      value: string;
    };
  }

  const handleChange = (e: ChangeEvent) => {
    const { name, value } = e.target;
    setBusinessData((prev) => {
      // Handle nested address fields
      if (name.startsWith("address.")) {
        const addressField = name.split(
          "."
        )[1] as keyof BusinessData["address"];
        return {
          ...prev,
          address: {
            ...prev.address,
            [addressField]: value,
          },
        };
      }
      // Handle nested operating hours
      else if (name.startsWith("hours.")) {
        const hoursField = name.split(
          "."
        )[1] as keyof BusinessData["operating_hours"];
        return {
          ...prev,
          operating_hours: {
            ...prev.operating_hours,
            [hoursField]: value,
          },
        };
      }
      // Handle direct fields
      return {
        ...prev,
        [name]: value,
      };
    });
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

    // Extract address components from the response
    const addressComponents = {
      street: data.address?.road || "",
      city: data.address?.city || data.address?.town || "",
      province: data.address?.state || data.address?.county || "",
      zip: data.address?.postcode || "",
    };

    setBusinessData((prevData) => ({
      ...prevData,
      address: {
        ...prevData.address,
        street: addressComponents.street || prevData.address.street,
        city: addressComponents.city || prevData.address.city,
        province: addressComponents.province || prevData.address.province,
        zip: addressComponents.zip || prevData.address.zip,
        coordinates: {
          latitude: location.lat,
          longitude: location.lng,
        },
      },
    }));
  };

  const fileToBase64 = (file: File): Promise<string | undefined> => {
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

      // Prepare the data to match the backend schema
      const updateData: UpdateData = {
        name: businessData.name,
        business_profile: businessData.business_profile,
        restaurant_photo: businessData.restaurant_photo,
        restaurant_description: businessData.restaurant_description,
        contact: businessData.contact,
        address: {
          street: businessData.address.street || "",
          city: businessData.address.city || "",
          province: businessData.address.province || "",
          zip: businessData.address.zip || "",
          coordinates: {
            latitude: businessData.address.coordinates?.latitude,
            longitude: businessData.address.coordinates?.longitude,
          },
        },
        operating_hours: {
          open: businessData.operating_hours.open,
          close: businessData.operating_hours.close,
        },
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
        "http://localhost:5001/api/restaurants/profile",
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

      // Reset the file inputs and update state with response data
      setBusinessData((prevData) => ({
        ...prevData,
        logo: null,
        coverImage: null,
        status: response.data.status,
        business_profile:
          response.data.business_profile || prevData.business_profile,
        restaurant_photo:
          response.data.restaurant_photo || prevData.restaurant_photo,
      }));

      setSaving(false);
      setIsEditing(false);

      alert("Profile updated successfully!");
    } catch (err) {
      if (axios.isAxiosError(err)) {
        alert(err.response?.data?.message || "Failed to update profile");
      } else if (err instanceof Error) {
        alert(err.message || "An unexpected error occurred");
      } else {
        alert("An unexpected error occurred");
      }
      console.error("Error saving restaurant data:", err);
      setSaving(false);
    }
  };

  // Handle launching the restaurant (changing status to 2)
  const handleLaunchRestaurant = async () => {
    try {
      setLaunchLoading(true);
      const token = localStorage.getItem("token");

      if (!token) {
        setError("You need to be logged in to launch your restaurant");
        setLaunchLoading(false);
        return;
      }

      const response = await axios.put(
        `${API_URL}/api/restaurants/launch`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      // Update the restaurant data with the response
      setRestaurant(response.data);
      setBusinessData((prevData) => ({
        ...prevData,
        status: response.data.status,
      }));

      setLaunchLoading(false);
      alert("Your restaurant is now live!");
    } catch (err) {
      if (axios.isAxiosError(err)) {
        alert(err.response?.data?.message || "Failed to launch restaurant");
      } else if (err instanceof Error) {
        alert(err.message || "An unexpected error occurred");
      } else {
        alert("An unexpected error occurred");
      }
      setLaunchLoading(false);
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

  const getFormattedAddress = () => {
    if (!businessData.address) return "No address available";

    const { street, city, province, zip } = businessData.address;
    return [street, city, province, zip].filter(Boolean).join(", ");
  };

  // Get status text based on status code
  const getStatusText = (status: number) => {
    switch (status) {
      case 0:
        return "Pending Approval";
      case 1:
        return "Approved (Not Published)";
      case 2:
        return "Live";
      default:
        return "Unknown Status";
    }
  };

  // Get status color based on status code
  const getStatusColor = (status: number) => {
    switch (status) {
      case 0:
        return "text-yellow-600 bg-yellow-100";
      case 1:
        return "text-blue-600 bg-blue-100";
      case 2:
        return "text-green-600 bg-green-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  // Check if restaurant can be launched
  const canLaunch = () => {
    return (
      businessData.status === 1 &&
      businessData.name &&
      businessData.address?.street &&
      businessData.address?.city &&
      businessData.contact &&
      businessData.operating_hours?.open &&
      businessData.operating_hours?.close
    );
  };

  if (loading)
    return (
      <div className="flex w-full max-w-5xl mx-auto flex-col min-h-screen bg-background_1 font-poppins px-4 pt-20 gap-5">
        <h1 className="font-semibold text-xl">Restaurant Profile</h1>
        <div className="text-center py-10">Loading restaurant data...</div>
      </div>
    );

  if (error)
    return (
      <div className="flex w-full max-w-5xl mx-auto flex-col min-h-screen bg-background_1 font-poppins px-4 pt-20 gap-5">
        <h1 className="font-semibold text-xl">Restaurant Profile</h1>
        <div className="text-center py-10 text-red-500">Error: {error}</div>
      </div>
    );

  return (
    <div className="flex w-full max-w-5xl mx-auto flex-col min-h-screen bg-background_1 font-poppins px-4 pt-20 gap-5">
      <div className="flex justify-between items-center">
        <h1 className="font-semibold text-xl">Restaurant Profile</h1>
        <div
          className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
            businessData.status
          )}`}
        >
          {getStatusText(businessData.status)}
        </div>
      </div>
      {isEditing ? (
        <div className="flex flex-col bg-white p-5 rounded-md shadow-md">
          <Input
            name="name"
            placeholder="Restaurant Name"
            value={businessData.name}
            onChange={handleChange}
            className="mt-3"
          />

          <Textarea
            name="restaurant_description"
            placeholder="Tell us about your restaurant..."
            value={businessData.restaurant_description}
            onChange={handleChange}
            className="mt-3"
          />

          <Input
            name="contact"
            placeholder="Contact Number"
            value={businessData.contact}
            onChange={handleChange}
            className="mt-3"
          />

          <div className="mt-4">
            <p className="font-medium mb-2">Address Information</p>
            <div className="grid grid-cols-1 gap-2">
              <Input
                name="address.street"
                placeholder="Street Address"
                value={businessData.address.street}
                onChange={handleChange}
              />
              <div className="grid grid-cols-2 gap-2">
                <Input
                  name="address.city"
                  placeholder="City"
                  value={businessData.address.city}
                  onChange={handleChange}
                />
                <Input
                  name="address.province"
                  placeholder="Province/State"
                  value={businessData.address.province}
                  onChange={handleChange}
                />
              </div>
              <Input
                name="address.zip"
                placeholder="Zip/Postal Code"
                value={businessData.address.zip}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="mt-4">
            <p className="text-sm text-gray-600">Pick Your Location</p>
            <div className="map-container" style={{ height: "400px" }}>
              <LocationPicker
                location={{
                  lat: businessData.address.coordinates.latitude,
                  lng: businessData.address.coordinates.longitude,
                }}
                onLocationSelect={handleLocationSelect}
              />
            </div>
            <Button className="mt-3" onClick={getCurrentLocation}>
              Use My Current Location
            </Button>
          </div>

          {/* Operating Hours Section */}
          <div className="mt-4">
            <p className="font-medium mb-2">Operating Hours</p>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-sm text-gray-600">Opening Time</label>
                <Input
                  name="hours.open"
                  type="time"
                  value={businessData.operating_hours.open}
                  onChange={handleChange}
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm text-gray-600">Closing Time</label>
                <Input
                  name="hours.close"
                  type="time"
                  value={businessData.operating_hours.close}
                  onChange={handleChange}
                  className="mt-1"
                />
              </div>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="border p-3 rounded-md">
              <p className="text-sm text-gray-600">
                Upload Restaurant Profile Image
              </p>
              {(businessData.logoPreview || businessData.business_profile) && (
                <div className="mb-2">
                  <img
                    src={
                      businessData.logoPreview || businessData.business_profile
                    }
                    alt="Profile Preview"
                    className="w-24 h-24 object-cover rounded-md mt-2"
                  />
                </div>
              )}
              <input type="file" name="logo" onChange={handleFileChange} />
            </div>
            <div className="border p-3 rounded-md">
              <p className="text-sm text-gray-600">Upload Restaurant Banner</p>
              {(businessData.coverImagePreview ||
                businessData.restaurant_photo) && (
                <div className="mb-2">
                  <img
                    src={
                      businessData.coverImagePreview ||
                      businessData.restaurant_photo
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
          {businessData.restaurant_photo && (
            <div className="mt-4 rounded-md overflow-hidden">
              <img
                src={businessData.restaurant_photo}
                alt="Restaurant Banner"
                className="w-full object-cover"
              />
            </div>
          )}

          <div className="flex gap-5 mt-4">
            {/* Display Logo */}
            {businessData.business_profile && (
              <div>
                <img
                  src={businessData.business_profile}
                  alt="Restaurant Logo"
                  className="w-28 h-28 rounded-full object-cover"
                />
              </div>
            )}
            <div className="flex-1">
              <h2 className="text-xl font-semibold">{businessData.name}</h2>
              <p className="mt-3">
                📍 <span className="font-medium">Address:</span>{" "}
                {getFormattedAddress()}
              </p>
              <p>
                ⏰ <span className="font-medium">Hours:</span>{" "}
                {businessData.operating_hours.open} -{" "}
                {businessData.operating_hours.close}
              </p>
              <p>
                📞 <span className="font-medium">Contact:</span>{" "}
                {businessData.contact}
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

          {businessData.restaurant_description && (
            <div className="mt-4">
              <h3 className="font-medium mb-2">About</h3>
              <p>{businessData.restaurant_description}</p>
            </div>
          )}

          <div className="mt-4">
            <p className="text-sm text-gray-600 mb-2">Location on Map</p>
            <div
              className="map-container rounded-md overflow-hidden"
              style={{ height: "400px" }}
            >
              <LocationPicker
                location={{
                  lat: businessData.address.coordinates.latitude,
                  lng: businessData.address.coordinates.longitude,
                }}
                onLocationSelect={() => {}} // Read-only in view mode
                readOnly={true}
              />
            </div>
          </div>

          <div className="flex justify-end py-5 gap-2">
            {businessData.status === 1 && (
              <Button
                className="bg-green-600 text-white hover:bg-green-700"
                onClick={handleLaunchRestaurant}
                disabled={launchLoading || !canLaunch()}
                title={!canLaunch() ? "Complete your profile first" : ""}
              >
                {launchLoading ? "Launching..." : "Launch Restaurant"}
              </Button>
            )}
            <Button
              className="bg-activeBackgroundDark text-white hover:bg-opacity-90"
              onClick={() => setIsEditing(true)}
            >
              Edit Profile
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
