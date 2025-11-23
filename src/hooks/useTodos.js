

import { useEffect, useState, useCallback } from "react";
import { todoService } from "../api/todoservice";


export function useTodos() {

    const adaptData = (apiItem) => ({
        id: apiItem.id,
        task: apiItem.text,
        timestamp: new Date(apiItem.createdAt).getTime(),
        isCurrent: apiItem.isCurrent,
        isCompleted: !!(apiItem.isCompleted ?? apiItem.IsCompleted),

    });

    const [currentTodos, setCurrentTodos] = useState([]);
    const [nextTodos, setNextTodos] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchTodos = useCallback(async () => {
        setLoading(true);
        try {
            const [currentRes, nextRes] = await Promise.all([
                todoService.getCurrent(),
                todoService.getNext(),
            ]);

            setCurrentTodos(currentRes.map(adaptData));
            setNextTodos(nextRes.map(adaptData));
        } catch (error) {
            console.error("API'den veri çekilirken hata oluştu:", error);
            setCurrentTodos([]);
            setNextTodos([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchTodos();
    }, [fetchTodos]);



    const addCurrent = async (text) => {
        try {
            const newItem = await todoService.addCurrent(text);
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
            await todoService.deleteCurrent(id);
            await fetchTodos();
        } catch (error) {
            console.error("Current Todo silinirken hata:", error);
        }
    };

    const deleteNext = async (id) => {
        try {
            await todoService.deleteNext(id);
            await fetchTodos();
        } catch (error) {
            console.error("Next Todo silinirken hata:", error);
        }
    };

    const moveToCurrent = async (itemToMove) => {
        try {
            const updatedItem = await todoService.moveToCurrent(itemToMove.id);
            await fetchTodos();
        } catch (error) {
            console.error("Todo taşınırken hata:", error);
        }
    };

    const toggleCompleted = async (id) => {
        try {
            await todoService.toggleCompleted(id);
            await fetchTodos();
        } catch (error) {
            console.error("Görevin tamamlanma durumu güncellenirken hata oluştu:", error);
        }
    };

    const updateText = async (id, newText) => {
        try {
            await todoService.updateText(id, newText);
            await fetchTodos();
        }
        catch (error) {
            console.error("Görev metni güncellenirken hata oluştu:", error);
        }
    }

    return {
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
    };
}