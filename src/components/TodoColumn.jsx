// src/components/TodoColumn.jsx

import React from "react";
import TodoItem from "./TodoItem";

// Yeni prop'ları al: onDelete ve onMove
export default function TodoColumn({ title, todos, onDelete, onMove }) {
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
                        // Silme: item'ın ID'sini alıp onDelete'e gönder.
                        onDelete={() => onDelete(t.id)}
                        // Taşıma: Eğer onMove prop'u varsa, tüm item'ı gönder. (Sadece Next sütununda dolu olacak)
                        onMove={onMove ? () => onMove(t) : undefined}
                    />
                ))}
            </div>
        </div>
    );
}