import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Sparkles, Lock, Image, Calendar, Clock } from "lucide-react";

const Homepage: React.FC = () => {
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem("token");

  useEffect(() => {
    const handleMouse = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 40;
      const y = (e.clientY / window.innerHeight - 0.5) * 40;
      const b1 = document.getElementById("hp-b1");
      const b2 = document.getElementById("hp-b2");
      const b3 = document.getElementById("hp-b3");
      if (b1) b1.style.transform = `translate(${x * 0.7}px, ${y * 0.7}px)`;
      if (b2) b2.style.transform = `translate(${-x * 0.5}px, ${-y * 0.5}px)`;
      if (b3) b3.style.transform = `translate(${x * 0.3}px, ${y * 1.1}px)`;
    };
    window.addEventListener("mousemove", handleMouse);
    return () => window.removeEventListener("mousemove", handleMouse);
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: "#faf8ff", fontFamily: "'DM Sans', sans-serif", color: "#1c1c2e" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;1,400&family=DM+Sans:wght@300;400;500&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        @keyframes fadeUp{from{opacity:0;transform:translateY(28px)}to{opacity:1;transform:translateY(0)}}
        @keyframes fadeIn{from{opacity:0}to{opacity:1}}
        @keyframes float{0%,100%{transform:translateY(-50%) scale(1)}50%{transform:translateY(calc(-50% - 14px)) scale(1.03)}}
        @keyframes blobPulse{0%,100%{border-radius:60% 40% 30% 70%/60% 30% 70% 40%}50%{border-radius:30% 60% 70% 40%/50% 60% 30% 60%}}
        @keyframes pulse{0%,100%{opacity:0.18}50%{opacity:0.3}}
        @keyframes shimmer{0%{background-position:-200% center}100%{background-position:200% center}}
        @keyframes slideUp{from{opacity:0;transform:translateY(40px)}to{opacity:1;transform:translateY(0)}}
        @keyframes pulseDot{0%,100%{transform:scale(1);opacity:1}50%{transform:scale(1.4);opacity:0.6}}

        .hp-nav{display:flex;justify-content:space-between;align-items:center;padding:1.2rem 2.5rem;background:rgba(255,255,255,0.88);backdrop-filter:blur(16px);border-bottom:1px solid rgba(180,160,220,0.15);position:sticky;top:0;z-index:50;animation:fadeIn 0.6s ease both;}
        .hp-logo{font-family:'Playfair Display',serif;font-size:20px;color:#5a3fa0;}
        .hp-logo em{font-style:italic;color:#c06fa8;}
        .hp-nav-btns{display:flex;gap:0.75rem;}
        .hp-btn-ghost{background:transparent;border:1.5px solid rgba(180,160,220,0.5);color:#9b7fe8;padding:9px 22px;border-radius:100px;font-size:13px;cursor:pointer;font-family:'DM Sans',sans-serif;transition:all 0.2s;}
        .hp-btn-ghost:hover{background:#f5f0ff;transform:translateY(-1px);}
        .hp-btn-primary{background:linear-gradient(135deg,#c9b8f5,#e8b0d8);color:#fff;padding:9px 22px;border-radius:100px;font-size:13px;cursor:pointer;border:none;font-family:'DM Sans',sans-serif;transition:all 0.2s;}
        .hp-btn-primary:hover{transform:translateY(-1px);box-shadow:0 6px 20px rgba(180,140,220,0.35);}

        .hp-hero{position:relative;padding:6rem 2.5rem 5rem;background:linear-gradient(155deg,#f0ecff 0%,#fde8f5 45%,#e4f0ff 100%);overflow:hidden;min-height:500px;display:flex;align-items:center;}
        .hp-blob{position:absolute;filter:blur(50px);opacity:0.28;transition:transform 0.8s ease;pointer-events:none;}
        .hp-b1{width:280px;height:280px;background:#c9b8f5;top:-80px;left:-60px;border-radius:60% 40% 30% 70%/60% 30% 70% 40%;animation:blobPulse 8s ease-in-out infinite,pulse 6s ease-in-out infinite;}
        .hp-b2{width:240px;height:240px;background:#f5b8e0;bottom:-60px;right:60px;border-radius:30% 60% 70% 40%/50% 60% 30% 60%;animation:blobPulse 10s ease-in-out infinite reverse,pulse 7s ease-in-out infinite;}
        .hp-b3{width:180px;height:180px;background:#b8d8f5;top:30%;left:50%;border-radius:50% 60% 40% 70%/40% 50% 60% 50%;animation:blobPulse 12s ease-in-out infinite,pulse 5s ease-in-out infinite;}
        .hp-hero-content{position:relative;z-index:1;max-width:480px;}
        .hp-pill{display:inline-flex;align-items:center;gap:7px;background:rgba(180,140,240,0.12);color:#9b7fe8;font-size:11px;letter-spacing:0.1em;text-transform:uppercase;padding:5px 14px;border-radius:100px;margin-bottom:1.75rem;animation:fadeUp 0.7s 0.1s ease both;opacity:0;animation-fill-mode:forwards;}
        .hp-pill-dot{width:6px;height:6px;border-radius:50%;background:#c9b8f5;animation:pulseDot 2s ease-in-out infinite;}
        .hp-headline{font-family:'Playfair Display',serif;font-size:52px;line-height:1.1;font-weight:400;color:#1c1c2e;margin-bottom:1.25rem;animation:fadeUp 0.7s 0.2s ease both;opacity:0;animation-fill-mode:forwards;}
        .hp-headline em{font-style:italic;color:#c06fa8;}
        .hp-sub{font-size:15px;color:#8a8090;line-height:1.85;max-width:380px;margin-bottom:2.25rem;font-weight:300;animation:fadeUp 0.7s 0.32s ease both;opacity:0;animation-fill-mode:forwards;}
        .hp-hero-btns{display:flex;gap:0.875rem;animation:fadeUp 0.7s 0.44s ease both;opacity:0;animation-fill-mode:forwards;}
        .hp-btn-hero{background:linear-gradient(135deg,#c9b8f5 0%,#e8b0d8 100%);color:#fff;padding:14px 30px;border-radius:100px;font-size:14px;cursor:pointer;border:none;font-family:'DM Sans',sans-serif;display:flex;align-items:center;gap:8px;transition:all 0.25s;}
        .hp-btn-hero:hover{transform:translateY(-3px);box-shadow:0 10px 28px rgba(180,140,220,0.35);}
        .hp-btn-hero-ghost{background:rgba(255,255,255,0.8);color:#9b7fe8;padding:14px 30px;border-radius:100px;font-size:14px;cursor:pointer;border:1.5px solid rgba(180,160,220,0.4);font-family:'DM Sans',sans-serif;transition:all 0.25s;}
        .hp-btn-hero-ghost:hover{transform:translateY(-3px);background:rgba(255,255,255,1);}
        .hp-float{position:absolute;right:5%;top:50%;transform:translateY(-50%);background:rgba(255,255,255,0.88);backdrop-filter:blur(20px);border-radius:22px;padding:1.4rem 1.75rem;border:1px solid rgba(180,160,220,0.22);animation:float 5s ease-in-out infinite,fadeIn 1s 0.9s ease both;opacity:0;animation-fill-mode:forwards;}
        .hp-float-label{font-size:10px;letter-spacing:0.12em;text-transform:uppercase;color:#c8c0d8;margin-bottom:0.5rem;}
        .hp-float-num{font-family:'Playfair Display',serif;font-size:36px;color:#5a3fa0;line-height:1;}
        .hp-float-sub{font-size:11px;color:#b0a8c8;margin-top:0.3rem;}
        .hp-float-bar-bg{background:#ede9ff;border-radius:100px;height:3px;width:130px;margin-top:0.875rem;}
        .hp-float-bar{height:3px;border-radius:100px;background:linear-gradient(90deg,#c9b8f5,#e8b0d8,#c9b8f5);background-size:200% auto;width:65%;animation:shimmer 2.5s ease-in-out infinite;}

        .hp-features{padding:6rem 2.5rem;max-width:1100px;margin:0 auto;}
        .hp-features-header{text-align:center;margin-bottom:4rem;animation:slideUp 0.7s ease both;}
        .hp-sec-label{font-size:11px;letter-spacing:0.15em;text-transform:uppercase;color:#c8c0d8;margin-bottom:0.75rem;}
        .hp-features-headline{font-family:'Playfair Display',serif;font-size:40px;font-weight:400;color:#1c1c2e;margin-bottom:0.75rem;}
        .hp-features-sub{font-size:14px;color:#b0a8c8;font-weight:300;}
        .hp-features-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:1.25rem;}
        .hp-feat-card{background:#fff;border-radius:24px;padding:2rem;border:1px solid rgba(180,160,220,0.15);transition:transform 0.25s,box-shadow 0.25s;opacity:0;animation:slideUp 0.6s ease both;animation-fill-mode:forwards;}
        .hp-feat-card:hover{transform:translateY(-6px);box-shadow:0 16px 48px rgba(180,140,220,0.1);}
        .hp-feat-icon{width:52px;height:52px;border-radius:16px;display:flex;align-items:center;justify-content:center;margin-bottom:1.25rem;}
        .hp-feat-title{font-family:'Playfair Display',serif;font-size:18px;font-weight:400;color:#1c1c2e;margin-bottom:0.5rem;}
        .hp-feat-desc{font-size:13px;color:#b0a8c8;line-height:1.7;font-weight:300;}

        .hp-cta{max-width:860px;margin:0 auto 6rem;padding:0 2.5rem;animation:slideUp 0.7s 0.2s ease both;}
        .hp-cta-inner{background:linear-gradient(135deg,#ede9ff 0%,#fce4f3 55%,#ddeeff 100%);border-radius:32px;padding:5rem 3rem;text-align:center;position:relative;overflow:hidden;border:1px solid rgba(180,160,220,0.2);}
        .hp-cta-blob{position:absolute;width:200px;height:200px;background:rgba(180,140,240,0.12);border-radius:50%;top:-60px;left:-60px;}
        .hp-cta-blob2{position:absolute;width:150px;height:150px;background:rgba(240,140,200,0.1);border-radius:50%;bottom:-40px;right:-40px;}
        .hp-cta-headline{font-family:'Playfair Display',serif;font-size:36px;font-weight:400;margin-bottom:1rem;position:relative;color:#1c1c2e;}
        .hp-cta-sub{font-size:14px;color:#9990b0;margin-bottom:2.5rem;font-weight:300;position:relative;}
        .hp-cta-btn{background:linear-gradient(135deg,#c9b8f5,#e8b0d8);color:#fff;padding:15px 36px;border-radius:100px;font-size:14px;cursor:pointer;border:none;font-family:'DM Sans',sans-serif;font-weight:500;transition:all 0.2s;position:relative;}
        .hp-cta-btn:hover{transform:scale(1.04);box-shadow:0 8px 28px rgba(180,140,220,0.35);}

        .hp-footer{border-top:1px solid rgba(180,160,220,0.12);padding:2rem 2.5rem;display:flex;justify-content:space-between;align-items:center;}
        .hp-footer-text{font-size:12px;color:#d0c8e0;}
      `}</style>

      <nav className="hp-nav">
        <span className="hp-logo">Cap<em>sula</em>®</span>
        <div className="hp-nav-btns">
          {isLoggedIn ? (
            <button className="hp-btn-primary" onClick={() => navigate("/capsules")}>My Capsules</button>
          ) : (
            <>
              <button className="hp-btn-ghost" onClick={() => navigate("/login")}>Sign In</button>
              <button className="hp-btn-primary" onClick={() => navigate("/signup")}>Get Started</button>
            </>
          )}
        </div>
      </nav>

      <div className="hp-hero">
        <div id="hp-b1" className="hp-blob hp-b1" />
        <div id="hp-b2" className="hp-blob hp-b2" />
        <div id="hp-b3" className="hp-blob hp-b3" />

        <div className="hp-hero-content">
          <div className="hp-pill"><div className="hp-pill-dot" /><Sparkles size={11} /> Digital Time Capsule</div>
          <h1 className="hp-headline">Seal your <em>memories,</em><br />unlock the past.</h1>
          <p className="hp-sub">Moments worth keeping deserve more than a photo album. Capsula locks them in time — until you're ready.</p>
          <div className="hp-hero-btns">
            <button className="hp-btn-hero" onClick={() => navigate("/signup")}>Create a Capsule <ArrowRight size={15} /></button>
            {!isLoggedIn && <button className="hp-btn-hero-ghost" onClick={() => navigate("/login")}>Sign In</button>}
          </div>
        </div>

        <div className="hp-float">
          <div className="hp-float-label">Days until open</div>
          <div className="hp-float-num">147</div>
          <div className="hp-float-sub">Summer in Barcelona</div>
          <div className="hp-float-bar-bg"><div className="hp-float-bar" /></div>
        </div>
      </div>

      <div className="hp-features">
        <div className="hp-features-header">
          <div className="hp-sec-label">How it works</div>
          <h2 className="hp-features-headline">Four simple steps</h2>
          <p className="hp-features-sub">From memory to sealed capsule in minutes</p>
        </div>
        <div className="hp-features-grid">
          {[
            { icon: <Lock size={22} color="#9b7fe8" />, bg: "#f0ecff", title: "Create a Capsule", desc: "Start with a meaningful title and write your message to the future.", delay: "0.1s" },
            { icon: <Image size={22} color="#d87fc0" />, bg: "#fde8f5", title: "Add Memories", desc: "Upload photos and write messages you want to preserve forever.", delay: "0.2s" },
            { icon: <Calendar size={22} color="#7baee8" />, bg: "#e4f0ff", title: "Set a Date", desc: "Choose the future date or location when your capsule unlocks.", delay: "0.3s" },
            { icon: <Clock size={22} color="#5ab89a" />, bg: "#e4f7ef", title: "Wait & Open", desc: "Watch the countdown and relive your memories when the day arrives.", delay: "0.4s" },
          ].map((f, i) => (
            <div key={i} className="hp-feat-card" style={{ animationDelay: f.delay }}>
              <div className="hp-feat-icon" style={{ background: f.bg }}>{f.icon}</div>
              <div className="hp-feat-title">{f.title}</div>
              <p className="hp-feat-desc">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="hp-cta">
        <div className="hp-cta-inner">
          <div className="hp-cta-blob" />
          <div className="hp-cta-blob2" />
          <h2 className="hp-cta-headline">Ready to seal your first memory?</h2>
          <p className="hp-cta-sub">Join thousands of people preserving their moments for the future.</p>
          <button className="hp-cta-btn" onClick={() => navigate("/signup")}>Get Started Free</button>
        </div>
      </div>

      <footer className="hp-footer">
        <span className="hp-footer-text">©2026 Capsula® — Preserve what matters.</span>
        <span className="hp-footer-text">Made with ✦</span>
      </footer>
    </div>
  );
};

export default Homepage;