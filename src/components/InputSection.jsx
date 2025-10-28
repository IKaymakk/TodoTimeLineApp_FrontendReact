import React, { useState } from "react";

export default function InputSection({ onAddCurrent, onAddNext }) {
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleAddCurrent(){
    if (!current.trim()) return;
    setSaving(true);
    try {
      await onAddCurrent(current.trim());
      setCurrent("");
    } finally { setSaving(false); }
  }
  async function handleAddNext(){
    if (!next.trim()) return;
    setSaving(true);
    try {
      await onAddNext(next.trim());
      setNext("");
    } finally { setSaving(false); }
  }

  return (
    <div className="inputSection">
      <div className="inputBox">
        <input
          className="inputField"
          placeholder="Şu anda ne yapıyorum?"
          value={current}
          onChange={(e)=>setCurrent(e.target.value)}
          onKeyDown={(e)=>{ if(e.key === "Enter") handleAddCurrent(); }}
        />
        <button className="btn btnAccent" onClick={handleAddCurrent} disabled={saving}>
          Kaydet
        </button>
      </div>

      <div className="inputBox">
        <input
          className="inputField"
          placeholder="Ne yapacağım?"
          value={next}
          onChange={(e)=>setNext(e.target.value)}
          onKeyDown={(e)=>{ if(e.key === "Enter") handleAddNext(); }}
        />
        <button className="btn btnAccent" onClick={handleAddNext} disabled={saving}>
          Kaydet
        </button>
      </div>
    </div>
  );
}
