import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
    // 1. Разрешаем только POST запросы
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    // 2. Достаем ключ из сейфа сервера (Environment Variables)
    const API_KEY = process.env.GOOGLE_API_KEY;

    if (!API_KEY) {
        return res.status(500).json({ error: 'Server configuration error: API Key missing' });
    }

    try {
        // 3. Получаем данные от пользователя (из index.html)
        const { prompt } = req.body;

        if (!prompt) {
            return res.status(400).json({ error: 'No prompt provided' });
        }

        // 4. Стучимся в Google Gemini
        const genAI = new GoogleGenerativeAI(API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // 5. Отправляем чистый текст обратно на сайт
        return res.status(200).json({ text: text });

    } catch (error) {
        console.error("Gemini API Error:", error);
        return res.status(500).json({ error: 'Failed to generate prediction' });
    }
}
