import React from "react";

export default function Header() {
    return (
        <div className="header">
            <div className="title">
                <div className="logo">PT</div>
                <div>
                    <div className="appTitle">Personal ToDo Timeline</div>
                    <div className="subtitle">Anlık yaptıkların ve planlarının timeline'ı</div>
                </div>
            </div>
            <div style={{ display: "flex", gap: 12 }}>
                <button className="btn btnGhost" onClick={() => {
                    // quick tip: show instructions
                    alert("Kısa kullanım: soldan 'şu anda' veya sağdan 'ne yapacağım' ekleyin. Yeni kayıt en üste gelir.");
                }}>Yardım</button>
                <a className="btn btnGhost" href="#" onClick={(e) => { e.preventDefault(); alert("Backend: dummy/localStorage kullanılıyor — ileride .NET endpoint ekle.") }}>Backend: dummy</a>
            </div>
        </div>
    );
}
