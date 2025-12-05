import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
  // Проверяем, что к нам постучались методом POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // Берем ключ из СЕКРЕТНОГО сейфа сервера (Environment Variable)
  const API_KEY = process.env.GOOGLE_API_KEY;

  if (!API_KEY) {
    return res.status(500).json({ error: 'Server config error: No Key' });
  }

  try {
    const { prompt } = req.body; // Получаем текст от сайта
    
    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Отправляем ответ обратно на сайт
    res.status(200).json({ text: text });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error generating prediction' });
  }
}
