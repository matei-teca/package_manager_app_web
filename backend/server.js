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

app.get(["/edit/package","/edit/package/:id"], async (req, res, next) => {
  res.sendFile(path.join(`${__dirname}/../frontend/index.html`));
});
app.use('/public', express.static(`${__dirname}/../frontend/public`));

app.get("/api/package", async function(req, res, next){
  const fileData = JSON.parse(await fileReaderAsync(filePath));
  res.send(JSON.stringify(fileData));
})

app.get("/api/package/:id", async (req, res, next) => {
  // res.json({"Status": "ok AICI ar trebui sa primesc obiectul pachetului"})

  const fileData = JSON.parse(await fileReaderAsync(filePath));
  res.send(fileData.packages[req.params.id-1])
});


app.post("/edit/package/", async (req, res) => {
  let data = req.body;
  let fileData = JSON.parse(await fileReaderAsync(filePath));

  data.id = fileData.packages[fileData.packages.length-1].id + 1;
  fileData.packages.push(data);
  fileData = JSON.stringify(fileData, null, 4);

  fileWriterAsync(filePath, fileData);

  res.send({"status" : "DONEpost"});

})

app.put("/edit/package/:id", async (req, res) => {
  let data = req.body;

  let currId = parseInt(req.params.id);

  let fileData = JSON.parse(await fileReaderAsync(filePath));
  fileData.packages[currId-1] = data;
  fileData = JSON.stringify(fileData, null, 4);

  fileWriterAsync(filePath, fileData);

  res.send({"status" : "DONEput"});
})

app.delete("/delete/package/:id", async (req, res) => {

  let fileData = JSON.parse(await fileReaderAsync(filePath));
  fileData.packages.splice([req.params.id]-1, 1);
  fileData = JSON.stringify(fileData, null, 4);

  fileWriterAsync(filePath, fileData);

  res.send({"status" : "DONE delete"});

})

app.listen(port, _ => console.log(`http://127.0.0.1:${port}`));