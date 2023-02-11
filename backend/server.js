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

  // const fileData = JSON.parse(await fileReaderAsync(filePath));
  // send(JSON.stringify(fileData));
  // send(fileData.packages[req.params.id-1]);
});
app.use('/public', express.static(`${__dirname}/../frontend/public`));

app.get("/api/package", async function(req, res, next){
  const fileData = JSON.parse(await fileReaderAsync(filePath));
  res.send(JSON.stringify(fileData));
})



// app.get("/edit/package", (req, res, next) => {
//   res.sendFile(path.join(`${__dirname}/../frontend/index.html`));
// });



// app.get("/edit/package", function(req, res, next){
//   //middleware 1

//   console.log("middleware 1");
//   next()
// },
// async function(req, res, next){
//   //middleware 2
  
//   console.log("middleware 2");
//   next()
// },
// async function(req, res, next){
//   //middleware 3
  
  // const fileData = JSON.parse(await fileReaderAsync(filePath));
  // send(JSON.stringify(fileData));
// })




// app.use('/public', express.static(`${__dirname}/../frontend/public`));

app.get("/api/package/:id", async (req, res, next) => {
  // const fileData = JSON.parse(await fileReaderAsync(filePath));
  // res.json(fileData.packages[req.params.id-1])

  res.json({"Status": "ok"})
});

// app.get("/edit/package/:id", async (req, res, next) => {
//   const fileData = JSON.parse(await fileReaderAsync(filePath));
//   res.sendFile(path.join(`${__dirname}/../frontend/index.html`));
//   // res.send({"status" : "DONE"});
// });
// app.use('/public', express.static(`${__dirname}/../frontend/public`));

// app.use("/edit/package/", async (req, res, next) => {
//   res.sendFile(path.join(`${__dirname}/../frontend/index.html`));
//   next();
// }, async (req, res, next) => {
//   const fileData = JSON.parse(await fileReaderAsync(filePath));
//   res.send(JSON.stringify(fileData));
//   next();
// }); 


// app.get("/edit/package", function(req, res, next){
//   //middleware 1
//   console.log("works1")
//   res.sendFile(path.join(`${__dirname}/../frontend/index.html`));
//   next()
// },
// async function(req, res, next){
//   //middleware 2
//   console.log("works2")
//   const fileData = JSON.parse(await fileReaderAsync(filePath));
//   console.log("works2" + fileData + "works2")
//   res.send(JSON.stringify(fileData));
// })

// const middleware1 = (req, res, next)=>{
//   res.sendFile(path.join(`${__dirname}/../frontend/index.html`));
//   next()  // pass execution to the next middleware
// }
// const middleware2 = async (req, res, next)=>{
//   const fileData = JSON.parse(await fileReaderAsync(filePath));
//   res.send(JSON.stringify(fileData));
// }

// app.get("/edit/package", middleware1, middleware2);



app.post("/edit/package/", async (req, res) => {
  let data = req.body;
  let fileData = JSON.parse(await fileReaderAsync(filePath));

  data.id = fileData.packages[fileData.packages.length-1].id + 1;
  fileData.packages.push(data);
  fileData = JSON.stringify(fileData, null, 4);

  fileWriterAsync(filePath, fileData);

  res.send({"status" : "DONE"});

})


app.put("/edit/package/:id", async (req, res) => {
  let data = req.body;

  let currId = parseInt(req.params.id);

  // console.log(req.params.id);

  let fileData = JSON.parse(await fileReaderAsync(filePath));
  fileData.packages[currId-1] = data;
  fileData = JSON.stringify(fileData, null, 4);

  fileWriterAsync(filePath, fileData);

  res.send({"status" : "DONEput"});
})

app.listen(port, _ => console.log(`http://127.0.0.1:${port}`));