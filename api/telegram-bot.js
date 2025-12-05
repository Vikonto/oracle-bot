import { GoogleGenerativeAI } from "@google/generative-ai";

// Словарь для 4 языков
const dictionary = {
    ru: {
        welcome: "🌌 *Приветствую, странник*\n\n✨ Я — Древний Оракул. Я вижу прошлое, настоящее и будущее.\n\n🔮 Готов узнать свою судьбу?",
        selectTopic: "🔮 *Выбери тему предсказания:*",
        thinking: "✨ Духи слушают...\n🌀 Связываюсь с космосом...",
        error: "⚠️ Связь с космосом прервана. Попробуйте позже.",
        askAgain: "🔄 Задать новый вопрос",
        changeLang: "🌐 Сменить язык",
        topics: {
            love: "❤️ Любовь",
            money: "💎 Деньги",
            yesno: "⚖️ Да/Нет",
            today: "🃏 Карта Дня",
            advice: "✨ Совет",
            secret: "👁️ Тайное"
        }
    },
    en: {
        welcome: "🌌 *Greetings, traveler*\n\n✨ I am the Ancient Oracle. I see past, present, and future.\n\n🔮 Ready to know your fate?",
        selectTopic: "🔮 *Choose your path:*",
        thinking: "✨ Spirits are listening...\n🌀 Connecting to the cosmos...",
        error: "⚠️ Connection to cosmos lost. Try again later.",
        askAgain: "🔄 Ask Another",
        changeLang: "🌐 Change Language",
        topics: {
            love: "❤️ Love",
            money: "💎 Money",
            yesno: "⚖️ Yes/No",
            today: "🃏 Card of Day",
            advice: "✨ Advice",
            secret: "👁️ Secret"
        }
    },
    he: {
        welcome: "🌌 *שלום לנודד*\n\n✨ אני האורקל העתיק. אני רואה עבר, הווה ועתיד.\n\n🔮 מוכן לגלות את גורלך?",
        selectTopic: "🔮 *בחר את דרכך:*",
        thinking: "✨ הרוחות מקשיבות...\n🌀 מתחבר ליקום...",
        error: "⚠️ החיבור ליקום אבד. נסה שוב מאוחר יותר.",
        askAgain: "🔄 שאל שוב",
        changeLang: "🌐 שנה שפה",
        topics: {
            love: "❤️ אהבה",
            money: "💎 כסף",
            yesno: "⚖️ כן/לא",
            today: "🃏 קלף יומי",
            advice: "✨ עצה",
            secret: "👁️ סוד"
        }
    },
    ar: {
        welcome: "🌌 *أهلاً أيها المسافر*\n\n✨ أنا العراف القديم. أرى الماضي والحاضر والمستقبل.\n\n🔮 مستعد لمعرفة مصيرك؟",
        selectTopic: "🔮 *اختر مسارك:*",
        thinking: "✨ الأرواح تستمع...\n🌀 جاري الاتصال بالكون...",
        error: "⚠️ انقطع الاتصال بالكون. حاول لاحقاً.",
        askAgain: "🔄 اسأل مرة أخرى",
        changeLang: "🌐 تغيير اللغة",
        topics: {
            love: "❤️ حب",
            money: "💎 مال",
            yesno: "⚖️ نعم/لا",
            today: "🃏 بطاقة اليوم",
            advice: "✨ نصيحة",
            secret: "👁️ سر"
        }
    }
};

// Клавиатуры
function getLanguageKeyboard() {
    return {
        inline_keyboard: [
            [
                { text: "🇷🇺 Русский", callback_data: "lang_ru" },
                { text: "🇬🇧 English", callback_data: "lang_en" }
            ],
            [
                { text: "🇮🇱 עברית", callback_data: "lang_he" },
                { text: "🇸🇦 العربية", callback_data: "lang_ar" }
            ]
        ]
    };
}

function getTopicsKeyboard(lang) {
    const t = dictionary[lang].topics;
    return {
        inline_keyboard: [
            [
                { text: t.love, callback_data: "topic_love" },
                { text: t.money, callback_data: "topic_money" }
            ],
            [
                { text: t.yesno, callback_data: "topic_yesno" },
                { text: t.today, callback_data: "topic_today" }
            ],
            [
                { text: t.advice, callback_data: "topic_advice" },
                { text: t.secret, callback_data: "topic_secret" }
            ],
            [
                { text: dictionary[lang].changeLang, callback_data: "change_lang" }
            ]
        ]
    };
}

function getActionKeyboard(lang) {
    return {
        inline_keyboard: [
            [{ text: dictionary[lang].askAgain, callback_data: "ask_again" }],
            [{ text: dictionary[lang].changeLang, callback_data: "change_lang" }]
        ]
    };
}

