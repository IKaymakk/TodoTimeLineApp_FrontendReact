// src/hooks/useTodos.js

import { useEffect, useState } from "react";
// todoService kalsın, ancak kullanmayacağız
import { todoService } from "../api/todoservice";

const getHardcodedData = () => {
    const baseTime = Date.now();
    return [
        { id: 1, task: "Frontend'i API olmadan gösteren çözümü uygula!", timestamp: baseTime },
        { id: 2, task: "Gold teması ve buton animasyonlarını kontrol et.", timestamp: baseTime - 60000 },
        { id: 3, task: "Piramit liste yapısının doğru çalıştığından emin ol.", timestamp: baseTime - 120000 },
        { id: 4, task: "Daha sonra .NET API'yi kodlamaya başla.", timestamp: baseTime - 180000 },
    ];
};
export function useTodos() {
    const [currentTodos, setCurrentTodos] = useState([]);
    const [nextTodos, setNextTodos] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let mounted = true;
        setTimeout(() => {
            if (!mounted) return;

            // API yerine Hardcode veriyi yükle:
            setCurrentTodos(getHardcodedData());
            setNextTodos(getHardcodedData().map(t => ({ ...t, id: t.id + 10 })));

            setLoading(false);
        }, 300);

        return () => (mounted = false);
    }, []);

    // 🎯 ADD FONKSİYONLARI (API yerine state'i güncelliyor)
    const addCurrent = async (text) => {
        const newItem = { id: Date.now(), task: text, timestamp: Date.now() };
        setCurrentTodos(prev => [newItem, ...prev].slice(0, 6));
    };
    const addNext = async (text) => {
        const newItem = { id: Date.now(), task: text, timestamp: Date.now() };
        setNextTodos(prev => [newItem, ...prev].slice(0, 6));
    };
    // YENİ: Current listesinden silme
    const deleteCurrent = (id) => {
        setCurrentTodos(prev => prev.filter(item => item.id !== id));
    };

    // YENİ: Next listesinden silme
    const deleteNext = (id) => {
        setNextTodos(prev => prev.filter(item => item.id !== id));
    };

    // YENİ: Next listesinden Current listesine taşıma
    const moveToCurrent = (itemToMove) => {
        // 1. Current listesine en üste ekle (ve 6 ile sınırla)
        setCurrentTodos(prev => [itemToMove, ...prev].slice(0, 6));
        // 2. Next listesinden kaldır
        setNextTodos(prev => prev.filter(item => item.id !== itemToMove.id));
    };

    return {
        currentTodos,
        nextTodos,
        addCurrent,
        addNext,
        // Yeni fonksiyonları dışa aktar
        deleteCurrent,
        deleteNext,
        moveToCurrent,
        loading
    };
}