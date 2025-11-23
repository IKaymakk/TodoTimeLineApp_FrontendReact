// src/components/TodoColumn.jsx

import React from "react";
import TodoItem from "./TodoItem";

export default function TodoColumn({ title, todos, onDelete, onMove, onToggle, onUpdate }) {
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
                        onToggle={onToggle}
                        onUpdate={onUpdate}
                    />
                ))}
            </div>
        </div>
    );
}