// Генерация предсказания через Gemini
async function getOraclePrediction(topic, lang, apiKey) {
    const langMap = { ru: "Russian", en: "English", he: "Hebrew", ar: "Arabic" };
    const topicMap = {
        love: { ru: "Любовь", en: "Love", he: "אהבה", ar: "حب" },
        money: { ru: "Деньги", en: "Money", he: "כסף", ar: "مال" },
        yesno: { ru: "Да/Нет", en: "Yes/No", he: "כן/לא", ar: "نعم/لا" },
        today: { ru: "Карта Дня", en: "Card of Day", he: "קלף יומי", ar: "بطاقة اليوم" },
        advice: { ru: "Совет", en: "Advice", he: "עצה", ar: "نصيحة" },
        secret: { ru: "Тайное", en: "Secret", he: "סוד", ar: "سر" }
    };

    const prompt = `You are a mystical Oracle speaking to Gen Z in ${langMap[lang]}.
Topic: ${topicMap[topic][lang]}.

Task: Give a SHORT (2-3 sentences max), mystical prediction with Gen Z vibes.
Style: Authentic, relatable, slightly sassy.
Format: Use *bold* for Telegram Markdown.
Use 2-3 emojis strategically.

Structure:
1. Bold statement or answer
2. Brief mystical insight
${topic === 'yesno' ? '3. Start with bold *YES* or *NO*' : ''}

Keep it CONCISE and PUNCHY. Output ONLY in ${langMap[lang]}.`;

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
}

// Telegram API функции
async function sendTelegramMessage(chatId, text, options = {}) {
    const token = process.env.TELEGRAM_BOT_TOKEN;
    const url = `https://api.telegram.org/bot${token}/sendMessage`;
    
    const body = {
        chat_id: chatId,
        text: text,
        parse_mode: 'Markdown',
        ...options
    };
    
    const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    });
    
    return response.json();
}

async function editTelegramMessage(chatId, messageId, text, options = {}) {
    const token = process.env.TELEGRAM_BOT_TOKEN;
    const url = `https://api.telegram.org/bot${token}/editMessageText`;
    
    const body = {
        chat_id: chatId,
        message_id: messageId,
        text: text,
        parse_mode: 'Markdown',
        ...options
    };
    
    const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    });
    
    return response.json();
}

async function answerCallbackQuery(queryId) {
    const token = process.env.TELEGRAM_BOT_TOKEN;
    const url = `https://api.telegram.org/bot${token}/answerCallbackQuery`;
    
    const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ callback_query_id: queryId })
    });
    
    return response.json();
}

// Хранилище пользователей (in-memory)
const users = new Map();

// Основной обработчик
export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const API_KEY = process.env.GOOGLE_API_KEY;
    const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

    if (!API_KEY || !BOT_TOKEN) {
        return res.status(500).json({ error: 'Missing API keys' });
    }

    try {
        const update = req.body;

        // Команда /start
        if (update.message && update.message.text === '/start') {
            const chatId = update.message.chat.id;
            
            if (!users.has(chatId)) {
                users.set(chatId, { lang: 'en' });
            }

            await sendTelegramMessage(
                chatId,
                "🌐 *Choose your language:*",
                { reply_markup: getLanguageKeyboard() }
            );

            return res.status(200).json({ ok: true });
        }

        // Callback Query (нажатие на кнопки)
        if (update.callback_query) {
            const query = update.callback_query;
            const chatId = query.message.chat.id;
            const messageId = query.message.message_id;
            const data = query.data;

            if (!users.has(chatId)) {
                users.set(chatId, { lang: 'en' });
            }

            const user = users.get(chatId);

            // Выбор языка
            if (data.startsWith('lang_')) {
                const lang = data.split('_')[1];
                user.lang = lang;
                const t = dictionary[lang];

                await editTelegramMessage(chatId, messageId, t.welcome);
                await sendTelegramMessage(chatId, t.selectTopic, {
                    reply_markup: getTopicsKeyboard(lang)
                });
                await answerCallbackQuery(query.id);
                return res.status(200).json({ ok: true });
            }

            // Смена языка
            if (data === 'change_lang') {
                await sendTelegramMessage(chatId, "🌐 *Choose language:*", {
                    reply_markup: getLanguageKeyboard()
                });
                await answerCallbackQuery(query.id);
                return res.status(200).json({ ok: true });
            }

            // Выбор темы
            if (data.startsWith('topic_')) {
                const topic = data.split('_')[1];
                const t = dictionary[user.lang];

                await sendTelegramMessage(chatId, t.thinking);

                try {
                    const prediction = await getOraclePrediction(topic, user.lang, API_KEY);
                    
                    await sendTelegramMessage(
                        chatId,
                        `🌌 *PROPHECY*\n\n${prediction}`,
                        { reply_markup: getActionKeyboard(user.lang) }
                    );
                } catch (error) {
                    await sendTelegramMessage(chatId, t.error, {
                        reply_markup: getActionKeyboard(user.lang)
                    });
                }

                await answerCallbackQuery(query.id);
                return res.status(200).json({ ok: true });
            }

            // Новый вопрос
            if (data === 'ask_again') {
                const t = dictionary[user.lang];
                await sendTelegramMessage(chatId, t.selectTopic, {
                    reply_markup: getTopicsKeyboard(user.lang)
                });
                await answerCallbackQuery(query.id);
                return res.status(200).json({ ok: true });
            }

            await answerCallbackQuery(query.id);
        }

        return res.status(200).json({ ok: true });

    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ error: 'Internal error' });
    }
}
