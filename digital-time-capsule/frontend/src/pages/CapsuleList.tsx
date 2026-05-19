import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  Lock,
  LockOpen,
  MapPin,
  Clock,
  Trash2,
  Calendar,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "../components/ui/alert-dialog";

interface Capsule {
  id: number;
  title: string;
  content: string | null;
  media_url?: string | null;
  images?: string[];
  unlock_date: string;
  created_at: string;
  latitude?: number | null;
  longitude?: number | null;
  unlock_radius_m?: number | null;
  locked?: boolean;
  locked_reason?: string | null;
  owner_id: number;
}

const CapsuleList: React.FC = () => {
  const [capsules, setCapsules] = useState<Capsule[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user_id");
    navigate("/login");
  };

  const currentUserId = Number(localStorage.getItem("user_id"));
  const username = localStorage.getItem("username") || "there";

  const fetchCapsules = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) return navigate("/login");

      const res = await fetch("https://capsula-les8.onrender.com/capsules", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      setCapsules(data.capsules || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCapsules();
  }, []);

  const handleDelete = async (id: number) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const res = await fetch(`https://capsula-les8.onrender.com/capsules/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.ok) {
      setCapsules((prev) => prev.filter((c) => c.id !== id));
    }
  };

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading capsules…
      </div>
    );
  }
return (
  <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50">

    {/* Top Nav */}
    <div className="w-full border-b bg-white/70 backdrop-blur-md">
      <div className="max-w-6xl mx-auto flex justify-between items-center py-5 px-6">
        <h1 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
          <Clock className="w-5 h-5 text-purple-500" />
          Capsula
        </h1>

        <div className="flex items-center gap-6">
     <span className="text-gray-700 font-medium">Welcome, {username}!</span>
          <button
            onClick={handleLogout}
            className="text-gray-600 hover:text-gray-800 transition"
          >
            Logout
          </button>
        </div>
      </div>
    </div>

    {/* Page Content */}
    <div className="max-w-6xl mx-auto px-6 py-10">

      {/* Header Section */}
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1
            className="text-5xl font-bold text-gray-900"
            style={{ fontFamily: "Playfair Display, Georgia, serif" }}
          >
            Your Capsules
          </h1>

          <p className="mt-2 text-lg text-gray-600">
            You have {capsules.length} capsule
            {capsules.length !== 1 ? "s" : ""}
          </p>
        </div>

        {/* Create Capsule Button – correctly positioned */}
        <button
          onClick={() => navigate("/create-capsule")}
          className="px-6 py-3 rounded-xl text-white font-medium
          bg-gradient-to-r from-purple-500 to-pink-500 shadow-md flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Create New Capsule
        </button>
      </div>

      {/* Capsule Grid */}
      <div className="flex flex-col gap-6 max-w-xl">
        {capsules.map((c) => {
          const isLocked = c.locked === true;
          const daysRemaining = Math.ceil(
            (new Date(c.unlock_date).getTime() - new Date().getTime()) /
              (1000 * 60 * 60 * 24)
          );

          return (
            <div
              key={c.id}
              className="bg-white rounded-3xl shadow-sm border p-8 relative"
            >
              {/* Title Row */}
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">{c.title}</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Created {new Date(c.created_at).toLocaleDateString()}
                  </p>
                </div>

                <div className="bg-purple-100 p-3 rounded-full">
                  <Lock className="w-5 h-5 text-purple-600" />
                </div>
              </div>

              {/* Open Date */}
              <div className="mt-6">
                <p className="text-gray-500 text-sm mb-1">Opens on:</p>
                <div className="bg-gray-100 rounded-xl px-4 py-3 text-gray-800 font-medium">
                  {new Date(c.unlock_date).toLocaleDateString()}
                </div>
              </div>

              {/* Remaining Days */}
              <div className="bg-gray-100 mt-4 text-center px-4 py-3 rounded-xl text-gray-700 font-medium">
                {daysRemaining} days remaining
              </div>

              {/* Buttons */}
              <div className="flex mt-6 gap-3">
               <Button
                 className="w-full bg-purple-500 hover:bg-purple-600 text-white py-4 text-center"
                 onClick={() => navigate(`/capsules/${c.id}`)}
               >
                 View
               </Button>





                {c.owner_id === currentUserId && (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete capsule?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDelete(c.id)}>
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  </div>
);



};
export default CapsuleList;