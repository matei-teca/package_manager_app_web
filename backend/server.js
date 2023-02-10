const express = require("express");
const fs = require("fs");
const dataRoute = "./pkgs.json";
const path = require("path");
const fileReaderAsync = require("./fileReader");
const fileWriterAsync = require("./fileWriter");

const filePath = path.join(`${__dirname}/pkgs.json`);
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const port = 9002;

app.get("/", (req, res) => {
  res.redirect(301, '/edit/package');
});
app.get(["/edit/package","/edit/package/:id"], (req, res, next) => {
  res.sendFile(path.join(`${__dirname}/../frontend/index.html`));
});
app.use('/public', express.static(`${__dirname}/../frontend/public`));

app.get("/api/package/", async (req, res) => {
  const fileData = JSON.parse(await fileReaderAsync(filePath));
  res.send(JSON.stringify(fileData));
})

app.post("/api/package/", async (req, res) => {
  let data = req.body;
  let fileData = JSON.parse(await fileReaderAsync(filePath));

  data.id = fileData.packages[fileData.packages.length-1].id + 1;
  fileData.packages.push(data);
  fileData = JSON.stringify(fileData, null, 4);

  fileWriterAsync(filePath, fileData);
  res.send({"status" : "DONE"});
})

app.listen(port, _ => console.log(`http://127.0.0.1:${port}`));