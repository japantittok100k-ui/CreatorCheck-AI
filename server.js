const http = require("http");

const PORT = process.env.PORT || 3000;

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

const server = http.createServer((req, res) => {

  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "*");

  if (req.method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
  }


  if (req.method === "GET" && req.url === "/") {

    res.writeHead(200, {
      "Content-Type": "application/json; charset=utf-8"
    });

    res.end(JSON.stringify({
      success: true,
      message: "CreatorCheck AI Gemini Backend Online"
    }));

    return;
  }


  if (req.method === "POST" && req.url === "/analyze") {

    let body = "";

    req.on("data", chunk => {
      body += chunk.toString();
    });


    req.on("end", async () => {

      try {

        const params = new URLSearchParams(body);
        const videoLink = params.get("videoLink") || "";


        const prompt = `
You are CreatorCheck AI.

Analyze this video link:
${videoLink}

Return JSON only:

{
 "monetization":"",
 "copyright":"",
 "reusedContent":"",
 "recommendation":""
}
`;


        const response = await fetch(
          "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" + GEMINI_API_KEY,
          {
            method: "POST",
            headers:{
              "Content-Type":"application/json"
            },
            body: JSON.stringify({
              contents:[
                {
                  parts:[
                    {
                      text: prompt
                    }
                  ]
                }
              ]
            })
          }
        );


        const data = await response.json();


        if (!data.candidates) {
  console.log(data);

  res.writeHead(200,{
    "Content-Type":"application/json; charset=utf-8"
  });

  res.end(JSON.stringify({
    success:false,
    error:"Gemini response မရပါ",
    details:data
  }));

  return;
}

let aiText =
  data.candidates[0].content.parts[0].text;


// JSON အဖြစ် ပြောင်းကြည့်မယ်
let result;

try {
  result = JSON.parse(
    aiText.replace(/```json/g, "")
          .replace(/```/g, "")
          .trim()
  );
} catch (e) {

  result = {
    monetization: aiText,
    copyright: "Gemini မှ ပြန်လာသော Analysis ကို ဖတ်ရန် လိုအပ်ပါသည်။",
    reusedContent: "AI Analysis ပြီးပါပြီ။",
    recommendation: "ကိုယ်ပိုင် Voice-over နှင့် Original Editing ထည့်ပါ။"
  };

}


res.writeHead(200,{
  "Content-Type":"application/json; charset=utf-8"
});


res.end(JSON.stringify({
  success: true,
  monetization: result.monetization || "AI မရသေးပါ",
  copyright: result.copyright || "AI မရသေးပါ",
  reusedContent: result.reusedContent || "AI မရသေးပါ",
  recommendation: result.recommendation || "Commentary ထည့်ပါ"
}));


        res.writeHead(200,{
          "Content-Type":"application/json; charset=utf-8"
        });


        res.end(text);


      } catch(error){

        console.log(error);

        res.writeHead(500,{
          "Content-Type":"application/json; charset=utf-8"
        });

        res.end(JSON.stringify({
          success:false,
          error:"Gemini AI Error"
        }));

      }

    });

    return;

  }


  res.writeHead(404);
  res.end();

});


server.listen(PORT,"0.0.0.0",()=>{

 console.log(
 "CreatorCheck AI Gemini Backend running on " + PORT
 );

});
