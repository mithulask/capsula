import React, { useState } from "react";
import { GoogleMap, Marker, Circle, useLoadScript, Autocomplete } from "@react-google-maps/api";

interface Props {
  lat: number | null;
  lng: number | null;
  radius: number;
  onChange: (lat: number, lng: number) => void;
}

const containerStyle = { width: "100%", height: "350px" };
const defaultCenter = { lat: 37.7749, lng: -122.4194 };
const libraries: ("places")[] = ["places"];

const GoogleMapPicker: React.FC<Props> = ({ lat, lng, radius, onChange }) => {
  const [autocomplete, setAutocomplete] = useState<google.maps.places.Autocomplete | null>(null);

  // ✅ FIX: Add debugging and fallback
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  console.log("API Key loaded:", apiKey ? "✅ Yes" : "❌ No");
  console.log("Environment:", import.meta.env);

  if (!apiKey) {
    return (
      <div style={{ padding: 16, border: "1px solid #f44336", background: "#ffebee" }}>
        <p>⚠️ Google Maps API key missing.</p>
        <p>Check that:</p>
        <ul>
          <li>Your .env file is in the project root</li>
          <li>The variable is named VITE_GOOGLE_MAPS_API_KEY</li>
          <li>You've restarted the dev server after adding the .env file</li>
        </ul>
        <p>Enter coordinates manually below.</p>
      </div>
    );
  }

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: apiKey,
    libraries,
  });

  // ✅ FIX: Better error messaging
  if (loadError) {
    console.error("Google Maps Load Error:", loadError);
    return (
      <div style={{ padding: 16, border: "1px solid #f44336", background: "#ffebee" }}>
        <p>❌ Failed to load Google Maps.</p>
        <p>Error: {loadError.message}</p>
        <p>Check that:</p>
        <ul>
          <li>Your API key is valid</li>
          <li>Billing is enabled in Google Cloud Console</li>
          <li>Maps JavaScript API is enabled</li>
          <li>Places API is enabled</li>
        </ul>
      </div>
    );
  }

  if (!isLoaded) return <p>Loading map…</p>;

  const hasCoords = lat !== null && lng !== null;
  const center = hasCoords ? { lat, lng } : defaultCenter;

  const onPlaceChanged = () => {
    if (autocomplete) {
      const place = autocomplete.getPlace();
      if (place.geometry?.location) {
        const newLat = place.geometry.location.lat();
        const newLng = place.geometry.location.lng();
        console.log("Place selected:", newLat, newLng);
        onChange(newLat, newLng);
      }
    }
  };

  return (
    <div>
      <Autocomplete onLoad={auto => setAutocomplete(auto)} onPlaceChanged={onPlaceChanged}>
        <input
          type="text"
          placeholder="Type a location (e.g., 'Times Square, NYC')"
          style={{
            width: "100%",
            padding: 8,
            marginBottom: 10,
            border: "1px solid #ccc",
            borderRadius: 4
          }}
        />
      </Autocomplete>

      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={hasCoords ? 14 : 4}
        onClick={(e) => {
          if (e.latLng) {
            const clickedLat = e.latLng.lat();
            const clickedLng = e.latLng.lng();
            console.log("Map clicked:", clickedLat, clickedLng);
            onChange(clickedLat, clickedLng);
          }
        }}
      >
        {hasCoords && (
          <>
            <Marker position={{ lat, lng }} />
            <Circle
              center={{ lat, lng }}
              radius={radius}
              options={{
                fillColor: "#4285F4",
                fillOpacity: 0.2,
                strokeColor: "#4285F4",
                strokeOpacity: 0.6,
                strokeWeight: 2,
                clickable: false,
              }}
            />
          </>
        )}
      </GoogleMap>

      {/* ✅ FIX: Show current coordinates */}
      {hasCoords && (
        <p style={{ marginTop: 8, fontSize: 12, color: "#666" }}>
          Selected: {lat.toFixed(6)}, {lng.toFixed(6)}
        </p>
      )}
    </div>
  );
};

export default GoogleMapPicker;