const axios = require('axios')

module.exports = async () => {
    let word;
    await axios
      .get("https://pastebin.com/raw/PWzrALuP")
      .then(async (response) => {
        const wordsText = await response.data;

        // Split the text into an array of words
        const wordsArray = await wordsText
          .replace(/\r/g, "")
          .trim()
          .split("\n");
        const wordCount = await wordsArray.length;
        word = await wordsArray[Math.floor(Math.random() * wordCount)];
      });
    return word;
};
