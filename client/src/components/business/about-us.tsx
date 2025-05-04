import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export default function BusinessDetails() {
  const [isEditing, setIsEditing] = useState(false);
  const [businessData, setBusinessData] = useState({
    businessName: "EatEase Café",
    description:
      "A cozy café serving fresh pastries, handcrafted coffee, and all-day breakfast.",
    location: "123 Food Street, Albay",
    contact: "+63 912 345 6789",
    openingHours: "8:00 AM - 10:00 PM",
    logo: null,
    coverImage: null,
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setBusinessData({ ...businessData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setBusinessData({ ...businessData, [e.target.name]: e.target.files[0] });
    }
  };

  const handleSave = () => {
    setIsEditing(false);
    console.log("Saved Data:", businessData);
  };

  return (
    <div className=" bg-white p-6 rounded-lg shadow-md mt-2">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold text-gray-900">
          Business Details
        </h2>
        {!isEditing && (
          <Button variant="outline" onClick={() => setIsEditing(true)}>
            Edit
          </Button>
        )}
      </div>

      {isEditing ? (
        <>
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
          <div className="grid grid-cols-2 gap-4 mt-3">
            <Input
              name="location"
              placeholder="Address"
              value={businessData.location}
              onChange={handleChange}
            />
            <Input
              name="contact"
              placeholder="Phone Number"
              value={businessData.contact}
              onChange={handleChange}
            />
          </div>
          <div className="mt-3">
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
          <div className="mt-4 flex gap-4">
            <div className="border p-2 rounded-md w-1/2">
              <p className="text-sm text-gray-600">Upload Logo</p>
              <input type="file" name="logo" onChange={handleFileChange} />
            </div>
            <div className="border p-2 rounded-md w-1/2">
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
        </>
      ) : (
        <>
          {businessData.coverImage && (
            <div className="mt-4">
              <img
                src={URL.createObjectURL(businessData.coverImage)}
                alt="Cover"
                className="w-full rounded-md object-cover mt-1"
              />
            </div>
          )}
          <p className="text-lg font-semibold mt-4">
            {businessData.businessName}
          </p>
          <div className="py-5 flex gap-8">
            {businessData.logo && (
              <div className="">
                <img
                  src={URL.createObjectURL(businessData.logo)}
                  alt="Business Logo"
                  className="w-28 rounded-md object-cover mt-1"
                />
              </div>
            )}
            <div>
              <p className="text-gray-700 mt-2">{businessData.description}</p>
              <p className="mt-3">
                📍 <span className="font-medium">Address:</span>{" "}
                {businessData.location}
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
        </>
      )}
    </div>
  );
}
