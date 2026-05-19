import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Upload, X, Sparkles } from "lucide-react";
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
    Array.from(files).forEach(file => {
      const reader = new FileReader();
      setLoadingImages(p => p + 1);
      reader.onloadend = () => { setImages(p => [...p, reader.result as string]); setLoadingImages(p => p - 1); };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (i: number) => setImages(p => p.filter((_, idx) => idx !== i));

  const getTodayDate = () => {
    const t = new Date();
    return `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, "0")}-${String(t.getDate()).padStart(2, "0")}T00:00`;
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) { toast.error("Please enter a title"); return; }
    if (!content.trim()) { toast.error("Please enter a message"); return; }
    if (!unlockDate) { toast.error("Please select a date"); return; }
    if (loadingImages > 0) { toast.error("Images still loading..."); return; }
    setIsLoading(true);
    const token = localStorage.getItem("token");
    if (!token) { navigate("/login"); return; }
    let unlockDateISO = new Date(unlockDate).toISOString();
    if (unlockDateISO.endsWith("Z")) unlockDateISO = unlockDateISO.replace("Z", "+00:00");
    const payload: any = { title, content, unlock_date: unlockDateISO };
    if (lat !== null && lng !== null) { payload.latitude = lat; payload.longitude = lng; payload.unlock_radius_m = radius; }
    if (images.length) payload.images = images;
    try {
      const res = await fetch("https://capsula-les8.onrender.com/capsules", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
      });
      if (res.ok) { toast.success("Capsule sealed! ✦"); setTimeout(() => navigate("/capsules"), 800); }
      else { const err = await res.json().catch(() => null); toast.error(err?.error || "Failed to create capsule"); }
    } catch { toast.error("Error creating capsule"); }
    finally { setIsLoading(false); }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f8f5ff", fontFamily: "'DM Sans',sans-serif", color: "#1c1c2e" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;1,400&family=DM+Sans:wght@300;400;500&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        @keyframes fadeUp{from{opacity:0;transform:translateY(28px)}to{opacity:1;transform:translateY(0)}}
        @keyframes fadeIn{from{opacity:0}to{opacity:1}}
        @keyframes slideIn{from{opacity:0;transform:translateX(-16px)}to{opacity:1;transform:translateX(0)}}
        @keyframes blobPulse{0%,100%{border-radius:60% 40% 30% 70%/60% 30% 70% 40%}50%{border-radius:30% 60% 70% 40%/50% 60% 30% 60%}}
        @keyframes pulse{0%,100%{opacity:0.15}50%{opacity:0.25}}
        @keyframes spin{to{transform:rotate(360deg)}}

        .cc-nav{display:flex;align-items:center;padding:1.2rem 2.5rem;background:rgba(255,255,255,0.82);backdrop-filter:blur(16px);border-bottom:1px solid rgba(180,160,220,0.12);gap:1rem;animation:fadeIn 0.5s ease both;}
        .cc-back{display:flex;align-items:center;gap:6px;background:none;border:none;color:#9990b0;font-size:13px;cursor:pointer;font-family:'DM Sans',sans-serif;transition:all 0.2s;}
        .cc-back:hover{color:#2d1f5e;transform:translateX(-3px);}
        .cc-logo{font-family:'Playfair Display',serif;font-size:20px;color:#2d1f5e;margin-left:auto;}
        .cc-logo em{font-style:italic;color:#b07fe8;}

        .cc-hero{background:linear-gradient(155deg,#ede9ff 0%,#fce4f3 50%,#ddeeff 100%);padding:3.5rem 2.5rem 2.5rem;position:relative;overflow:hidden;}
        .cc-blob{position:absolute;filter:blur(45px);pointer-events:none;}
        .cc-b1{width:200px;height:200px;background:#b07fe8;top:-60px;right:5%;opacity:0.18;border-radius:60% 40% 30% 70%/60% 30% 70% 40%;animation:blobPulse 9s ease-in-out infinite,pulse 7s ease-in-out infinite;}
        .cc-b2{width:160px;height:160px;background:#e87fc0;bottom:-40px;right:30%;opacity:0.14;border-radius:30% 60% 70% 40%/50% 60% 30% 60%;animation:blobPulse 11s ease-in-out infinite reverse,pulse 8s ease-in-out infinite;}
        .cc-hero-label{font-size:11px;letter-spacing:0.15em;text-transform:uppercase;color:#b07fe8;margin-bottom:0.75rem;animation:fadeUp 0.6s 0.1s ease both;opacity:0;animation-fill-mode:forwards;}
        .cc-hero-headline{font-family:'Playfair Display',serif;font-size:40px;font-weight:400;color:#1c1c2e;margin-bottom:0.5rem;animation:fadeUp 0.6s 0.2s ease both;opacity:0;animation-fill-mode:forwards;}
        .cc-hero-headline em{font-style:italic;color:#c06fa8;}
        .cc-hero-sub{font-size:14px;color:#9990b0;font-weight:300;animation:fadeUp 0.6s 0.3s ease both;opacity:0;animation-fill-mode:forwards;}

        .cc-form-wrap{max-width:700px;margin:0 auto;padding:3rem 2.5rem;}
        .cc-field{margin-bottom:1.75rem;animation:slideIn 0.5s ease both;animation-fill-mode:forwards;}
        .cc-label{display:block;font-size:11px;letter-spacing:0.1em;text-transform:uppercase;color:#9990b0;margin-bottom:0.6rem;}
        .cc-input{width:100%;padding:13px 16px;border:1.5px solid rgba(180,160,220,0.25);border-radius:16px;font-size:14px;font-family:'DM Sans',sans-serif;background:#fff;color:#1c1c2e;outline:none;transition:border-color 0.2s,box-shadow 0.2s;}
        .cc-input:focus{border-color:#b07fe8;box-shadow:0 0 0 4px rgba(176,127,232,0.1);}
        .cc-input::placeholder{color:#d0c8e0;}
        .cc-textarea{width:100%;padding:13px 16px;border:1.5px solid rgba(180,160,220,0.25);border-radius:16px;font-size:14px;font-family:'DM Sans',sans-serif;background:#fff;color:#1c1c2e;outline:none;resize:vertical;min-height:140px;transition:border-color 0.2s,box-shadow 0.2s;line-height:1.7;}
        .cc-textarea:focus{border-color:#b07fe8;box-shadow:0 0 0 4px rgba(176,127,232,0.1);}
        .cc-textarea::placeholder{color:#d0c8e0;}
        .cc-hint{font-size:12px;color:#c8c0d8;margin-top:0.4rem;}
        .cc-divider{border:none;border-top:1px solid rgba(180,160,220,0.15);margin:2.25rem 0;}
        .cc-section-title{font-family:'Playfair Display',serif;font-size:19px;font-weight:400;color:#2d1f5e;margin-bottom:1rem;}
        .cc-optional{font-size:13px;color:#c8c0d8;font-family:'DM Sans',sans-serif;font-weight:300;}

        .cc-upload{border:2px dashed rgba(180,160,220,0.35);border-radius:22px;padding:2.5rem;text-align:center;cursor:pointer;transition:all 0.25s;background:rgba(255,255,255,0.5);}
        .cc-upload:hover{border-color:#b07fe8;background:#faf5ff;}
        .cc-upload-icon{width:48px;height:48px;background:#ede9ff;border-radius:14px;display:flex;align-items:center;justify-content:center;margin:0 auto 0.875rem;transition:transform 0.2s;}
        .cc-upload:hover .cc-upload-icon{transform:scale(1.08);}
        .cc-upload-text{font-size:14px;color:#9990b0;}
        .cc-upload-hint{font-size:12px;color:#c8c0d8;margin-top:0.25rem;}
        .cc-imgs-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:0.75rem;margin-top:1rem;}
        .cc-img-wrap{position:relative;border-radius:16px;overflow:hidden;}
        .cc-img-del{position:absolute;top:8px;right:8px;background:rgba(255,255,255,0.92);border:none;border-radius:50%;width:26px;height:26px;display:flex;align-items:center;justify-content:center;cursor:pointer;color:#e05577;transition:transform 0.2s;}
        .cc-img-del:hover{transform:scale(1.15);}

        .cc-btn-row{display:flex;gap:1rem;margin-top:2.25rem;}
        .cc-btn-cancel{flex:1;padding:14px;background:#fff;color:#9990b0;border:1.5px solid rgba(180,160,220,0.3);border-radius:100px;font-size:14px;cursor:pointer;font-family:'DM Sans',sans-serif;transition:all 0.2s;}
        .cc-btn-cancel:hover{border-color:#b07fe8;color:#7c5cbf;}
        .cc-btn-create{flex:1;padding:14px;background:#2d1f5e;color:#fff;border:none;border-radius:100px;font-size:14px;cursor:pointer;font-family:'DM Sans',sans-serif;transition:all 0.2s;display:flex;align-items:center;justify-content:center;gap:7px;}
        .cc-btn-create:hover:not(:disabled){transform:translateY(-2px);box-shadow:0 8px 24px rgba(45,31,94,0.28);background:#3d2f7e;}
        .cc-btn-create:disabled{opacity:0.65;cursor:not-allowed;}
        .cc-spinner{width:16px;height:16px;border:2px solid rgba(255,255,255,0.3);border-top-color:#fff;border-radius:50%;animation:spin 0.7s linear infinite;}
      `}</style>

      <nav className="cc-nav">
        <button className="cc-back" onClick={() => navigate("/capsules")}><ArrowLeft size={14} /> Back</button>
        <span className="cc-logo">Cap<em>sula</em>®</span>
      </nav>

      <div className="cc-hero">
        <div className="cc-blob cc-b1" />
        <div className="cc-blob cc-b2" />
        <div className="cc-hero-label">New capsule</div>
        <h1 className="cc-hero-headline">Seal a <em>memory</em></h1>
        <p className="cc-hero-sub">Fill your capsule with messages and set a date or location to unlock it.</p>
      </div>

      <div className="cc-form-wrap">
        <form onSubmit={handleCreate}>
          <div className="cc-field" style={{ animationDelay: "0.1s" }}>
            <label className="cc-label">Capsule Title</label>
            <input className="cc-input" type="text" placeholder="e.g. Memories from summer 2026" value={title} onChange={e => setTitle(e.target.value)} required />
          </div>

          <div className="cc-field" style={{ animationDelay: "0.15s" }}>
            <label className="cc-label">Message</label>
            <textarea className="cc-textarea" placeholder="Write a message to your future self..." value={content} onChange={e => setContent(e.target.value)} required />
          </div>

          <div className="cc-field" style={{ animationDelay: "0.2s" }}>
            <label className="cc-label">Unlock Date & Time</label>
            <input className="cc-input" type="datetime-local" value={unlockDate} onChange={e => setUnlockDate(e.target.value)} min={getTodayDate()} required />
            <div className="cc-hint">Choose when this capsule unlocks</div>
          </div>

          <hr className="cc-divider" />

          <div className="cc-section-title">Unlock Location <span className="cc-optional">— optional</span></div>
          <GoogleMapPicker lat={lat} lng={lng} radius={radius} onChange={(newLat, newLng) => { setLat(newLat); setLng(newLng); }} />
          {lat !== null && lng !== null && (
            <div className="cc-field" style={{ marginTop: "1rem", animationDelay: "0s" }}>
              <label className="cc-label">Unlock Radius (meters)</label>
              <input className="cc-input" type="number" value={radius} onChange={e => setRadius(Number(e.target.value))} min={10} step={10} />
              <div className="cc-hint">Capsule unlocks when within this distance</div>
            </div>
          )}

          <hr className="cc-divider" />

          <div className="cc-section-title">Images <span className="cc-optional">— optional</span></div>
          <input id="cc-img-input" type="file" accept="image/*" multiple onChange={handleImageUpload} style={{ display: "none" }} />
          <label htmlFor="cc-img-input" className="cc-upload">
            <div className="cc-upload-icon"><Upload size={20} color="#b07fe8" /></div>
            <div className="cc-upload-text">Click to upload images</div>
            <div className="cc-upload-hint">PNG, JPG, GIF up to 10MB</div>
          </label>
          {images.length > 0 && (
            <div className="cc-imgs-grid">
              {images.map((img, idx) => (
                <div key={idx} className="cc-img-wrap">
                  <img src={img} alt={`upload-${idx}`} style={{ width: "100%", height: 110, objectFit: "cover" }} />
                  <button type="button" className="cc-img-del" onClick={() => removeImage(idx)}><X size={12} /></button>
                </div>
              ))}
            </div>
          )}

          <div className="cc-btn-row">
            <button type="button" className="cc-btn-cancel" onClick={() => navigate("/capsules")}>Cancel</button>
            <button type="submit" className="cc-btn-create" disabled={isLoading || loadingImages > 0}>
              {isLoading ? <><div className="cc-spinner" /> Sealing...</> : <><Sparkles size={14} /> Seal Capsule</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateCapsule;