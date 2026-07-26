const http = require("http");

const server = http.createServer((req, res) => {

  // CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "*"
  );

  // OPTIONS
  if (req.method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
  }

  // HOME
  if (req.method === "GET" && req.url === "/") {

    res.writeHead(200, {
      "Content-Type": "application/json; charset=utf-8"
    });

    res.end(JSON.stringify({
      success: true,
      message: "CreatorCheck AI Backend အလုပ်လုပ်နေပါပြီ။",
      status: "online"
    }));

    return;
  }

  // ANALYZE
  if (req.method === "POST" && req.url === "/analyze") {

    let body = "";

    req.on("data", (chunk) => {
      body += chunk.toString();
    });

    req.on("end", () => {

      console.log("Analyze request received");

      let platform = "Unknown";

      if (
        body.includes("youtube.com") ||
        body.includes("youtu.be")
      ) {
        platform = "YouTube";
      }

      else if (
        body.includes("tiktok.com")
      ) {
        platform = "TikTok";
      }

      else if (body.length > 0) {
        platform = "Uploaded Video";
      }

      let result = {
        success: true,

        platform: platform,

        monetization:
          "အလယ်အလတ်အန္တရာယ်ရှိနိုင်ပါသည်။ မူရင်းအကြောင်းအရာနှင့် ကိုယ်ပိုင် Commentary ပိုမိုထည့်သွင်းရန် အကြံပြုပါသည်။",

        copyright:
          "မူပိုင်ခွင့်နှင့်ပတ်သက်သော စိုးရိမ်စရာအချက်အချို့ ရှိနိုင်ပါသည်။ အသုံးပြုခွင့်နှင့် ပိုင်ဆိုင်ခွင့်များကို ထပ်မံစစ်ဆေးပါ။",

        reusedContent:
          "Reused Content ဖြစ်နိုင်ခြေကို တိတိကျကျစစ်ဆေးရန် Video Content ကို အမှန်တကယ်ခွဲခြမ်းစိတ်ဖြာရန် လိုအပ်ပါသည်။",

        recommendation:
          "ကိုယ်ပိုင် Voice-over၊ Commentary၊ Analysis၊ Editing နှင့် Storytelling များ ထည့်သွင်းပြီး မူရင်းတန်ဖိုးရှိသော Content အဖြစ် ဖန်တီးရန် အကြံပြုပါသည်။",

        notice:
          "ဤရလဒ်သည် Demo AI Risk Assessment ဖြစ်ပါသည်။ Monetization အတည်ပြုချက် သို့မဟုတ် Copyright ကင်းရှင်းမှုကို အာမခံပေးခြင်း မရှိပါ။"
      };

      // YouTube
      if (platform === "YouTube") {

        result.monetization =
          "YouTube Monetization အတွက် မူရင်းတန်ဖိုးရှိသော Content၊ ကိုယ်ပိုင် Commentary နှင့် အဓိပ္ပာယ်ရှိသော ပြောင်းလဲဖန်တီးမှုများ ထည့်သွင်းထားရန် အရေးကြီးပါသည်။";

        result.copyright =
          "YouTube Video ဖြစ်သောကြောင့် မူရင်းဖန်တီးသူ၏ Video၊ Music၊ Image သို့မဟုတ် Clip များကို အသုံးပြုထားပါက Copyright Risk ရှိနိုင်ပါသည်။";

        result.reusedContent =
          "အခြားသူ၏ YouTube Video ကို အဓိကထားပြီး ပြန်လည်အသုံးပြုထားပါက Reused Content Risk ရှိနိုင်ပါသည်။";

        result.recommendation =
          "ကိုယ်ပိုင် Voice-over၊ Commentary၊ Analysis နှင့် Storytelling ထည့်ပါ။ Video ကို ရိုးရိုးပြန်တင်ခြင်းထက် အဓိပ္ပာယ်ရှိသော ပြောင်းလဲဖန်တီးမှု ပြုလုပ်ပါ။";
      }

      // TikTok
      if (platform === "TikTok") {

        result.monetization =
          "TikTok Monetization အတွက် မူရင်းဖန်တီးမှုနှင့် ကိုယ်ပိုင်တန်ဖိုးရှိသော Content ဖြစ်ရန် အရေးကြီးပါသည်။";

        result.copyright =
          "TikTok Video တွင် အသုံးပြုထားသော Music၊ Video Clip၊ Image နှင့် Third-party Content များအပေါ် မူပိုင်ခွင့်အန္တရာယ် ရှိနိုင်ပါသည်။";

        result.reusedContent =
          "အခြားသူ၏ TikTok Video ကို Download ပြုလုပ်ပြီး ပြန်လည်တင်ထားပါက Reused Content Risk ရှိနိုင်ပါသည်။";

        result.recommendation =
          "ကိုယ်ပိုင် Video၊ Voice-over၊ Commentary နှင့် Storytelling ထည့်သွင်းပြီး မူရင်းတန်ဖိုးရှိသော Content အဖြစ် ဖန်တီးပါ။";
      }

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

// Railway PORT
const PORT = process.env.PORT || 3000;

server.listen(PORT, "0.0.0.0", () => {

  console.log(
    "CreatorCheck AI Backend is running on port " + PORT
  );

});
