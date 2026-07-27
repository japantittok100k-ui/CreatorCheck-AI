const http = require("http");
const OpenAI = require("openai");

const PORT = process.env.PORT || 3000;

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

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
      message: "CreatorCheck AI Backend Online"
    }));

    return;
  }


  if (req.method === "POST" && req.url === "/analyze") {

    let body = "";

    req.on("data", chunk => {
      body += chunk.toString();
    });


    req.on("end", async () => {

      let videoLink = "";

      try {

        const params = new URLSearchParams(body);
        videoLink = params.get("videoLink") || "";

        const ai = await client.chat.completions.create({

          model: "gpt-4o-mini",

          messages: [
            {
              role: "system",
              content:
              "You are CreatorCheck AI. Analyze videos for monetization risk, copyright risk and reused content risk."
            },

            {
              role: "user",
              content:
              `Analyze this video link:
              ${videoLink}

              Return JSON with:
              monetization,
              copyright,
              reusedContent,
              recommendation`
            }
          ],

          response_format: {
            type: "json_object"
          }

        });


        const result = JSON.parse(
          ai.choices[0].message.content
        );


        res.writeHead(200, {
          "Content-Type":
          "application/json; charset=utf-8"
        });


        res.end(JSON.stringify({
          success: true,
          ...result
        }));


      } catch(error) {

        console.log(error);


        res.writeHead(500, {
          "Content-Type":
          "application/json; charset=utf-8"
        });


        res.end(JSON.stringify({

          success:false,

          error:
          "AI Analysis Error"

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
 "CreatorCheck AI Backend running on "+PORT
 );

});
