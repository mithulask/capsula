import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Calendar, Lock, MapPin } from "lucide-react";
import { toast } from "sonner";

interface Capsule {
  id: number;
  title: string;
  content: string | null;
  images?: string[];
  unlock_date: string;
  created_at: string;
  latitude?: number | null;
  longitude?: number | null;
  unlock_radius_m?: number | null;
  locked: boolean;
  locked_reason?: string | null;
  owner_id: number;
}

const CapsuleView: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [capsule, setCapsule] = useState<Capsule | null>(null);
  const [countdown, setCountdown] = useState("");
  const [distance, setDistance] = useState<number | null>(null);

  const fetchCapsule = async (lat?: number, lng?: number) => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/login");

    let url = `http://127.0.0.1:5000/capsules/${id}`;
    if (lat != null && lng != null) url += `?lat=${lat}&lng=${lng}`;

    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) {
      toast.error("Unable to load capsule");
      navigate("/capsules");
      return;
    }

    setCapsule(await res.json());
  };

  // ✅ Distance calculation (meters)
  const calculateDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ) => {
    const R = 6371000;
    const toRad = (v: number) => (v * Math.PI) / 180;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);

    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(lat1)) *
        Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) ** 2;

    return Math.round(R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
  };

  // ✅ Geo polling + auto refresh
  useEffect(() => {
    let watcher: number;

    if (!navigator.geolocation) {
      fetchCapsule();
      return;
    }

    watcher = navigator.geolocation.watchPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;

        if (capsule?.latitude && capsule.longitude) {
          const d = calculateDistance(
            latitude,
            longitude,
            capsule.latitude,
            capsule.longitude
          );
          setDistance(d);
        }

        fetchCapsule(latitude, longitude);
      },
      () => fetchCapsule(),
      { enableHighAccuracy: true }
    );

    return () => navigator.geolocation.clearWatch(watcher);
  }, [id, capsule?.latitude, capsule?.longitude]);

  // ✅ Countdown (time-based)
  useEffect(() => {
    if (!capsule) return;

    const update = () => {
      const diff =
        new Date(capsule.unlock_date).getTime() - Date.now();

      if (diff <= 0) {
        setCountdown("Ready to open!");
        return;
      }

      const s = Math.floor(diff / 1000);
      const m = Math.floor(s / 60);
      const h = Math.floor(m / 60);

      setCountdown(
        h > 0 ? `${h}h ${m % 60}m` : m > 0 ? `${m}m ${s % 60}s` : `${s}s`
      );
    };

    update();
    const i = setInterval(update, 1000);
    return () => clearInterval(i);
  }, [capsule]);

  if (!capsule) return null;

  // ✅ STRICT FRONTEND LOCK RULES (DO NOT TRUST BACKEND)
  const timeReached =
    new Date(capsule.unlock_date).getTime() <= Date.now();

  const locationRequired =
    capsule.latitude != null && capsule.longitude != null;

  const locationReached =
    !locationRequired ||
    (distance !== null &&
      capsule.unlock_radius_m != null &&
      distance <= capsule.unlock_radius_m);

  // ✅ FINAL UNLOCK DECISION
  const unlocked = timeReached && locationReached;


  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50">
      <div className="max-w-4xl mx-auto px-6 py-12">
       <div className="flex items-center gap-3 mb-2">
         <h1 className="text-4xl font-bold">{capsule.title}</h1>

       {!unlocked && (
         <Lock className="w-7 h-7 text-purple-600 animate-pulse" />
       )}
       </div>


        <div className="bg-purple-50 rounded-xl p-6 mb-8">
          <div className="flex items-center gap-3">
            <Calendar className="w-5 h-5" />
            <span>Unlocks on {new Date(capsule.unlock_date).toDateString()}</span>
          </div>

          <div className="mt-4 font-semibold">{countdown}</div>

          {capsule.latitude && distance !== null && capsule.locked && (
            <div className="mt-4 flex items-center gap-2 text-sm text-gray-700">
              <MapPin className="w-4 h-4" />
              {distance <= (capsule.unlock_radius_m ?? 0)
                ? "You are within the unlock area"
                : `${distance}m away from unlock location`}
            </div>
          )}
        </div>

        {/* 🔒 CONTENT ALWAYS HIDDEN WHEN LOCKED */}
        {capsule.locked && (
          <div className="text-center mt-20">
            <Lock className="w-16 h-16 mx-auto text-purple-600" />
            <p className="mt-4 text-gray-600">
              {capsule.locked_reason ||
                "This capsule is locked until time or location unlocks it."}
            </p>
          </div>
        )}

        {/* 🔓 FULL CONTENT ONLY AFTER UNLOCK */}
        {unlocked && (
          <>
            <p className="text-gray-800 text-lg mb-8">
              {capsule.content || "No message inside."}
            </p>

            {capsule.images && capsule.images.length > 0 && (
              <div className="grid grid-cols-3 gap-4">
                {capsule.images.map((img, i) => (
                  <img
                    key={i}
                    src={img}
                    className="w-full h-40 object-cover rounded-lg"
                  />
                ))}
              </div>
            )}
          </>
        )}

        <div className="mt-10">
          <Button variant="outline" onClick={() => navigate("/capsules")}>
            Back
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CapsuleView;
