const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "CaatoAI backend is running 💜",
  });
});

app.post("/api/speech", async (req, res) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({
        error: "Text is required",
      });
    }

    const speechKey = process.env.AZURE_SPEECH_KEY;
    const speechRegion = process.env.AZURE_SPEECH_REGION;

    if (!speechKey || !speechRegion) {
      return res.status(500).json({
        error: "Azure Speech configuration is missing",
      });
    }

    const ssml = `
      <speak version="1.0" xml:lang="so-SO">
        <voice xml:lang="so-SO" name="so-SO-UbaxNeural">
          ${text}
        </voice>
      </speak>
    `;

    const response = await fetch(
      `https://${speechRegion}.tts.speech.microsoft.com/cognitiveservices/v1`,
      {
        method: "POST",
        headers: {
          "Ocp-Apim-Subscription-Key": speechKey,
          "Content-Type": "application/ssml+xml",
          "X-Microsoft-OutputFormat": "audio-24khz-48kbitrate-mono-mp3",
          "User-Agent": "CaatoAI",
        },
        body: ssml,
      },
    );

    if (!response.ok) {
      const errorText = await response.text();

      console.error("Azure Speech error:", errorText);

      return res.status(response.status).json({
        error: "Azure Speech request failed",
      });
    }

    const audioBuffer = Buffer.from(await response.arrayBuffer());

    res.set({
      "Content-Type": "audio/mpeg",
      "Content-Length": audioBuffer.length,
    });

    res.send(audioBuffer);
  } catch (error) {
    console.error("Speech route error:", error);

    res.status(500).json({
      error: "Could not generate speech",
    });
  }
});

app.get("/api/speech", async (req, res) => {
  try {
    const text = req.query.text;

    if (!text || typeof text !== "string") {
      return res.status(400).json({
        error: "Text is required",
      });
    }

    const speechKey = process.env.AZURE_SPEECH_KEY;
    const speechRegion = process.env.AZURE_SPEECH_REGION;

    if (!speechKey || !speechRegion) {
      return res.status(500).json({
        error: "Azure Speech configuration is missing",
      });
    }

    const safeText = text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&apos;");

    const ssml = `
      <speak version="1.0" xml:lang="so-SO">
        <voice xml:lang="so-SO" name="so-SO-UbaxNeural">
          ${safeText}
        </voice>
      </speak>
    `;

    const response = await fetch(
      `https://${speechRegion}.tts.speech.microsoft.com/cognitiveservices/v1`,
      {
        method: "POST",
        headers: {
          "Ocp-Apim-Subscription-Key": speechKey,
          "Content-Type": "application/ssml+xml",
          "X-Microsoft-OutputFormat": "audio-24khz-48kbitrate-mono-mp3",
          "User-Agent": "CaatoAI",
        },
        body: ssml,
      },
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Azure Speech error:", errorText);

      return res.status(response.status).json({
        error: "Azure Speech request failed",
      });
    }

    const audioBuffer = Buffer.from(await response.arrayBuffer());

    res.set({
      "Content-Type": "audio/mpeg",
      "Content-Length": audioBuffer.length,
      "Cache-Control": "no-store",
    });

    res.send(audioBuffer);
  } catch (error) {
    console.error("Speech GET route error:", error);

    res.status(500).json({
      error: "Could not generate speech",
    });
  }
});

const PORT = 3001;

app.listen(PORT, () => {
  console.log(`CaatoAI backend running on http://localhost:${PORT}`);
});
