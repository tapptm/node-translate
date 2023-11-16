const express = require("express");
const cors = require("cors");
const app = express();
const { checkFileReturn, translateFromList, saveLangFile } = require("./scripts");

const port = 4598;

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  console.log(`[LOG] ${new Date().toLocaleString()} ${req.path} ${req.ip}`);
  next();
});

app.post("/translate", async (req, res) => {
  res.set({ "Content-Length": 100 });

  console.log(`[LOG] ${new Date().toLocaleString()} ${JSON.stringify(req.body)}`);
  const { words, to } = req.body;

  await checkFileReturn(to, res);

  console.log("translate..");
  const translated = await translateFromList(words, to);
  console.log("saving..");
  await saveLangFile(to, translated);

  res.end();
});

app.listen(port, () => {
  console.log(`app listening on port ${port}`);
});
