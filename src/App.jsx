// src/App.jsx (TAM VE EKSİKSİZ VERSİYON)

import React from "react";
// Dosya yolu büyük/küçük harf sorunlarına dikkat edin
import Header from "./components/Header";
import InputSection from "./components/InputSection";
import TodoColumn from "./components/TodoColumn";
import { useTodos } from "./hooks/useTodos";

export default function App() {
  const {
    currentTodos,
    nextTodos,
    addCurrent,
    addNext,
    deleteCurrent,
    deleteNext,
    moveToCurrent,
    loading
  } = useTodos();

  return (
    <div className="app">

      {/* 🛑 HATA BURADAYDI: HEADER VE INPUT BÖLÜMLERİ */}
      <Header />
      <InputSection onAddCurrent={addCurrent} onAddNext={addNext} />

      {/* YÜKLEME VE BİLGİ MESAJI */}
      <div style={{ marginBottom: 12, color: "#9aa0a6", fontSize: 13 }}>
        {loading ? "Yükleniyor..." : "Son 6 kayıt gösteriliyor. Yeni eklenen en üstte belirginleşir."}
      </div>

      {/* PİRAMİT SÜTUNLARI */}
      <div className="columns">
        {/* Şu anda ne yapıyorum? (Sadece silme) */}
        <TodoColumn
          title="Şu anda ne yapıyorum?"
          todos={currentTodos}
          onDelete={deleteCurrent}
        />
        {/* Ne yapacağım? (Silme ve Taşıma) */}
        <TodoColumn
          title="Ne yapacağım?"
          todos={nextTodos}
          onDelete={deleteNext}
          onMove={moveToCurrent}
        />
      </div>
    </div>
  );
}