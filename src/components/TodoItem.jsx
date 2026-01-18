// src/components/TodoItem.jsx
import React, { useState, useEffect, useRef } from "react";

function widthPercentByIndex(idx) {
    const widths = [100, 92, 86, 80, 74, 68];
    return widths[idx] ?? 68;
}

const getInitialCompletionStatus = (item) => {
    // Güvenli okuma: Veri hangi isimle gelirse gelsin yakala
    const val = item.isCompleted ?? item.IsCompleted ?? item.completed;
    return !!val;
};

export default function TodoItem({ item, index, onDelete, onMove, onToggle, onUpdate }) {

    // --- Durum State'leri ---
    const [isAnimating, setIsAnimating] = useState(false);
    const [localIsCompleted, setLocalIsCompleted] = useState(getInitialCompletionStatus(item));

    // --- Edit Modu State'leri ---
    const [isEditing, setIsEditing] = useState(false);
    const [editText, setEditText] = useState(item.Text || item.text || item.task);
    const inputRef = useRef(null);

    // Prop değiştiğinde local state'i güncelle
    useEffect(() => {
        setLocalIsCompleted(getInitialCompletionStatus(item));
        if (!isEditing) {
            setEditText(item.Text || item.text || item.task);
        }
    }, [item.isCompleted, item.IsCompleted, item.completed, item.Text, item.text, item.task, isEditing]);

    // Edit modu açılınca input'a odaklan
    useEffect(() => {
        if (isEditing && inputRef.current) {
            inputRef.current.focus();
            // İmleci metnin sonuna koy
            inputRef.current.setSelectionRange(inputRef.current.value.length, inputRef.current.value.length);
        }
    }, [isEditing]);

    const isCompleted = localIsCompleted;
    const itemDate = new Date(item.CreatedAt || item.timestamp);
    const widthPct = widthPercentByIndex(index);
    const isNew = index === 0 && (Date.now() - itemDate.getTime() < 1600);
    const isValidDate = !isNaN(itemDate.getTime());

    const classes = [
        'todo',
        index === 0 ? 'top' : '',
        isNew ? 'new-flash' : '',
        index >= 5 ? 'dimmed' : '',
        isCompleted ? 'completed-fade completed-style' : '',
        isAnimating ? 'flash-success' : '',
    ].join(' ').trim();

    // --- Olay Yönetimi ---

    const handleToggle = async () => {
        if (isAnimating || isEditing) return;

        const originalState = localIsCompleted;
        const newState = !originalState;
        setLocalIsCompleted(newState);
        setIsAnimating(true);

        try {
            await onToggle(item.id);
        } catch (error) {
            console.error("Hata:", error);
            setLocalIsCompleted(originalState);
        } finally {
            setTimeout(() => {
                setIsAnimating(false);
            }, 1200);
        }
    };

    const handleDoubleClick = () => {
        if (isCompleted) return; // Tamamlananlar düzenlenmesin
        setIsEditing(true);
        setEditText(item.Text || item.text || item.task);
    };

    const handleSave = async () => {
        const currentText = item.Text || item.text || item.task;
        // Değişiklik yoksa veya boşsa kapat
        if (!editText || !editText.trim() || editText === currentText) {
            setIsEditing(false);
            return;
        }

        try {
            if (onUpdate) {
                const success = await onUpdate(item.id, editText);
                if (success) setIsEditing(false);
            } else {
                console.error("onUpdate fonksiyonu bulunamadı. Lütfen App.jsx ve TodoColumn.jsx dosyalarını kontrol edin.");
                setIsEditing(false);
            }
        } catch (error) {
            console.error("Update hatası", error);
        }
    };

    const handleKeyDown = (e) => {
        // Ctrl + Enter ile kaydet
        if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
            handleSave();
        }
        // Sadece Enter yeni satır yapar (textarea varsayılanı)
        else if (e.key === 'Escape') {
            setEditText(item.Text || item.text || item.task);
            setIsEditing(false);
        }
    };

    return (
        <div
            className={classes}
            style={{ width: `${widthPct}%` }}
            title={isValidDate ? itemDate.toLocaleString() : "Geçersiz Tarih"}
        >
            <div className="content-wrapper">
                <button
                    className={`btn-toggle ${isCompleted ? 'completed' : 'not-completed'}`}
                    onClick={handleToggle}
                    title={isCompleted ? "Tamamlanmadı Olarak İşaretle" : "Tamamlandı Olarak İşaretle"}
                    disabled={isAnimating}
                >
                    {isCompleted ? '✖' : '✔'}
                </button>

                <div className="text-content" onDoubleClick={handleDoubleClick}>
                    {isEditing ? (
                        // 🎯 DÜZENLENMİŞ MEMO TİPİ TEXTAREA
                        <textarea
                            ref={inputRef}
                            value={editText}
                            onChange={(e) => setEditText(e.target.value)}
                            onBlur={handleSave}
                            onKeyDown={handleKeyDown}
                            style={{
                                width: "100%",
                                minHeight: "80px", // Memo havası için minimum yükseklik
                                padding: "8px 10px",
                                color: "#e0e0e0",
                                background: "#252525",
                                border: "1px solid #555",
                                borderRadius: "4px",
                                outline: "none",
                                fontSize: "15px",
                                fontFamily: "inherit",
                                resize: "vertical", // Dikeyde boyutlandırılabilir
                                lineHeight: "1.4"
                            }}
                        />
                    ) : (
                        // Normal Metin Modu
                        <>
                            <div style={{
                                fontSize: 15,
                                fontWeight: 600,
                                textDecoration: isCompleted ? 'line-through' : 'none',
                                color: isCompleted ? '#A0AEC0' : 'inherit',
                                cursor: 'text',
                                whiteSpace: 'pre-wrap', // Satır sonlarını korur
                                wordBreak: 'break-word'
                            }}>{item.Text || item.text || item.task}</div>
                            <div className="meta">
                                Eklendi: {isValidDate ? itemDate.toLocaleTimeString() : 'Bilinmiyor'}
                            </div>
                        </>
                    )}
                </div>

                <div className="actions">
                    {onMove && (
                        <button
                            className="btn-move"
                            onClick={() => onMove(item.id)}
                            title="Şu Anda Yapılıyor'a Taşı"
                        >
                            ▶
                        </button>
                    )}

                    <button
                        className="btn-delete"
                        onClick={() => onDelete(item.id)}
                        title="Sil"
                    >
                        X
                    </button>
                </div>
            </div>
        </div>
    );
}