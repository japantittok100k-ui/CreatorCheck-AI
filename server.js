const http = require("http");

const server = http.createServer((req, res) => {

  // =========================
  // CORS
  // =========================

  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "*"
  );

  // =========================
  // OPTIONS / Preflight
  // =========================

  if (req.method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
  }

  // =========================
  // HOME / HEALTH CHECK
  // =========================

  if (req.method === "GET" && req.url === "/") {

    res.writeHead(200, {
      "Content-Type":
        "application/json; charset=utf-8"
    });

    res.end(JSON.stringify({

      success: true,

      message:
        "CreatorCheck AI Backend အလုပ်လုပ်နေပါပြီ။",

      status:
        "online"

    }));

    return;
  }

  // =========================
  // ANALYZE API
  // =========================

  if (
    req.method === "POST" &&
    req.url === "/analyze"
  ) {

    let body = "";

    req.on("data", (chunk) => {

      body += chunk.toString();

    });

    req.on("end", () => {

      console.log(
        "Analyze request received"
      );

      // =========================
      // Detect Platform
      // =========================

      let platform =
        "Unknown";

      const isYouTube =
        body.includes("youtube.com") ||
        body.includes("youtu.be");

      const isTikTok =
        body.includes("tiktok.com");

      if (isYouTube) {

        platform =
          "YouTube";

      } else if (isTikTok) {

        platform =
          "TikTok";

      } else if (body.length > 0) {

        platform =
          "Uploaded Video";

      }

      // =========================
      // Default Result
      // =========================

      let monetization =
        "အလယ်အလတ်အန္တရာယ်ရှိနိုင်ပါသည်။ မူရင်းအကြောင်းအရာနှင့် ကိုယ်ပိုင် Commentary ပိုမိုထည့်သွင်းရန် အကြံပြုပါသည်။";

      let copyright =
        "မူပိုင်ခွင့်နှင့်ပတ်သက်သော စိုးရိမ်စရာအချက်အချို့ ရှိနိုင်ပါသည်။ အသုံးပြုခွင့်နှင့် ပိုင်ဆိုင်ခွင့်များကို ထပ်မံစစ်ဆေးပါ။";

      let reusedContent =
        "Reused Content ဖြစ်နိုင်ခြေကို တိတိကျကျစစ်ဆေးရန် Video Content ကို အမှန်တကယ်ခွဲခြမ်းစိတ်ဖြာရန် လိုအပ်ပါသည်။";

      let recommendation =
        "ကိုယ်ပိုင် Voice-over၊ Commentary၊ Analysis၊ Editing နှင့် Storytelling များ ထည့်သွင်းပြီး မူရင်းတန်ဖိုးရှိသော Content အဖြစ် ဖန်တီးရန် အကြံပြုပါသည်။";

      // =========================
      // YouTube Analysis
      // =========================

      if (platform === "YouTube") {

        monetization =
          "YouTube Monetization အတွက် မူရင်းတန်ဖိုးရှိသော Content၊ ကိုယ်ပိုင် Commentary နှင့် အဓိပ္ပာယ်ရှိသော ပြောင်းလဲဖန်တီးမှုများ ထည့်သွင်းထားရန် အရေးကြီးပါသည်။";

        copyright =
          "YouTube Video ဖြစ်သောကြောင့် မူရင်းဖန်တီးသူ၏ Video၊ Music၊ Image သို့မဟုတ် Clip များကို အသုံးပြုထားပါက Copyright Risk ရှိနိုင်ပါသည်။";

        reusedContent =
          "အခြားသူ၏ YouTube Video ကို အဓိကထားပြီး ပြန်လည်အသုံးပြုထားပါက Reused Content Risk ရှိနိုင်ပါသည်။";

        recommendation =
          "ကိုယ်ပိုင် Voice-over၊ Commentary၊ Analysis နှင့် Storytelling ထည့်ပါ။ Video ကို ရိုးရိုးပြန်တင်ခြင်းထက် အဓိပ္ပာယ်ရှိသော ပြောင်းလဲဖန်တီးမှု ပြုလုပ်ပါ။";

      }

      // =========================
      // TikTok Analysis
      // =========================

      if (platform === "TikTok") {

        monetization =
          "TikTok Monetization အတွက် မူရင်းဖန်တီးမှုနှင့် ကိုယ်ပိုင်တန်ဖိုးရှိသော Content ဖြစ်ရန် အရေးကြီးပါသည်။ အခြားသူ၏ Video ကို ပြန်တင်ခြင်းသည် Risk ရှိနိုင်ပါသည်။";

        copyright =
          "TikTok Video တွင် အသုံးပြုထားသော Music၊ Video Clip၊ Image နှင့် Third-party Content များအပေါ် မူပိုင်ခွင့်အန္တရာယ် ရှိနိုင်ပါသည်။";

        reusedContent =
          "အခြားသူ၏ TikTok Video ကို Download ပြုလုပ်ပြီး ပြန်လည်တင်ထားပါက Reused Content Risk မြင့်နိုင်ပါသည်။";

        recommendation =
          "ကိုယ်ပိုင် Video၊ Voice-over၊ Commentary နှင့် Storytelling ထည့်သွင်းပြီး မူရင်းတန်ဖိုးရှိသော Content အဖြစ် ဖန်တီးပါ။";

      }

      // =========================
      // Uploaded Video Analysis
      // =========================

      if (platform === "Uploaded Video") {

        monetization =
          "Uploaded Video အတွက် မူရင်းအကြောင်းအရာ၊ ကိုယ်ပိုင်ဖန်တီးမှုနှင့် တန်ဖိုးရှိသော Commentary များ ပါဝင်ပါက Monetization အတွက် ပိုမိုကောင်းမွန်နိုင်ပါသည်။";

        copyright =
          "Video File အတွင်းပါဝင်သော Music၊ Image၊ Clip နှင့် Third-party Content များအတွက် Copyright Risk ရှိနိုင်ပါသည်။";

        reusedContent =
          "Video ကို တကယ်တမ်း Frame-by-Frame ခွဲခြမ်းစိတ်ဖြာခြင်း မပြုလုပ်ရသေးသောကြောင့် Reused Content ကို အတည်ပြုမပေးနိုင်သေးပါ။";

        recommendation =
          "ကိုယ်ပိုင် Voice-over၊ Commentary၊ Analysis နှင့် Storytelling ထည့်သွင်းပြီး မူရင်းတန်ဖိုးရှိသော Content ဖြစ်အောင် ပြင်ဆင်ပါ။";

      }

      // =========================
      // Final Result
      // =========================

      const result = {

        success: true,

        platform: platform,

        monetization:
          monetization,

        copyright:
          copyright,

        reusedContent:
          reusedContent,

        recommendation:
          recommendation,

        notice:
          "ဤရလဒ်သည် Demo AI Risk Assessment ဖြစ်ပါသည်။ တကယ့် Monetization အတည်ပြုချက် သို့မဟုတ် Copyright စစ်ဆေးမှုကို အာမခံပေးခြင်း မရှိပါ။"

      };

      // =========================
      // Send JSON
      // =========================
