const http = require("http");

const server = http.createServer((req, res) => {

  // CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // OPTIONS
  if (req.method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
  }

  // Health Check
  if (req.method === "GET" && req.url === "/") {

    res.writeHead(200, {
      "Content-Type": "application/json; charset=utf-8"
    });

    res.end(JSON.stringify({
      success: true,
      message: "CreatorCheck AI Backend အလုပ်လုပ်နေပါပြီ။"
    }));

    return;
  }

  // AI Analyze API
  if (req.method === "POST" && req.url === "/analyze") {

    let body = "";

    req.on("data", (chunk) => {
      body += chunk.toString();
    });

    req.on("end", async () => {

      try {

        // Frontend က ပို့လာတဲ့ Data
        let videoLink = "";

        try {
          const params = new URLSearchParams(body);
          videoLink = params.get("videoLink") || "";
        } catch (e) {
          videoLink = "";
        }

        // OpenAI API Key
        const apiKey = process.env.OPENAI_API_KEY;

        // API Key မရှိရင်
        if (!apiKey) {

          res.writeHead(500, {
            "Content-Type": "application/json; charset=utf-8"
          });

          res.end(JSON.stringify({
            success: false,
            message: "OPENAI_API_KEY မတွေ့ပါ။ Railway Variables ကို စစ်ဆေးပါ။"
          }));

          return;
        }

        // AI ကို ပို့မယ့် Prompt
        const prompt = `
You are CreatorCheck AI.

Analyze this creator video link:

${videoLink || "No video link provided"}

Give a cautious risk assessment for:
1. Monetization potential
2. Copyright risk
3. Reused content risk
4. Originality
5. Recommendations for editing

Important:
- Do not claim certainty.
- Do not claim that copyright is legally cleared.
- Do not guarantee monetization approval.
- Clearly say this is an AI risk assessment.

Return JSON only in this format:

{
  "monetization": "...",
  "copyright": "...",
  "reusedContent": "...",
  "originality": "...",
  "recommendation": "..."
}
`;

        // OpenAI API Request
        const response = await fetch(
          "https://api.openai.com/v1/responses",
          {
            method: "POST",

            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${apiKey}`
            },

            body: JSON.stringify({
              model: "gpt-4.1-mini",
              input: prompt
            })
          }
        );

        if (!response.ok) {

          const errorText = await response.text();

          console.error("OpenAI Error:", errorText);

          res.writeHead(500, {
            "Content-Type": "application/json; charset=utf-8"
          });

          res.end(JSON.stringify({
            success: false,
            message: "AI Server Error ဖြစ်နေပါသည်။"
          }));

          return;
        }

        const data = await response.json();

        // AI Text ရယူခြင်း
        const aiText =
          data.output_text ||
          "AI ရလဒ် မရရှိသေးပါ။";

        // JSON ပြန်ဖတ်ရန်
        let aiResult;

        try {

          aiResult = JSON.parse(aiText);

        } catch (e) {

          aiResult = {
            monetization: aiText,
            copyright: "AI မှ အသေးစိတ် Copyright Risk မရရှိသေးပါ။",
            reusedContent: "AI မှ Reused Content Risk မရရှိသေးပါ။",
            originality: "AI မှ Originality Analysis မရရှိသေးပါ။",
            recommendation: "ကိုယ်ပိုင် Commentary၊ Voice-over နှင့် Editing ထည့်သွင်းရန် အကြံပြုပါသည်။"
          };

        }

        // Frontend ကို Result ပြန်ပို့
        res.writeHead(200, {
          "Content-Type": "application/json; charset=utf-8"
        });

        res.end(JSON.stringify({
          success: true,
          monetization: aiResult.monetization,
          copyright: aiResult.copyright,
          reusedContent: aiResult.reusedContent,
          originality: aiResult.originality,
          recommendation: aiResult.recommendation
        }));

      } catch (error) {

        console.error(error);

        res.writeHead(500, {
          "Content-Type": "application/json; charset=utf-8"
        });

        res.end(JSON.stringify({
          success: false,
          message: "AI Analysis ပြုလုပ်ရာတွင် အမှားတစ်ခု ဖြစ်ပေါ်ခဲ့ပါသည်။"
        }));

      }

    });

    return;
  }

  // 404
  res.writeHead(404, {
    "Content-Type": "application/json; charset=utf-8"
  });

  res.end(JSON.stringify({
    success: false,
    message: "API လမ်းကြောင်း မတွေ့ပါ။"
  }));

});


// Railway PORT
const PORT = process.env.PORT || 3000;

server.listen(PORT, "0.0.0.0", () => {

  console.log(
    `CreatorCheck AI Backend is running on port ${PORT}`
  );

});
