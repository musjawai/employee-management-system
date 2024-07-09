const fs = require("fs");
const path = require("path");

fs.readFile("./files/starter.txt", "utf8", (err, data) => {
  if (err) throw err;
  console.log(data);
});

fs.writeFile(
  path.join(__dirname, "files", "write.txt"),
  "Hello World!",
  (err) => {
    if (err) throw err;
    console.log("Write complete!");
  }
);

console.log("Hello...");

process.on("uncaughtException", (err) => {
  console.log(err.name, err.message);
  process.exit(1);
});
