const fs = require("fs");
const http = require("http");
const homePage = fs.readFileSync(`${__dirname}/home.html`, "utf-8");
const oneTRPage = fs.readFileSync(`${__dirname}/oneTR.html`, "utf-8");
const data = fs.readFileSync(`../day1/notes.json`, "utf-8");

const DataJson = JSON.parse(data);
const notes = DataJson["notes"];
console.log(DataJson["notes"]);
console.log(typeof DataJson);
const repaceThtml = (oneTR, note) => {
  let output = oneTR.replace(/{%TITLE%}/g, note.title);
  output = output.replace(/{%DESCRIPTION%}/g, note.description);
  output = output.replace(/{%STATUS%}/g, note.status);
  return output;
};
// const cardsHtml = productData
//       .map((el) => replaceTemplete(tempCard, el))
//       .join("");
const server = http.createServer((req, res) => {
  res.writeHead(200, {
    "content-type": "text/html",
  });
  console.log(DataJson.notes);
  const htmlNotes = notes.map((el) => repaceThtml(oneTRPage, el)).join("");
  const output = homePage.replace(" {%NOTES%}", htmlNotes);
  console.log("servre is running");
  console.log(output);
  res.end(output);
});
server.listen(7000, "127.0.0.1", () => {
  // console.log(__dirname);
  console.log("listining to th e server");
});
