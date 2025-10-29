// src/components/TodoItem.jsx

import React, { useState, useEffect } from "react"; // useEffect'i de eklediğimizden emin olalım
function widthPercentByIndex(idx) {
    const widths = [100, 92, 86, 80, 74, 68];
    return widths[idx] ?? 68;
}
// Yeni prop'ları al: onDelete ve onMove
export default function TodoItem({ item, index, onDelete, onMove, onToggle }) {    // ... itemDate, isNew, widthPct, isValidDate, classes hesaplamaları kalsın ...

    const itemDate = new Date(item.timestamp);
    const isNew = index === 0 && (Date.now() - item.timestamp < 1600);
    const widthPct = widthPercentByIndex(index);
    const isValidDate = !isNaN(itemDate);
    // item.isCompleted durumuna göre initial state ayarla
    const [isAnimating, setIsAnimating] = useState(false);

    // **1. Durum Düzeltmesi:** Görsel durum için local state (API'den gelen veriye dayanır)
    // Bu, tik/çarpı geçişini API cevabından bağımsız olarak anında gösterir.
    const [localIsCompleted, setLocalIsCompleted] = useState(item.IsCompleted);

    useEffect(() => {
        setLocalIsCompleted(item.IsCompleted);
    }, [item.IsCompleted]);
    const isCompleted = localIsCompleted;

    const classes = [
        'todo',
        index === 0 ? 'top' : '',
        index === 0 && isNew ? 'new-flash' : '',
        index >= 5 ? 'dimmed' : '',
        isCompleted ? 'completed-fade completed-style' : '',
        isAnimating ? 'flash-success' : '',
    ].join(' ').trim();

    const handleToggle = async () => {
        // API çağrısı öncesi butonu devre dışı bırak.
        if (isAnimating) return;

        // 1. **Anlık Görsel Güncelleme:** State'i hemen tersine çevir.
        // Bu adım, API çağrısı sırasında arayüzün kilitlenmesini engeller.
        const originalState = localIsCompleted;
        const newState = !originalState;
        setLocalIsCompleted(newState);

        // 2. Animasyonu Başlat
        setIsAnimating(true);

        try {
            // 3. KRİTİK API Çağrısı
            // Burası onToggle'ın tam olarak çalıştığı yer.
            await onToggle(item.id);

            // Eğer buraya gelindiyse: API başarılı olmuştur.
            // fetchTodos() çalışacak ve useEffect (yukarıda) yeni item.IsCompleted değerini alıp localIsCompleted'ı güncelleyecektir.

        } catch (error) {
            // Hata olursa, lokal state'i hemen geri al (işlem DB'de başarısız oldu)
            console.error("Durum güncellenirken API hatası! Lokal durumu geri alınıyor.", error);
            setLocalIsCompleted(originalState);
            // setLocalIsCompleted(item.IsCompleted) kullanmak yerine orijinal state'i kullanmak daha güvenlidir.
        } finally {
            // 4. Animasyonu Sonlandır
            // API başarılı veya başarısız olsun, animasyon bitmeli.
            setTimeout(() => {
                setIsAnimating(false);
            }, 1200);
        }
    };

    return (
        <div
            className={classes}
            style={{ width: `${widthPct}%` }}
            title={isValidDate ? itemDate.toLocaleString() : "Geçersiz Tarih"}
        >
            {/* Yeni: İçerik ve butonları sarmalayan div */}
            <div className="content-wrapper">
                <button
                    className={`btn-toggle ${isCompleted ? 'completed' : 'not-completed'}`}
                    onClick={handleToggle}
                    title={isCompleted ? "Tamamlanmadı Olarak İşaretle" : "Tamamlandı Olarak İşaretle"}
                >
                    {/* isCompleted True ise X (Kırmızı), False ise ✔ (Yeşil) gösterir */}
                    {isCompleted ? '✖' : '✔'}
                </button>
                <div className="text-content">
                    <div style={{ fontSize: 15, fontWeight: 600 }}>{item.task}</div>
                    <div className="meta">
                        Eklendi: {isValidDate ? itemDate.toLocaleTimeString() : 'Bilinmiyor'}
                    </div>
                </div>

                <div className="actions">
                    {onMove && (
                        <button className="btn-move" onClick={onMove} title="Şu Anda Yapılıyor'a Taşı">
                            ▶
                        </button>
                    )}

                    <button
                        className="btn-delete"
                        // ✅ DÜZELTME: Doğrudan çağrıya item.id eklendi
                        onClick={() => onDelete(item.id)}
                        title="Sil"
                    // disabled={isDeleting} kaldırıldı
                    >
                        X
                    </button>
                </div>
            </div>
        </div>
    );
}