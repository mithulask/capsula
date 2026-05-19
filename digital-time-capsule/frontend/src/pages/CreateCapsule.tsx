// CreateCapsule.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Upload, X } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { Card } from "../components/ui/card";
import GoogleMapPicker from "../components/GoogleMapPicker";
import { toast } from "sonner";

const CreateCapsule: React.FC = () => {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [unlockDate, setUnlockDate] = useState("");
  const [lat, setLat] = useState<number | null>(null);
  const [lng, setLng] = useState<number | null>(null);
  const [radius, setRadius] = useState(100);
  const [images, setImages] = useState<string[]>([]);
  const [loadingImages, setLoadingImages] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      setLoadingImages((prev) => prev + 1);
      reader.onloadend = () => {
        setImages((prev) => [...prev, reader.result as string]);
        setLoadingImages((prev) => prev - 1);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => setImages((prev) => prev.filter((_, i) => i !== index));

  const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}T00:00`;
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!title.trim()) {
      toast.error("Please enter a title");
      setIsLoading(false);
      return;
    }
    if (!content.trim()) {
      toast.error("Please enter a message");
      setIsLoading(false);
      return;
    }
    if (!unlockDate) {
      toast.error("Please select a date");
      setIsLoading(false);
      return;
    }
    if (loadingImages > 0) {
      toast.error("Please wait until all images are fully loaded");
      setIsLoading(false);
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    let unlockDateISO = new Date(unlockDate).toISOString();
    if (unlockDateISO.endsWith("Z")) unlockDateISO = unlockDateISO.replace("Z", "+00:00");

    const payload: any = { title, content, unlock_date: unlockDateISO };

    if (lat !== null && lng !== null) {
      payload.latitude = lat;
      payload.longitude = lng;
      payload.unlock_radius_m = radius;
    }

    if (images.length) payload.images = images;

    try {
      const res = await fetch("https://capsula-les8.onrender.com/capsules", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        toast.success("Capsule created successfully!");
        // Clear form
        setTitle("");
        setContent("");
        setUnlockDate("");
        setLat(null);
        setLng(null);
        setRadius(100);
        setImages([]);
        setTimeout(() => navigate("/capsules"), 800);
      } else {
        const err = await res.json().catch(() => null);
        toast.error(err?.error || "Failed to create capsule");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error creating capsule");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Button variant="ghost" onClick={() => navigate("/capsules")}>
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2" style={{ fontFamily: 'Playfair Display, Georgia, serif' }}>
            Create New Capsule
          </h1>
          <p className="text-gray-600">Fill your capsule with memories and set a date or location to unlock it</p>
        </div>

        <Card className="p-8">
          <form onSubmit={handleCreate} className="space-y-6">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">Capsule Title</Label>
              <Input id="title" type="text" placeholder="e.g., Memories from 2025" value={title} onChange={e => setTitle(e.target.value)} required />
            </div>

            {/* Content */}
            <div className="space-y-2">
              <Label htmlFor="content">Message</Label>
              <Textarea id="content" placeholder="Write a message to your future self..." value={content} onChange={e => setContent(e.target.value)} rows={6} required />
            </div>

            {/* Unlock Date */}
            <div className="space-y-2">
              <Label htmlFor="unlockDate">Unlock Date & Time</Label>
              <Input id="unlockDate" type="datetime-local" value={unlockDate} onChange={e => setUnlockDate(e.target.value)} min={getTodayDate()} required />
              <p className="text-gray-500 text-sm mt-1">Choose when you want to unlock this capsule</p>
            </div>

            {/* Location */}
            <div className="space-y-2 border-t border-gray-200 pt-6">
              <Label>Unlock Location (Optional)</Label>
              <GoogleMapPicker lat={lat} lng={lng} radius={radius} onChange={(newLat, newLng) => { setLat(newLat); setLng(newLng); }} />
              {lat !== null && lng !== null && (
                <div className="space-y-2">
                  <Label htmlFor="radius">Unlock Radius (meters)</Label>
                  <Input id="radius" type="number" value={radius} onChange={e => setRadius(Number(e.target.value))} min={10} step={10} />
                  <p className="text-gray-500 text-sm mt-1">Capsule unlocks when within this distance</p>
                </div>
              )}
            </div>

            {/* Images */}
            <div className="space-y-2">
              <Label>Images (Optional)</Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-purple-400 transition-colors">
                <input id="images" type="file" accept="image/*" multiple onChange={handleImageUpload} className="hidden" />
                <label htmlFor="images" className="cursor-pointer flex flex-col items-center">
                  <Upload className="w-8 h-8 text-gray-400 mb-2" />
                  <span className="text-gray-600">Click to upload images</span>
                  <span className="text-gray-400">PNG, JPG, GIF up to 10MB</span>
                </label>
              </div>
              {images.length > 0 && (
                <div className="grid grid-cols-3 gap-4 mt-4">
                  {images.map((img, idx) => (
                    <div key={idx} className="relative group">
                      <img src={img} alt={`Upload ${idx+1}`} className="w-full h-32 object-cover rounded-lg" />
                      <button type="button" onClick={() => removeImage(idx)} className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Buttons */}
            <div className="flex gap-4 pt-6">
              <Button type="button" variant="outline" onClick={() => navigate("/capsules")} className="flex-1">Cancel</Button>
              <Button type="submit" className="flex-1" disabled={isLoading || loadingImages > 0}>
                {isLoading ? "Creating..." : "Create Capsule"}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default CreateCapsule;
