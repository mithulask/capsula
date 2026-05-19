import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Lock, Trash2, Unlock } from "lucide-react";
import {
  AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader,
  AlertDialogTitle, AlertDialogDescription, AlertDialogFooter,
  AlertDialogCancel, AlertDialogAction,
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

const ACCENTS = [
  { border: "#c9b8f5", dot: "#a07ad0", badgeBg: "#f0eaff", badgeColor: "#7c5cbf", bar: "linear-gradient(90deg,#c9b8f5,#9b7fe8)", viewBg: "#f5f0ff", viewColor: "#7c5cbf" },
  { border: "#f5b8df", dot: "#c06fa8", badgeBg: "#fce4f3", badgeColor: "#c06fa8", bar: "linear-gradient(90deg,#f5b8df,#e87fc0)", viewBg: "#fff0f8", viewColor: "#c06fa8" },
  { border: "#b8ddf5", dot: "#5b8fe8", badgeBg: "#ddeeff", badgeColor: "#3a6aba", bar: "linear-gradient(90deg,#b8ddf5,#7fbce8)", viewBg: "#f0f8ff", viewColor: "#3a6aba" },
  { border: "#b8f0df", dot: "#3a9e7a", badgeBg: "#e0f5ef", badgeColor: "#2e7a5e", bar: "linear-gradient(90deg,#b8f0df,#7fe8c8)", viewBg: "#eafaf3", viewColor: "#2e7a5e" },
];

const CapsuleList: React.FC = () => {
  const [capsules, setCapsules] = useState<Capsule[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const username = localStorage.getItem("username") || "there";
  const currentUserId = Number(localStorage.getItem("user_id"));

  useEffect(() => {
    const handleMouse = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 30;
      const y = (e.clientY / window.innerHeight - 0.5) * 30;
      const b1 = document.getElementById("cl-b1");
      const b2 = document.getElementById("cl-b2");
      if (b1) b1.style.transform = `translate(${x * 0.5}px,${y * 0.5}px)`;
      if (b2) b2.style.transform = `translate(${-x * 0.4}px,${-y * 0.4}px)`;
    };
    window.addEventListener("mousemove", handleMouse);
    return () => window.removeEventListener("mousemove", handleMouse);
  }, []);

  const fetchCapsules = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) return navigate("/login");
      const res = await fetch("https://capsula-les8.onrender.com/capsules", { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      setCapsules(data.capsules || []);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchCapsules(); }, []);

  const handleDelete = async (id: number) => {
    const token = localStorage.getItem("token");
    if (!token) return;
    const res = await fetch(`https://capsula-les8.onrender.com/capsules/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
    if (res.ok) setCapsules(prev => prev.filter(c => c.id !== id));
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user_id");
    localStorage.removeItem("username");
    navigate("/login");
  };

  if (loading) return (
    <div style={{ minHeight: "100vh", background: "#f8f5ff", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'DM Sans',sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;1,400&family=DM+Sans:wght@300;400;500&display=swap');@keyframes pulse{0%,100%{opacity:0.4}50%{opacity:1}}.loading-dot{width:8px;height:8px;border-radius:50%;background:#b07fe8;display:inline-block;margin:0 3px;animation:pulse 1.2s ease-in-out infinite;}.d2{animation-delay:0.2s!important;background:#e87fc0}.d3{animation-delay:0.4s!important;background:#7fbce8}`}</style>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 22, color: "#2d1f5e", marginBottom: 16 }}>Loading your capsules</div>
        <div><span className="loading-dot" /><span className="loading-dot d2" /><span className="loading-dot d3" /></div>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: "#f8f5ff", fontFamily: "'DM Sans',sans-serif", color: "#1c1c2e" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;1,400&family=DM+Sans:wght@300;400;500&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        @keyframes fadeUp{from{opacity:0;transform:translateY(28px)}to{opacity:1;transform:translateY(0)}}
        @keyframes fadeIn{from{opacity:0}to{opacity:1}}
        @keyframes slideRight{from{opacity:0;transform:translateX(-24px)}to{opacity:1;transform:translateX(0)}}
        @keyframes blobPulse{0%,100%{border-radius:60% 40% 30% 70%/60% 30% 70% 40%}50%{border-radius:30% 60% 70% 40%/50% 60% 30% 60%}}
        @keyframes pulse{0%,100%{opacity:0.15}50%{opacity:0.25}}
        @keyframes shimmer{0%{background-position:-200% center}100%{background-position:200% center}}
        @keyframes pulseDot{0%,100%{transform:scale(1)}50%{transform:scale(1.6);opacity:0.5}}

        .cl-nav{display:flex;justify-content:space-between;align-items:center;padding:1.2rem 2.5rem;background:rgba(255,255,255,0.82);backdrop-filter:blur(16px);border-bottom:1px solid rgba(180,160,220,0.12);position:sticky;top:0;z-index:50;animation:fadeIn 0.5s ease both;}
        .cl-logo{font-family:'Playfair Display',serif;font-size:20px;color:#2d1f5e;}
        .cl-logo em{font-style:italic;color:#b07fe8;}
        .cl-nav-right{display:flex;align-items:center;gap:1.5rem;}
        .cl-welcome{font-size:13px;color:#9990b0;}
        .cl-welcome strong{color:#2d1f5e;font-weight:500;}
        .cl-logout{background:none;border:none;font-size:13px;color:#c8c0d8;cursor:pointer;font-family:'DM Sans',sans-serif;transition:color 0.2s;}
        .cl-logout:hover{color:#9990b0;}
        .cl-create{background:#2d1f5e;color:#fff;padding:9px 20px;border-radius:100px;font-size:13px;cursor:pointer;border:none;font-family:'DM Sans',sans-serif;display:flex;align-items:center;gap:6px;transition:all 0.2s;}
        .cl-create:hover{background:#3d2f7e;transform:translateY(-1px);box-shadow:0 6px 20px rgba(45,31,94,0.22);}

        .cl-hero{background:linear-gradient(155deg,#ede9ff 0%,#fce4f3 50%,#ddeeff 100%);padding:4rem 2.5rem 3rem;position:relative;overflow:hidden;}
        .cl-blob{position:absolute;filter:blur(45px);pointer-events:none;transition:transform 0.9s ease;}
        .cl-b1{width:240px;height:240px;background:#b07fe8;top:-80px;right:10%;opacity:0.18;border-radius:60% 40% 30% 70%/60% 30% 70% 40%;animation:blobPulse 9s ease-in-out infinite,pulse 7s ease-in-out infinite;}
        .cl-b2{width:180px;height:180px;background:#7fbce8;bottom:-40px;right:40%;opacity:0.15;border-radius:30% 60% 70% 40%/50% 60% 30% 60%;animation:blobPulse 11s ease-in-out infinite reverse,pulse 8s ease-in-out infinite;}
        .cl-hero-label{font-size:11px;letter-spacing:0.15em;text-transform:uppercase;color:#b07fe8;margin-bottom:0.75rem;animation:fadeUp 0.6s 0.1s ease both;opacity:0;animation-fill-mode:forwards;}
        .cl-hero-headline{font-family:'Playfair Display',serif;font-size:46px;font-weight:400;color:#1c1c2e;line-height:1.1;margin-bottom:0.5rem;animation:fadeUp 0.6s 0.2s ease both;opacity:0;animation-fill-mode:forwards;}
        .cl-hero-headline em{font-style:italic;color:#c06fa8;}
        .cl-hero-count{font-size:14px;color:#9990b0;font-weight:300;animation:fadeUp 0.6s 0.3s ease both;opacity:0;animation-fill-mode:forwards;}

        .cl-content{max-width:860px;margin:0 auto;padding:3rem 2.5rem;}
        .cl-sec-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:1.5rem;animation:fadeUp 0.6s 0.35s ease both;opacity:0;animation-fill-mode:forwards;}
        .cl-sec-label{font-size:11px;letter-spacing:0.15em;text-transform:uppercase;color:#b0a8c8;}
        .cl-sec-count{font-family:'Playfair Display',serif;font-size:13px;color:#9b7fe8;}

        .cl-card{background:#fff;border-radius:24px;padding:1.75rem 2rem;border:1px solid rgba(180,160,220,0.18);border-top-width:3px;display:flex;justify-content:space-between;align-items:center;gap:1rem;margin-bottom:1rem;transition:transform 0.25s,box-shadow 0.25s;opacity:0;animation:slideRight 0.55s ease both;animation-fill-mode:forwards;}
        .cl-card:hover{transform:translateX(8px);box-shadow:0 10px 36px rgba(155,127,232,0.13);}
        .cl-card-num{font-size:10px;letter-spacing:0.15em;color:#d8d0e8;margin-bottom:0.7rem;}
        .cl-badge{display:inline-flex;align-items:center;gap:5px;font-size:11px;padding:4px 12px;border-radius:100px;margin-bottom:0.7rem;font-weight:500;}
        .cl-badge-dot{width:5px;height:5px;border-radius:50%;animation:pulseDot 2.5s ease-in-out infinite;}
        .cl-card-title{font-family:'Playfair Display',serif;font-size:21px;font-weight:400;color:#1c1c2e;margin-bottom:0.35rem;}
        .cl-card-date{font-size:12px;color:#b0a8c8;margin-bottom:0.75rem;}
        .cl-card-days{font-size:11px;color:#c8c0d8;margin-bottom:6px;}
        .cl-progress-bg{background:#f0eaff;border-radius:100px;height:3px;max-width:260px;}
        .cl-progress-fill{height:3px;border-radius:100px;background-size:200% auto;animation:shimmer 3s ease-in-out infinite;}
        .cl-card-right{display:flex;gap:0.75rem;align-items:center;flex-shrink:0;}
        .cl-view-btn{padding:10px 22px;border-radius:100px;font-size:12px;cursor:pointer;border:none;font-family:'DM Sans',sans-serif;transition:all 0.2s;}
        .cl-view-btn:hover{transform:scale(1.06);}
        .cl-del-btn{background:#fff5f7;color:#e05577;padding:10px 13px;border-radius:100px;font-size:12px;cursor:pointer;border:1px solid #ffd0db;display:flex;align-items:center;transition:all 0.2s;}
        .cl-del-btn:hover{background:#ffe0e8;transform:scale(1.06);}

        .cl-empty{text-align:center;padding:6rem 2rem;animation:fadeUp 0.7s ease both;}
        .cl-empty-icon{width:72px;height:72px;background:linear-gradient(135deg,#ede9ff,#fce4f3);border-radius:50%;display:flex;align-items:center;justify-content:center;margin:0 auto 1.5rem;}
        .cl-empty-headline{font-family:'Playfair Display',serif;font-size:26px;font-weight:400;color:#2d1f5e;margin-bottom:0.75rem;}
        .cl-empty-sub{font-size:14px;color:#b0a8c8;margin-bottom:2rem;font-weight:300;}
        .cl-empty-btn{background:#2d1f5e;color:#fff;padding:13px 30px;border-radius:100px;font-size:14px;cursor:pointer;border:none;font-family:'DM Sans',sans-serif;transition:all 0.2s;}
        .cl-empty-btn:hover{transform:translateY(-2px);box-shadow:0 8px 24px rgba(45,31,94,0.25);}
      `}</style>

      <nav className="cl-nav">
        <span className="cl-logo">Cap<em>sula</em>®</span>
        <div className="cl-nav-right">
          <span className="cl-welcome">Welcome, <strong>{username}</strong> ✦</span>
          <button className="cl-logout" onClick={handleLogout}>Logout</button>
          <button className="cl-create" onClick={() => navigate("/create-capsule")}><Plus size={14} /> Create</button>
        </div>
      </nav>

      <div className="cl-hero">
        <div id="cl-b1" className="cl-blob cl-b1" />
        <div id="cl-b2" className="cl-blob cl-b2" />
        <div className="cl-hero-label">Your collection</div>
        <h1 className="cl-hero-headline">Your <em>Capsules</em></h1>
        <div className="cl-hero-count">{capsules.length} capsule{capsules.length !== 1 ? "s" : ""} sealed in time</div>
      </div>

      <div className="cl-content">
        {capsules.length === 0 ? (
          <div className="cl-empty">
            <div className="cl-empty-icon"><Lock size={28} color="#b07fe8" /></div>
            <div className="cl-empty-headline">No capsules yet</div>
            <p className="cl-empty-sub">Create your first time capsule and seal a memory for the future.</p>
            <button className="cl-empty-btn" onClick={() => navigate("/create-capsule")}>Create your first capsule</button>
          </div>
        ) : (
          <>
            <div className="cl-sec-header">
              <span className="cl-sec-label">All Capsules</span>
              <span className="cl-sec-count">{capsules.length} total</span>
            </div>
            {capsules.map((c, i) => {
              const accent = ACCENTS[i % ACCENTS.length];
              const daysRemaining = Math.ceil((new Date(c.unlock_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
              const isLocked = c.locked !== false;
              const totalDays = Math.max(1, Math.ceil((new Date(c.unlock_date).getTime() - new Date(c.created_at).getTime()) / (1000 * 60 * 60 * 24)));
              const progress = isLocked ? Math.max(5, Math.min(95, ((totalDays - Math.max(0, daysRemaining)) / totalDays) * 100)) : 100;

              return (
                <div key={c.id} className="cl-card" style={{ borderTopColor: accent.border, animationDelay: `${0.4 + i * 0.1}s` }}>
                  <div>
                    <div className="cl-card-num">{String(i + 1).padStart(2, "0")}</div>
                    <div className="cl-badge" style={{ background: isLocked ? accent.badgeBg : "#eafaf3", color: isLocked ? accent.badgeColor : "#2e7a5e" }}>
                      <div className="cl-badge-dot" style={{ background: isLocked ? accent.dot : "#3a9e7a" }} />
                      {isLocked ? "Sealed" : "Unlocked"}
                    </div>
                    <div className="cl-card-title">{c.title}</div>
                    <div className="cl-card-date">
                      {isLocked ? `Opens ${new Date(c.unlock_date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}` : `Opened ${new Date(c.unlock_date).toLocaleDateString()}`}
                    </div>
                    {isLocked && daysRemaining > 0 && <div className="cl-card-days">{daysRemaining} days remaining</div>}
                    <div className="cl-progress-bg">
                      <div className="cl-progress-fill" style={{ background: accent.bar, backgroundSize: "200% auto", width: `${progress}%` }} />
                    </div>
                  </div>
                  <div className="cl-card-right">
                    <button className="cl-view-btn" style={{ background: accent.badgeBg, color: accent.badgeColor }} onClick={() => navigate(`/capsules/${c.id}`)}>View →</button>
                    {c.owner_id === currentUserId && (
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <button className="cl-del-btn"><Trash2 size={14} /></button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete capsule?</AlertDialogTitle>
                            <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(c.id)}>Delete</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    )}
                  </div>
                </div>
              );
            })}
          </>
        )}
      </div>
    </div>
  );
};

export default CapsuleList;