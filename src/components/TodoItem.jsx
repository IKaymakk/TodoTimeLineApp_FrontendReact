// src/components/TodoItem.jsx

import React from "react";

function widthPercentByIndex(idx) {
    const widths = [100, 92, 86, 80, 74, 68];
    return widths[idx] ?? 68;
}
// Yeni prop'ları al: onDelete ve onMove
export default function TodoItem({ item, index, onDelete, onMove }) {
    // ... itemDate, isNew, widthPct, isValidDate, classes hesaplamaları kalsın ...

    const itemDate = new Date(item.timestamp);
    const isNew = index === 0 && (Date.now() - item.timestamp < 1600);
    const widthPct = widthPercentByIndex(index);
    const isValidDate = !isNaN(itemDate);

    const classes = [
        'todo',
        index === 0 ? 'top' : '',
        index === 0 && isNew ? 'new-flash' : '',
        index >= 5 ? 'dimmed' : '',
    ].join(' ').trim();

    return (
        <div
            className={classes}
            style={{ width: `${widthPct}%` }}
            title={isValidDate ? itemDate.toLocaleString() : "Geçersiz Tarih"}
        >
            {/* Yeni: İçerik ve butonları sarmalayan div */}
            <div className="content-wrapper">
                <div className="text-content">
                    <div style={{ fontSize: 15, fontWeight: 600 }}>{item.task}</div>
                    <div className="meta">
                        Eklendi: {isValidDate ? itemDate.toLocaleTimeString() : 'Bilinmiyor'}
                    </div>
                </div>

                {/* Yeni: Butonlar Bölümü */}
                <div className="actions">
                    {/* Taşı Butonu: Sadece onMove prop'u varsa (yani Next sütunundaysa) görünür. */}
                    {onMove && (
                        <button className="btn-move" onClick={onMove} title="Şu Anda Yapılıyor'a Taşı">
                            ▶
                        </button>
                    )}

                    {/* Sil Butonu: Her zaman görünür. */}
                    <button className="btn-delete" onClick={onDelete} title="Sil">
                        X
                    </button>
                </div>
            </div>
        </div>
    );
}