const http = require("http");

const server = http.createServer((req, res) => {

  // CORS ခွင့်ပြုခြင်း
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Browser Preflight Request
  if (req.method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
  }

  // Homepage / Health Check
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

  // Video Analyze API
  if (req.method === "POST" && req.url === "/analyze") {

    let body = "";

    req.on("data", (chunk) => {
      body += chunk.toString();
    });

    req.on("end", () => {

      console.log("Analyze request received");

      // Demo AI Result
      const result = {

        success: true,

        monetization:
          "အလယ်အလတ်အန္တရာယ်ရှိနိုင်ပါသည်။ မူရင်းအကြောင်းအရာနှင့် ကိုယ်ပိုင် Commentary ပိုမိုထည့်သွင်းရန် အကြံပြုပါသည်။",

        copyright:
          "မူပိုင်ခွင့်နှင့်ပတ်သက်သော စိုးရိမ်စရာအချက်အချို့ ရှိနိုင်ပါသည်။ အသုံးပြုခွင့်နှင့် ပိုင်ဆိုင်ခွင့်များကို ထပ်မံစစ်ဆေးပါ။",

        reusedContent:
          "Reused Content ဖြစ်နိုင်ခြေကို တိတိကျကျစစ်ဆေးရန် Video Content ကို အမှန်တကယ်ခွဲခြမ်းစိတ်ဖြာရန် လိုအပ်ပါသည်။",

        recommendation:
          "ကိုယ်ပိုင် Voice-over၊ Commentary၊ Analysis၊ Editing နှင့် Storytelling များ ထည့်သွင်းပြီး မူရင်းတန်ဖိုးရှိသော Content အဖြစ် ဖန်တီးရန် အကြံပြုပါသည်။"

      };

      res.writeHead(200, {
        "Content-Type": "application/json; charset=utf-8"
      });

      res.end(JSON.stringify(result));

    });

    return;
  }

  // API မတွေ့ရင်
  res.writeHead(404, {
    "Content-Type": "application/json; charset=utf-8"
  });

  res.end(JSON.stringify({
    success: false,
    message: "API လမ်းကြောင်း မတွေ့ပါ။"
  }));

});


// Railway က သတ်မှတ်ပေးတဲ့ PORT ကို အသုံးပြုမယ်
const PORT = process.env.PORT || 3000;

server.listen(PORT, "0.0.0.0", () => {

  console.log(
    `CreatorCheck AI Backend is running on port ${PORT}`
  );

});
