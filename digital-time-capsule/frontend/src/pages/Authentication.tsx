import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Lock, Mail, User, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

const Authentication: React.FC = () => {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleMouse = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 30;
      const y = (e.clientY / window.innerHeight - 0.5) * 30;
      const b1 = document.getElementById("auth-b1");
      const b2 = document.getElementById("auth-b2");
      if (b1) b1.style.transform = `translate(${x * 0.6}px, ${y * 0.6}px)`;
      if (b2) b2.style.transform = `translate(${-x * 0.4}px, ${-y * 0.4}px)`;
    };
    window.addEventListener("mousemove", handleMouse);
    return () => window.removeEventListener("mousemove", handleMouse);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const url = mode === "login"
        ? "https://capsula-les8.onrender.com/auth/login"
        : "https://capsula-les8.onrender.com/auth/register";
      const body = mode === "login" ? { email, password } : { username: name, email, password };
      const res = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("token", data.access_token);
        localStorage.setItem("user_id", data.user_id);
        localStorage.setItem("username", data.username || name);
        toast.success(mode === "login" ? "Welcome back!" : "Account created!");
        navigate("/capsules");
      } else {
        toast.error(data.message || " Something went wrong");
      }
    } catch {
      toast.error("⚠ Could not connect to server.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(155deg,#ede9ff 0%,#fce4f3 50%,#ddeeff 100%)", fontFamily: "'DM Sans', sans-serif", display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem", position: "relative", overflow: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;1,400&family=DM+Sans:wght@300;400;500&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        @keyframes fadeUp{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}
        @keyframes fadeIn{from{opacity:0}to{opacity:1}}
        @keyframes blobPulse{0%,100%{border-radius:60% 40% 30% 70%/60% 30% 70% 40%}50%{border-radius:30% 60% 70% 40%/50% 60% 30% 60%}}
        @keyframes pulse{0%,100%{opacity:0.2}50%{opacity:0.32}}
        @keyframes pulseDot{0%,100%{transform:scale(1)}50%{transform:scale(1.5);opacity:0.5}}
        @keyframes slideIn{from{opacity:0;transform:translateX(-12px)}to{opacity:1;transform:translateX(0)}}

        .auth-blob{position:absolute;filter:blur(50px);pointer-events:none;transition:transform 0.9s ease;}
        .auth-b1{width:320px;height:320px;background:#b07fe8;top:-100px;left:-80px;opacity:0.2;border-radius:60% 40% 30% 70%/60% 30% 70% 40%;animation:blobPulse 9s ease-in-out infinite,pulse 7s ease-in-out infinite;}
        .auth-b2{width:260px;height:260px;background:#e87fc0;bottom:-80px;right:-60px;opacity:0.18;border-radius:30% 60% 70% 40%/50% 60% 30% 60%;animation:blobPulse 11s ease-in-out infinite reverse,pulse 8s ease-in-out infinite;}

        .auth-back{display:flex;align-items:center;gap:6px;background:rgba(255,255,255,0.6);backdrop-filter:blur(10px);border:1px solid rgba(180,160,220,0.25);color:#7a7090;padding:8px 18px;border-radius:100px;font-size:13px;cursor:pointer;font-family:'DM Sans',sans-serif;position:absolute;top:1.5rem;left:1.5rem;transition:all 0.2s;animation:fadeIn 0.6s ease both;}
        .auth-back:hover{background:rgba(255,255,255,0.85);transform:translateX(-3px);}

        .auth-card{background:rgba(255,255,255,0.82);backdrop-filter:blur(24px);border-radius:32px;padding:3rem;width:100%;max-width:420px;border:1px solid rgba(180,160,220,0.22);position:relative;z-index:1;animation:fadeUp 0.7s 0.1s ease both;opacity:0;animation-fill-mode:forwards;}
        .auth-logo{font-family:'Playfair Display',serif;font-size:22px;color:#2d1f5e;text-align:center;margin-bottom:0.4rem;}
        .auth-logo em{font-style:italic;color:#b07fe8;}
        .auth-tag{font-size:11px;color:#c8c0d8;text-align:center;letter-spacing:0.1em;text-transform:uppercase;margin-bottom:2rem;}
        .auth-tabs{display:flex;background:#f5f0ff;border-radius:100px;padding:4px;margin-bottom:2rem;gap:4px;}
        .auth-tab{flex:1;padding:9px;border-radius:100px;font-size:13px;cursor:pointer;border:none;font-family:'DM Sans',sans-serif;transition:all 0.25s;color:#9990b0;background:transparent;}
        .auth-tab.active{background:#fff;color:#2d1f5e;box-shadow:0 2px 8px rgba(180,160,220,0.2);}

        .auth-field{margin-bottom:1.25rem;animation:slideIn 0.4s ease both;}
        .auth-label{display:block;font-size:11px;letter-spacing:0.1em;text-transform:uppercase;color:#9990b0;margin-bottom:0.5rem;}
        .auth-input-wrap{position:relative;}
        .auth-input-icon{position:absolute;left:14px;top:50%;transform:translateY(-50%);color:#c8c0d8;pointer-events:none;}
        .auth-input{width:100%;padding:13px 14px 13px 42px;border:1.5px solid rgba(180,160,220,0.25);border-radius:16px;font-size:14px;font-family:'DM Sans',sans-serif;background:rgba(255,255,255,0.7);color:#1c1c2e;outline:none;transition:border-color 0.2s,box-shadow 0.2s;}
        .auth-input:focus{border-color:#b07fe8;box-shadow:0 0 0 4px rgba(176,127,232,0.1);}
        .auth-input::placeholder{color:#d0c8e0;}
        .auth-eye{position:absolute;right:14px;top:50%;transform:translateY(-50%);background:none;border:none;cursor:pointer;color:#c8c0d8;padding:0;display:flex;}
        .auth-eye:hover{color:#9990b0;}

        .auth-btn{width:100%;padding:14px;background:#2d1f5e;color:#fff;border:none;border-radius:100px;font-size:14px;font-family:'DM Sans',sans-serif;cursor:pointer;margin-top:0.5rem;transition:all 0.25s;position:relative;overflow:hidden;}
        .auth-btn:hover:not(:disabled){background:#3d2f7e;transform:translateY(-2px);box-shadow:0 8px 24px rgba(45,31,94,0.28);}
        .auth-btn:disabled{opacity:0.65;cursor:not-allowed;}
        .auth-btn-shine{position:absolute;top:0;left:-100%;width:60%;height:100%;background:linear-gradient(90deg,transparent,rgba(255,255,255,0.12),transparent);transform:skewX(-20deg);}
        .auth-btn:hover .auth-btn-shine{left:150%;transition:left 0.5s ease;}

        .auth-switch{text-align:center;margin-top:1.5rem;font-size:13px;color:#9990b0;}
        .auth-switch-btn{background:none;border:none;color:#7c5cbf;cursor:pointer;font-family:'DM Sans',sans-serif;font-size:13px;text-decoration:underline;text-underline-offset:2px;}
        .auth-divider{border:none;border-top:1px solid rgba(180,160,220,0.15);margin:1.5rem 0;}
      `}</style>

      <div id="auth-b1" className="auth-blob auth-b1" />
      <div id="auth-b2" className="auth-blob auth-b2" />

      <button className="auth-back" onClick={() => navigate("/")}>
        <ArrowLeft size={13} /> Back
      </button>

      <div className="auth-card">
        <div className="auth-logo">Cap<em>sula</em>®</div>
        <div className="auth-tag">Digital Time Capsule</div>

        <div className="auth-tabs">
          <button className={`auth-tab${mode === "login" ? " active" : ""}`} onClick={() => setMode("login")}>Sign In</button>
          <button className={`auth-tab${mode === "signup" ? " active" : ""}`} onClick={() => setMode("signup")}>Sign Up</button>
        </div>

        <form onSubmit={handleSubmit}>
          {mode === "signup" && (
            <div className="auth-field" style={{ animationDelay: "0s" }}>
              <label className="auth-label">Name</label>
              <div className="auth-input-wrap">
                <User size={15} className="auth-input-icon" />
                <input className="auth-input" type="text" placeholder="Your name" value={name} onChange={e => setName(e.target.value)} required />
              </div>
            </div>
          )}
          <div className="auth-field" style={{ animationDelay: "0.05s" }}>
            <label className="auth-label">Email</label>
            <div className="auth-input-wrap">
              <Mail size={15} className="auth-input-icon" />
              <input className="auth-input" type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} required />
            </div>
          </div>
          <div className="auth-field" style={{ animationDelay: "0.1s" }}>
            <label className="auth-label">Password</label>
            <div className="auth-input-wrap">
              <Lock size={15} className="auth-input-icon" />
              <input className="auth-input" type={showPass ? "text" : "password"} placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required style={{ paddingRight: "42px" }} />
              <button type="button" className="auth-eye" onClick={() => setShowPass(p => !p)}>
                {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>
          <button className="auth-btn" type="submit" disabled={isLoading}>
            <div className="auth-btn-shine" />
            {isLoading ? (mode === "login" ? "Signing in..." : "Creating account...") : (mode === "login" ? "Sign In" : "Sign Up")}
          </button>
        </form>

        <div className="auth-switch">
          {mode === "login" ? (
            <>Don't have an account? <button className="auth-switch-btn" onClick={() => setMode("signup")}>Sign Up</button></>
          ) : (
            <>Already have an account? <button className="auth-switch-btn" onClick={() => setMode("login")}>Sign In</button></>
          )}
        </div>
      </div>
    </div>
  );
};

export default Authentication;