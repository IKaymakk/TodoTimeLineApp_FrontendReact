// src/components/TodoColumn.jsx

import React from "react";
import TodoItem from "./TodoItem";

// Yeni prop'ları al: onDelete ve onMove
export default function TodoColumn({ title, todos, onDelete, onMove, onToggle }) {
    return (
        <div className="column">
            {/* ... */}
            <div className="list">
                {/* ... */}

                {todos.map((t, idx) => (
                    <TodoItem
                        key={t.id}
                        item={t}
                        index={idx}
                        onDelete={() => onDelete(t.id)}
                        onMove={onMove ? () => onMove(t) : undefined}
                        // 🎯 Yeni: Toggle Fonksiyonunu geçir
                        onToggle={onToggle}
                    />
                ))}
            </div>
        </div>
    );
}