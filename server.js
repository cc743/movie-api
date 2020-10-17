//importing url module at the top of 'server.js' file
const url = require("url"),
  fs = require("fs"),
  http = require("http"); //import http module and...

http
  .createServer((request, response) => {
    let addr = request.url,
      q = url.parse(addr, true),
      filePath = "";

    fs.appendFile(
      "log.txt",
      "URL: " + addr + "\nTimestamp: " + new Date() + "\n\n",
      err => {
        if (err) {
          console.log(err);
        } else {
          console.log("Added to log.");
        }
      }
    );

    if (q.pathname.includes("documentation")) {
      filePath = "documentation.html";
    } else {
      filePath = "index.html";
    }

    fs.readFile(filePath, (err, data) => {
      if (err) {
        throw err;
      }

      response.writeHead(200, { "Content-Type": "text/html" });
      response.write(data);
      response.end();
    });
  })
  .listen(8080); //...listen for requests on port 8080
console.log("My first Node test server is running on Port 8080.");

// let addr = request.url;
// let q = url.parse(addr, true);
//add another comment
// const http = require("http");

// http
//   .createServer((request, response) => {
//     response.writeHead(200, { "Content-Type": "text/plain" });
//     response.end("Hello Node!\n");
//   })
//   .listen(8080);
//
// console.log("My first Node test server is running on Port 8080.");
