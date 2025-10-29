import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    headers: { "Content-Type": "application/json" },
});

export const todoService = {
    getCurrent: async () => {
        try {
            const res = await api.get("/Todos/current");
            return res.data;
        } catch (error) {
            console.error("API GET Current Hata (200 OK dönmemiş olabilir, 404/CORS?):", error.message);
            return [];
        }
    },

    getNext: async () => {
        try {
            const res = await api.get("/Todos/next");
            return res.data;
        } catch (error) {
            console.error("API GET Next Hata (404/CORS?):", error.message);
            return [];
        }
    },

    addCurrent: async (text) => {
        const res = await api.post("/Todos/current", { text });
        return res.data;
    },

    addNext: async (text) => {
        const res = await api.post("/Todos/next", { text });
        return res.data;
    },

    deleteCurrent: async (id) => {
        return api.delete(`/Todos/${id}`);
    },

    deleteNext: async (id) => {
        return api.delete(`/Todos/${id}`);
    },

    moveToCurrent: async (id) => {
        const res = await api.post(`/Todos/move/${id}`);
        return res.data;
    },
    toggleCompleted: async (id) => {
        return api.put(`/Todos/status/${id}`);
    },
};