const http = require("http");

const server = http.createServer((req, res) => {

  res.writeHead(200, {
    "Content-Type": "application/json"
  });

  res.end(JSON.stringify({
    success: true,
    message: "CreatorCheck AI Backend အလုပ်လုပ်နေပါပြီ။"
  }));

});

const PORT = 3000;

server.listen(PORT, () => {

  console.log(
    `CreatorCheck AI Backend is running on port ${PORT}`
  );

});