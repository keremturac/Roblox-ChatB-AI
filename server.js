const express = require('express');
const cors = require('cors');
const { Configuration, OpenAIApi } = require('openai');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_ANAHTAR,
});
const openai = new OpenAIApi(configuration);

app.get('/', (req, res) => {
  res.send('✅ API aktif, çalışıyor!');
});

app.post('/chat', async (req, res) => {
  const userMessage = req.body.message;
  console.log("Gelen istek:", userMessage);

  try {
    const completion = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: userMessage }],
    });

    const botReply = completion.data.choices[0].message.content;
    res.json({ reply: botReply });
  } catch (error) {
    console.error("OpenAI API hatası:", error.response ? error.response.data : error.message);
    res.status(500).json({ error: 'Sunucu hatası: OpenAI isteği başarısız' });
  }
});

app.listen(port, () => {
  console.log(`✅ Sunucu çalışıyor: http://localhost:${port}`);
});
