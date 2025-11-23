import React, { useState, useEffect, useRef } from "react";

function widthPercentByIndex(idx) {
    const widths = [100, 92, 86, 80, 74, 68];
    return widths[idx] ?? 68;
}

const getInitialCompletionStatus = (item) => {
    const completionValue = item.isCompleted ?? item.IsCompleted ?? item.completed;
    return !!completionValue;
};

// 🎯 onUpdate prop'unu al
export default function TodoItem({ item, index, onDelete, onMove, onToggle, onUpdate }) {

    const [isAnimating, setIsAnimating] = useState(false);
    const [localIsCompleted, setLocalIsCompleted] = useState(getInitialCompletionStatus(item));

    // --- Düzenleme State'leri ---
    const [isEditing, setIsEditing] = useState(false); // Düzenleme modu açık mı?
    const [editText, setEditText] = useState(item.Text || item.text || item.task); // Input içindeki metin
    const inputRef = useRef(null); // Input'a otomatik odaklanmak için

    useEffect(() => {
        setLocalIsCompleted(getInitialCompletionStatus(item));
        // Dışarıdan veri güncellenirse edit text'i de güncelle (eğer o an edit yapmıyorsak)
        if (!isEditing) {
            setEditText(item.Text || item.text || item.task);
        }
    }, [item.isCompleted, item.IsCompleted, item.completed, item.Text, item.text, item.task, isEditing]);

    // Düzenleme modu açıldığında input'a odaklan
    useEffect(() => {
        if (isEditing && inputRef.current) {
            inputRef.current.focus();
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

    const handleToggle = async () => {
        if (isAnimating || isEditing) return; // Edit yaparken toggle yapma
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
            setTimeout(() => { setIsAnimating(false); }, 1200);
        }
    };

    // --- Çift Tıklama İşleyicisi ---
    const handleDoubleClick = () => {
        if (isCompleted) return; // Tamamlanmış görevleri düzenlemeye izin verme (isteğe bağlı)
        setIsEditing(true);
    };

    // --- Kaydetme İşlemi ---
    const handleSave = async () => {
        // Boş metin kaydetme veya değişiklik yoksa kapat
        if (!editText.trim() || editText === (item.Text || item.text || item.task)) {
            setIsEditing(false);
            return;
        }

        try {
            await onUpdate(item.id, editText); // API'ye güncelleme gönder
            setIsEditing(false);
        } catch (error) {
            console.error("Güncelleme hatası:", error);
            // Hata durumunda eski metne dönebiliriz veya uyarı verebiliriz
        }
    };

    // --- Klavye Kontrolü (Enter: Kaydet, Esc: İptal) ---
    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleSave();
        } else if (e.key === 'Escape') {
            setEditText(item.Text || item.text || item.task); // Eski haline getir
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
                    disabled={isAnimating}
                >
                    {isCompleted ? '✖' : '✔'}
                </button>

                <div className="text-content" onDoubleClick={handleDoubleClick}>
                    {isEditing ? (
                        // Düzenleme Modu: Input Göster
                        <input
                            ref={inputRef}
                            type="text"
                            value={editText}
                            onChange={(e) => setEditText(e.target.value)}
                            onBlur={handleSave} // Odak kaybedilince kaydet
                            onKeyDown={handleKeyDown}
                            style={{
                                width: '100%',
                                padding: '4px 8px',
                                borderRadius: '4px',
                                border: '1px solid #555',
                                background: '#222',
                                color: '#fff',
                                fontSize: '15px',
                                outline: 'none'
                            }}
                        />
                    ) : (
                        // Normal Mod: Metin Göster
                        <>
                            <div style={{
                                fontSize: 15,
                                fontWeight: 600,
                                textDecoration: isCompleted ? 'line-through' : 'none',
                                color: isCompleted ? '#A0AEC0' : 'inherit',
                                cursor: 'text' // Metnin düzenlenebilir olduğunu hissettir
                            }}>
                                {item.Text || item.text || item.task}
                            </div>
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