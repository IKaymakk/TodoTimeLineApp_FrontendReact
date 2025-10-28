import axios from "axios";

// API base URL, .env dosyasından al
const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    headers: { "Content-Type": "application/json" },
});

// Tüm işlemler burada
export const todoService = {
    // GET: Şu anda ne yapıyorum
    getCurrent: async () => {
        const res = await api.get("/todos/current");
        return res.data; // array
    },

    // GET: Ne yapacağım
    getNext: async () => {
        const res = await api.get("/todos/next");
        return res.data;
    },

    // POST: Yeni "Şu anda ne yapıyorum" ekle
    addCurrent: async (text) => {
        const res = await api.post("/todos/current", { text });
        return res.data;
    },

    // POST: Yeni "Ne yapacağım" ekle
    addNext: async (text) => {
        const res = await api.post("/todos/next", { text });
        return res.data;
    },

    // DELETE: "Şu anda ne yapıyorum" sil
    deleteCurrent: async (id) => {
        return api.delete(`/todos/current/${id}`);
    },

    // DELETE: "Ne yapacağım" sil
    deleteNext: async (id) => {
        return api.delete(`/todos/next/${id}`);
    },

    // POST: "Ne yapacağım" -> "Şu anda ne yapıyorum" taşı
    moveToCurrent: async (id) => {
        const res = await api.post(`/todos/move/${id}`);
        return res.data;
    },
};
