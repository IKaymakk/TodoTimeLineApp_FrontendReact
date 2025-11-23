import React from "react";
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
    loading,
    toggleCompleted,
    updateText
  } = useTodos();

  return (
    <div className="app">

      <Header />
      <InputSection onAddCurrent={addCurrent} onAddNext={addNext} />

      <div style={{ marginBottom: 12, color: "#9aa0a6", fontSize: 13 }}>
        {loading ? "Yükleniyor..." : "Son 6 kayıt gösteriliyor. Yeni eklenen en üstte belirginleşir."}
      </div>

      <div className="columns">
        <TodoColumn
          title="Şu anda ne yapıyorum?"
          todos={currentTodos}
          onToggle={toggleCompleted}
          onDelete={deleteCurrent}
          onUpdate={updateText}
        />
        <TodoColumn
          title="Ne yapacağım?"
          todos={nextTodos}
          onToggle={toggleCompleted}
          onMove={moveToCurrent}
          onDelete={deleteNext}
          onUpdate={updateText}
        />
      </div>
    </div>
  );
}