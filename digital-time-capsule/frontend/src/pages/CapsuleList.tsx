import React, { useEffect, useState } from "react";

interface Capsule {
  id: number;
  title: string;
  content: string | null;
  media_url: string | null;
  unlock_date: string;
  is_unlocked: boolean;
}

const CapsuleList: React.FC = () => {
  const [capsules, setCapsules] = useState<Capsule[]>([]);

  useEffect(() => {
    const fetchCapsules = async () => {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/capsules", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setCapsules(data);
    };

    fetchCapsules();
  }, []);

  return (
    <div>
      {capsules.map(c => (
        <div key={c.id}>
          <h3>{c.title}</h3>
          <p>{c.is_unlocked ? c.content : "Locked until " + c.unlock_date}</p>
          {c.media_url && c.is_unlocked && <img src={c.media_url} alt={c.title} />}
        </div>
      ))}
    </div>
  );
};

export default CapsuleList;
