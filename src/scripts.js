const { lstat, writeFile } = require("fs/promises");
const translate = require("translate-google");

async function checkFileReturn(lang, res) {
  const stat = await lstat(`./src/lang/${lang}.json`);
  if (stat.isFile() === true) {
    res.sendFile(`./lang/${lang}.json`, { root: __dirname });
  }
}

async function saveLangFile(lang, fileData) {
  await writeFile(`./src/lang/${lang}.json`, JSON.stringify(fileData));
  return;
}

async function translateFromList(words, lang) {
  const langFile = require(`./lang/${lang}.json`);
  const langLocal = Object.keys(langFile);
  const newWords = words.filter((el) => !langLocal.includes(el.replace(/ /g, "_")));
  console.log("new_words", newWords);
  if (newWords.length) {
    console.log("found new word");
    const translated = await Promise.all(
      newWords.map(async (word, i) => {
        console.log(i + " " + newWords.length);
        const newMsg = await translate(word, { from: "auto", to: lang });
        return {
          [word.replace(/ /g, "_")]: newMsg,
        };
      })
    );
    const translatedObj = translated.reduce((acc, obj) => {
      const key = Object.keys(obj)[0];
      acc[key] = Object.values(obj)[0];
      return acc;
    }, {});
    const combinedLangFile = { ...langFile, ...translatedObj };
    return combinedLangFile;
  }
  return langFile;
}

module.exports = {
  checkFileReturn,
  saveLangFile,
  translateFromList,
};
