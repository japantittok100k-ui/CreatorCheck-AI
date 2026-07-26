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

  // Preflight
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
      "Content-Type": "application/json; charset=utf-8"
    });

    res.end(JSON.stringify({
      success: true,
      message: "CreatorCheck AI Backend အလုပ်လုပ်နေပါပြီ။",
      status: "online"
    }));

    return;
  }

  // =========================
  // ANALYZE API
  // =========================

  if (req.method === "POST" && req.url === "/analyze") {

    let body = "";

    req.on("data", (chunk) => {
      body += chunk.toString();
    });

    req.on("end", () => {

      console.log("Analyze request received");

      // Platform စစ်ခြင်း
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

      // Default Scores
      let monetizationScore = 60;
      let copyrightScore = 50;
      let originalityScore = 50;

      // YouTube Score
      if (platform === "YouTube") {
        monetizationScore = 65;
        copyrightScore = 55;
        originalityScore = 50;
      }

      // TikTok Score
      if (platform === "TikTok") {
        monetizationScore = 60;
        copyrightScore = 55;
        originalityScore = 50;
      }

      // Uploaded Video Score
      if (platform === "Uploaded Video") {
        monetizationScore = 70;
        copyrightScore = 45;
        originalityScore = 60;
      }

      // =========================
      // Analysis Text
      // =========================

      let monetization = "";

      if (monetizationScore >= 70) {

        monetization =
          "ငွေရှာနိုင်ရန် အလားအလာကောင်းနိုင်ပါသည်။ သို့သော် မူရင်းအကြောင်းအရာ၊ ကိုယ်ပိုင် Commentary နှင့် တန်ဖိုးရှိသော ပြောင်းလဲဖန်တီးမှုများ ရှိရန်လိုအပ်ပါသည်။";

      }

      else if (monetizationScore >= 50) {

        monetization =
          "အလယ်အလတ်အန္တရာယ်ရှိနိုင်ပါသည်။ မူရင်းအကြောင်းအရာနှင့် ကိုယ်ပိုင် Commentary ပိုမိုထည့်သွင်းရန် အကြံပြုပါသည်။";

      }

      else {

        monetization =
          "ငွေရှာနိုင်ရန် အန္တရာယ်ပိုများနိုင်ပါသည်။ ကိုယ်ပိုင်တန်ဖိုးရှိသော Content နှင့် မူရင်းဖန်တီးမှုများ ပိုမိုထည့်သွင်းရန် အကြံပြုပါသည်။";

      }

      // Copyright
      let copyright = "";

      if (copyrightScore >= 70) {

        copyright =
          "Copyright Risk မြင့်နိုင်ပါသည်။ Video၊ Music၊ Image နှင့် Clip များ၏ အသုံးပြုခွင့်ကို စစ်ဆေးပါ။";

      }

      else if (copyrightScore >= 50) {

        copyright =
          "မူပိုင်ခွင့်နှင့်ပတ်သက်သော စိုးရိမ်စရာအချက်အချို့ ရှိနိုင်ပါသည်။
