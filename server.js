const express = require("express");
const axios = require("axios");
const app = express();
const port = process.env.PORT || 3000;

require("dotenv").config(); // .env desteği

app.use(express.json());

app.get("/", (req, res) => {
  res.send("✅ API aktif, çalışıyor!");
});

app.post("/chat", async (req, res) => {
  const userMessage = req.body.message;

  console.log("🟡 Gelen istek:", userMessage); // Gelen mesajı kontrol et

  try {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: userMessage }],
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
      }
    );

    const botReply = response.data.choices[0].message.content;
    console.log("🟢 Cevap:", botReply);
    res.json({ reply: botReply });
  } catch (error) {
    console.error("🔴 OpenAI API hatası:", error.response?.data || error.message);
    res.status(500).json({ error: "ChatGPT API hatası" });
  }
});

app.listen(port, () => {
  console.log(`✅ Server çalışıyor: http://localhost:${port}`);
});
