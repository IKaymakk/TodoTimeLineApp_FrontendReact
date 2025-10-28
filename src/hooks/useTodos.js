// src/hooks/useTodos.js (API BAĞLANTILI VERSİYON)

import { useEffect, useState, useCallback } from "react";
// todoService'i artık gerçek çağrılar için kullanacağız
import { todoService } from "../api/todoservice";

// NOT: getHardcodedData artık kullanılmayacak, kaldırılabilir.

export function useTodos() {
    // API'den gelen veriye uyum sağlamak için task yerine text kullanıyoruz, 
    // ancak Frontend'deki TodoItem component'i 'item.task' beklediği için 
    // dönen veriyi formatlayan bir fonksiyon kullanmak en iyisi.

    // API'den gelen veriyi Frontend formatına dönüştürür (text -> task, createdAt -> timestamp)
    const adaptData = (apiItem) => ({
        id: apiItem.id,
        task: apiItem.text,
        timestamp: new Date(apiItem.createdAt).getTime(), // JS milisaniye formatına çevir
        isCurrent: apiItem.isCurrent,
    });

    const [currentTodos, setCurrentTodos] = useState([]);
    const [nextTodos, setNextTodos] = useState([]);
    const [loading, setLoading] = useState(true);

    // Tüm verileri API'den çeken ana fonksiyon
    const fetchTodos = useCallback(async () => {
        debugger;
        setLoading(true);
        try {
            // İki listeyi paralel olarak çek
            const [currentRes, nextRes] = await Promise.all([
                todoService.getCurrent(),
                todoService.getNext(),
            ]);

            // Gelen veriyi Frontend'in beklediği formata dönüştürerek state'e at
            setCurrentTodos(currentRes.map(adaptData));
            setNextTodos(nextRes.map(adaptData));
        } catch (error) {
            console.error("API'den veri çekilirken hata oluştu:", error);
            // Hata durumunda boş liste göster
            setCurrentTodos([]);
            setNextTodos([]);
        } finally {
            setLoading(false);
        }
    }, []);

    // Component yüklendiğinde veriyi çek
    useEffect(() => {
        fetchTodos();
    }, [fetchTodos]);


    // --- CRUD FONKSİYONLARI (API CALLS) ---

    const addCurrent = async (text) => {
        try {
            const newItem = await todoService.addCurrent(text);
            // Sadece yeni eklenen öğeyi state'in başına ekleyip listeyi tekrar çekmekten kaçınıyoruz.
            // Ancak, sadece yeni öğe eklenirse, API'nin limit (TOP 6) kuralını Frontend'de yönetmek zor.
            // En güvenilir yol: Başarılı eklemeden sonra listeyi yeniden çekmek.
            await fetchTodos();
        } catch (error) {
            console.error("Current Todo eklenirken hata:", error);
        }
    };

    const addNext = async (text) => {
        try {
            await todoService.addNext(text);
            await fetchTodos();
        } catch (error) {
            console.error("Next Todo eklenirken hata:", error);
        }
    };

    const deleteCurrent = async (id) => {
        try {
            // Backend'in Delete çağrısı listeye özgü değildi (TodoController'da Delete/{id})
            // Ancak frontend'de sadece id'yi siliyoruz.
            await todoService.deleteCurrent(id); // todoService.js'teki metot çağrılıyor
            // Başarılı silme sonrası listeyi yeniden çek
            await fetchTodos();
        } catch (error) {
            console.error("Current Todo silinirken hata:", error);
        }
    };

    const deleteNext = async (id) => {
        try {
            await todoService.deleteNext(id); // todoService.js'teki metot çağrılıyor
            await fetchTodos();
        } catch (error) {
            console.error("Next Todo silinirken hata:", error);
        }
    };

    const moveToCurrent = async (itemToMove) => {
        try {
            // itemToMove.id'yi kullanarak API'ye taşıma çağrısı yap
            const updatedItem = await todoService.moveToCurrent(itemToMove.id);
            // Taşıma işlemi iki listeyi de etkilediğinden, en iyi yol listeleri yeniden çekmek
            await fetchTodos();
        } catch (error) {
            console.error("Todo taşınırken hata:", error);
        }
    };

    // return bloğu aynı kalır:
    return {
        currentTodos,
        nextTodos,
        addCurrent,
        addNext,
        deleteCurrent,
        deleteNext,
        moveToCurrent,
        loading
    };
}