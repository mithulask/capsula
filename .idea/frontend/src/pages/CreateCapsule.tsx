import React, { useState } from "react";

const CreateCapsule: React.FC = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [mediaUrl, setMediaUrl] = useState("");
  const [unlockDate, setUnlockDate] = useState("");
  const [message, setMessage] = useState("");

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token"); // must be logged in

    try {
      const res = await fetch("http://localhost:5000/capsules", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ title, content, media_url: mediaUrl, unlock_date: unlockDate })
      });

      const data = await res.json();
      if (res.ok) {
        setMessage("Capsule created successfully!");
      } else {
        setMessage(data.message);
      }
    } catch (err) {
      setMessage("Failed to create capsule.");
    }
  };

  return (
    <form onSubmit={handleCreate}>
      <input type="text" placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} required />
      <textarea placeholder="Content" value={content} onChange={e => setContent(e.target.value)} />
      <input type="text" placeholder="Media URL" value={mediaUrl} onChange={e => setMediaUrl(e.target.value)} />
      <input type="date" value={unlockDate} onChange={e => setUnlockDate(e.target.value)} required />
      <button type="submit">Create Capsule</button>
      {message && <p>{message}</p>}
    </form>
  );
};

export default CreateCapsule;
