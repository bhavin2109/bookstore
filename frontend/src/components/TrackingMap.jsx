import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import io from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
// Strip /api if present for socket connection (usually sockets are at root)
const socketBase = SOCKET_URL.replace("/api", "");

// Fix Leaflet Icon
import L from "leaflet";
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

const RecenterMap = ({ lat, lng }) => {
  const map = useMap();
  useEffect(() => {
    map.setView([lat, lng]);
  }, [lat, lng, map]);
  return null;
};

const TrackingMap = ({ orderId, isDeliveryPartner = false }) => {
  const [position, setPosition] = useState({ lat: 40.7128, lng: -74.006 }); // Default NYC
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io(socketBase);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSocket(newSocket);

    newSocket.emit("join_order", orderId);

    newSocket.on("location_update", (coords) => {
      console.log("Received Location Update:", coords);
      setPosition(coords);
    });

    return () => newSocket.close();
  }, [orderId]);

  useEffect(() => {
    let watchId;
    if (isDeliveryPartner && navigator.geolocation) {
      watchId = navigator.geolocation.watchPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          const coords = { lat: latitude, lng: longitude };
          setPosition(coords);
          if (socket) {
            socket.emit("location_update", { orderId, location: coords });
          }
        },
        (err) => console.error(err),
        { enableHighAccuracy: true }
      );
    }
    return () => {
      if (watchId) navigator.geolocation.clearWatch(watchId);
    };
  }, [isDeliveryPartner, socket, orderId]);

  // Simulation for demo (if geolocation fails or dev environment)
  useEffect(() => {
    if (!isDeliveryPartner) return;
    // Mock movement
    const interval = setInterval(() => {
      setPosition((prev) => {
        const newPos = { lat: prev.lat + 0.0001, lng: prev.lng + 0.0001 };
        if (socket) {
          socket.emit("location_update", { orderId, location: newPos });
        }
        return newPos;
      });
    }, 5000);
    return () => clearInterval(interval);
  }, [isDeliveryPartner, socket, orderId]);

  return (
    <div className="h-64 w-full rounded-lg overflow-hidden border border-slate-700 relative z-0">
      <MapContainer
        center={[position.lat, position.lng]}
        zoom={13}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <Marker position={[position.lat, position.lng]}>
          <Popup>
            {isDeliveryPartner ? "You are here" : "Delivery Partner is here"}
          </Popup>
        </Marker>
        <RecenterMap lat={position.lat} lng={position.lng} />
      </MapContainer>
    </div>
  );
};

export default TrackingMap;
