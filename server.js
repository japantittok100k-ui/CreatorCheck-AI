const http = require("http");

const PORT = process.env.PORT || 3000;

const server = http.createServer((req, res) => {

  // CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "*");

  // OPTIONS
  if (req.method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
  }

  // HOME / HEALTH CHECK
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

  // ANALYZE API
  if (req.method === "POST" && req.url === "/analyze") {

    let body = "";

    req.on("data", (chunk) => {
      body += chunk.toString();
    });

    req.on("end", () => {

      console.log("Analyze request received");

      let videoLink = "";

      try {
        if (body) {
          const params = new URLSearchParams(body);
          videoLink = params.get("videoLink") || "";
        }
      } catch (error) {
        console.log("Request data could not be read");
      }

      const result = {
        success: true,

        videoLink: videoLink,

        monetization:
          "YouTube Monetization အတွက် မူရင်းတန်ဖိုးရှိသော Content၊ ကိုယ်ပိုင် Commentary နှင့် အဓိပ္ပာယ်ရှိသော ပြောင်းလဲဖန်တီးမှုများ ထည့်သွင်းထားရန် အရေးကြီးပါသည်။",

        copyright:
          "မူရင်းဖန်တီးသူ၏ Video၊ Music၊ Image သို့မဟုတ် Clip များကို အသုံးပြုထားပါက Copyright Risk ရှိနိုင်ပါသည်။",

        reusedContent:
          "အခြားသူ၏ Video ကို အဓိကထားပြီး ပြန်လည်အသုံးပြုထားပါက Reused Content Risk ရှိနိုင်ပါသည်။",

        recommendation:
          "ကိုယ်ပိုင် Voice-over၊ Commentary၊ Analysis နှင့် Storytelling ထည့်ပါ။ Video ကို ရိုးရိုးပြန်တင်ခြင်းထက် အဓိပ္ပာယ်ရှိသော ပြောင်းလဲဖန်တီးမှု ပြုလုပ်ပါ။"
      };

      res.writeHead(200, {
        "Content-Type": "application/json; charset=utf-8"
      });

      res.end(JSON.stringify(result));
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

server.listen(PORT, "0.0.0.0", () => {
  console.log(
    "CreatorCheck AI Backend is running on port " + PORT
  );
});
