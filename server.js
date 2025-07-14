const express = require("express");
const cors = require("cors");
const { Configuration, OpenAIApi } = require("openai");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// OpenAI ayarları
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_ANAHTAR,
});
const openai = new OpenAIApi(configuration);

// Sağlık kontrolü
app.get("/", (req, res) => {
  res.send("✅ API aktif, çalışıyor!");
});

// Chat endpoint
app.post("/chat", async (req, res) => {
  const userMessage = req.body.message;
  if (!userMessage) {
    return res.status(400).json({ error: "Mesaj eksik" });
  }

  try {
    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: userMessage }],
    });

    const botResponse = completion.data.choices[0].message.content;
    res.json({ response: botResponse });
  } catch (error) {
    console.error("OpenAI API hatası:", error.response?.data || error.message);
    res.status(500).json({ error: "OpenAI API hatası", detail: error.response?.data || error.message });
  }
});

app.listen(port, () => {
  console.log(`✅ Sunucu çalışıyor: http://localhost:${port}`);
});
