const express = require('express');
const axios = require('axios');
require('dotenv').config(); // .env dosyasını okuyabilmek için

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Test endpoint – tarayıcıdan /test yazınca çalışır mı kontrol eder
app.get("/test", async (req, res) => {
  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: 'Merhaba' }]
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
        }
      }
    );

    const reply = response.data.choices[0].message.content;
    res.send(reply);
  } catch (error) {
    console.error("API Hatası:", error.response?.data || error.message);
    res.status(500).send("❌ OpenAI API çalışmıyor");
  }
});

// Gerçek sohbet endpoint’i – Roblox burayı kullanır
app.post("/chat", async (req, res) => {
  const userMessage = req.body.message;

  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: userMessage }]
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
        }
      }
    );

    const reply = response.data.choices[0].message.content;
    res.json({ reply });
  } catch (error) {
    console.error("Chat endpoint hatası:", error.response?.data || error.message);
    res.status(500).json({ error: '❌ ChatGPT API error' });
  }
});

app.listen(port, () => {
  console.log(`✅ Server is running on port ${port}`);
});
