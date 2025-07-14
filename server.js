require('dotenv').config(); // .env dosyasını yükle

const express = require('express');
const axios = require('axios');
const app = express();
const port = process.env.PORT || 3000;

// API anahtarını kontrol et (gizli değilse geçici debug için gösterilir)
console.log("✅ API Key:", process.env.OPENAI_API_KEY ? "Yüklendi" : "YÜKLENMEDİ!");

app.use(express.json());

app.post('/chat', async (req, res) => {
  const userMessage = req.body.message;

  if (!userMessage) {
    return res.status(400).json({ error: 'Mesaj eksik' });
  }

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

    const botReply = response.data.choices[0].message.content;
    res.json({ reply: botReply });

  } catch (error) {
    console.error('❌ OpenAI API error:', error.response?.data || error.message);
    res.status(500).json({ error: 'ChatGPT API error' });
  }
});

app.get('/', (req, res) => {
  res.send('✅ ChatB AI sunucusu çalışıyor.');
});

app.listen(port, () => {
  console.log(`🚀 Sunucu çalışıyor: http://localhost:${port} veya Render için`);
});
