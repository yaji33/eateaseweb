import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Define props interface for LocationPicker
export interface LocationPickerProps {
  location: {
    lat: number | null;
    lng: number | null;
  };
  onLocationSelect: (location: { lat: number; lng: number }) => void;
  readOnly?: boolean;
}

const LocationPicker: React.FC<LocationPickerProps> = ({
  location,
  onLocationSelect,
  readOnly = false,
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);

  // Initialize the map
  useEffect(() => {
    if (!mapRef.current) return;

    // Set default location if none provided
    const defaultLat = location?.lat ?? 13.1339;
    const defaultLng = location?.lng ?? 123.7333;

    // Initialize the map
    const mapInstance = L.map(mapRef.current).setView(
      [defaultLat, defaultLng],
      13
    );

    // Add OpenStreetMap tile layer
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(mapInstance);

    // Add a marker at the current location
    const marker = L.marker([defaultLat, defaultLng], {
      draggable: !readOnly, // Make marker draggable if not in readOnly mode
    }).addTo(mapInstance);

    // Store map and marker instances in refs
    mapInstanceRef.current = mapInstance;
    markerRef.current = marker;

    // Handle marker drag end event (if not readOnly)
    if (!readOnly) {
      marker.on("dragend", () => {
        const position = marker.getLatLng();
        onLocationSelect({ lat: position.lat, lng: position.lng });
      });

      // Handle map click event for moving marker
      mapInstance.on("click", (e) => {
        const { lat, lng } = e.latlng;
        marker.setLatLng([lat, lng]);
        onLocationSelect({ lat, lng });
      });
    }

    // Cleanup function
    return () => {
      mapInstance.remove();
      mapInstanceRef.current = null;
      markerRef.current = null;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [readOnly]); // Only recreate map when readOnly status changes

  // Update marker position if location changes
  useEffect(() => {
    if (
      markerRef.current &&
      mapInstanceRef.current &&
      location?.lat &&
      location?.lng
    ) {
      markerRef.current.setLatLng([location.lat, location.lng]);
      mapInstanceRef.current.setView(
        [location.lat, location.lng],
        mapInstanceRef.current.getZoom()
      );
    }
  }, [location]);

  return <div ref={mapRef} style={{ width: "100%", height: "100%" }} />;
};

export default LocationPicker;
