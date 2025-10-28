import axios from "axios";

// API base URL, .env dosyasından al
const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    headers: { "Content-Type": "application/json" },
});

export const todoService = {
    // GET: Şu anda ne yapıyorum
    getCurrent: async () => {
        try {
            const res = await api.get("/Todos/current");
            return res.data;
        } catch (error) {
            // Konsola hata mesajını bas
            console.error("API GET Current Hata (200 OK dönmemiş olabilir, 404/CORS?):", error.message);

            // CRITICAL: Hata oluşsa bile boş dizi döndür. 
            // Bu, useTodos'daki .map() çağrısının çökmesini engeller.
            return [];
        }
    },

    // GET: Ne yapacağım
    getNext: async () => {
        try {
            const res = await api.get("/Todos/next");
            return res.data;
        } catch (error) {
            console.error("API GET Next Hata (404/CORS?):", error.message);
            // CRITICAL: Hata oluşsa bile boş dizi döndür.
            return [];
        }
    },

    // POST: Yeni "Şu anda ne yapıyorum" ekle
    addCurrent: async (text) => {
        // YOL DÜZELTİLDİ
        const res = await api.post("/Todos/current", { text });
        return res.data;
    },

    // POST: Yeni "Ne yapacağım" ekle
    addNext: async (text) => {
        // YOL DÜZELTİLDİ
        const res = await api.post("/Todos/next", { text });
        return res.data;
    },

    // DELETE: Genel Silme
    // Not: Backend'de tek bir DELETE /{id} var.
    deleteCurrent: async (id) => {
        // YOL DÜZELTİLDİ: /Todos/{id}
        // Önceki versiyonda /todos/current/{id} idi, Backend'de bu yoktu.
        return api.delete(`/Todos/${id}`);
    },

    // DELETE: Genel Silme
    deleteNext: async (id) => {
        // YOL DÜZELTİLDİ
        return api.delete(`/Todos/${id}`);
    },

    // POST: "Ne yapacağım" -> "Şu anda ne yapıyorum" taşı
    moveToCurrent: async (id) => {
        // YOL DÜZELTİLDİ: /Todos/move/{id}
        const res = await api.post(`/Todos/move/${id}`);
        return res.data;
    },
};