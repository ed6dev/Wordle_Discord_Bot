const {
  SlashCommandBuilder,
  Collection,
  time,
  EmbedBuilder,
} = require("discord.js");

const getRandomWord = require("../Utils/getRandomWord");

const used = new Collection();

const Profile = require("../Utils/Schema");

const isEnglishWord = require("../Utils/isEnglishWord");

const buttons = require("../Utils/buttons");

const checkGuess = require('../Utils/checkGuess')

function getRandomString(stringsArray) {
  const randomIndex = Math.floor(Math.random() * stringsArray.length);
  return stringsArray[randomIndex];
}

const s = "Secondary";
const g = "Success";
const b = "Primary";

module.exports = {
  data: new SlashCommandBuilder()
    .setName("start")
    .setDescription("Start A Wordle Game!"),

  run: async ({ interaction, client }) => {
    const userId = interaction.member.user.id;
    await interaction.deferReply();
    if (used.has(userId)) {
      await interaction.editReply({
        content: "**You Already Have A Game Running Finish It First**",
        ephemeral: true,
      });
      return;
    }
    let randomWord = await getRandomWord();
    randomWord = randomWord.toLocaleLowerCase()
    console.log(randomWord)
    const dite = new Date();
    dite.setTime(dite.getTime() + 10 * 60 * 1000); // Adding 1 minute (60 seconds * 1000 milliseconds)
    const relative = time(dite, "R");
    const embed = new EmbedBuilder()
      .setTitle("Welcome To Discord Wordle")
      .setDescription(
        `> **Objectif**\n- You Have To Guess The 5 Letters Word\n> **How To?**\n- You Have **5** Tries & **10** Minutes\n- To Submit A Word Type It Bellow Like This : "**!**hello"\n- Type "$stop" to close the game\n> **Info**\n- :black_large_square: : The Letter Is Not In The Word\n- :blue_square: : The Letter Is In The Word But Not The Right Place\n- :green_square: : The Letter Is In The Right Spot\n> **Game Gonna End ${relative}**`
      )
      .setColor("Random")
      .setThumbnail(client.user.avatarURL())
      .setTimestamp();
    await interaction.editReply({ embeds: [embed] }).then(async () => {
      const query = {
        userId: userId,
      };
      try {
        const data = await Profile.findOne(query);

        if (data) {
          data.GamesPlayed++;

          await data.save().catch((e) => {
            console.log(`Error saving updated data ${e}`);
            return;
          });
        } else {
          // create new data
          const newdata = new Profile({
            userId: userId,
            GamesPlayed: 1,
          });
          await newdata.save();
        }
      } catch (error) {
        console.log(`Error giving xp: ${error}`);
      }
      await used.set(userId, 0);
      const bb = [
        { name: "X", style: s },
        { name: "X", style: s },
        { name: "X", style: s },
        { name: "X", style: s },
        { name: "X", style: s },
      ];
      const buttons2 = await buttons(bb);
      const msg = await interaction.channel.send({ components: [buttons2] });
      const startTime = new Date();
      const collectorFilter = (m) => m.author.id === interaction.member.user.id;
      const collector = interaction.channel.createMessageCollector({
        filter: collectorFilter,
      });
      const timer = setTimeout(async () => {
        const gifs = [
          "https://media.tenor.com/p3ACTVx81E4AAAAi/times-up-times-out.gif",
          "https://media.tenor.com/w3sBnfrCAFcAAAAi/hurry-up-stopwatch.gif",
          "https://media.tenor.com/r6UNvUq-_U4AAAAi/what-time-is-it-check-watch.gif",
          "https://media.tenor.com/uJkngcKYyp8AAAAC/clock-times.gif",
          "https://media.tenor.com/OD_4lxiBHA0AAAAC/its-time.gif",
        ];
        const gif = await getRandomString(gifs);
        const bed = new EmbedBuilder()
          .setTitle("Time Is Up!")
          .setDescription(
            `💤 You Failed To Guess The Word **${randomWord.toLocaleUpperCase()}** 💤\n- Time Passed : **\`10\`** Minutes`
          )
          .setColor("Red")
          .setThumbnail(gif)
          .setTimestamp();
        const done = new EmbedBuilder()
          .setTitle("Player Ran Out Of Time!")
          .setColor("DarkButNotBlack")
          .setTimestamp();
        await interaction.channel.send({
          embeds: [bed],
          content: `${interaction.member.user}`,
        });
        await interaction.editReply({ embeds: [done] });
        await used.delete(userId);
        await collector.stop();
      }, 10 * 60 * 1000);
      collector.on("collect", async (m) => {
        const word = m.content.toLocaleLowerCase().replace("!", "").trim();
        if (word.toLocaleLowerCase() === "$stop") {
          await collector.stop();
          await used.delete(userId);
          const currentDate = new Date();
          currentDate.setTime(currentDate.getTime() + 10000); // Adding 1 minute (60 seconds * 1000 milliseconds)
          const relative = time(currentDate, "R");
          const lol = await m.reply(
            `**Game Was Stopped** (*Deleting ${relative}*)`
          );
          setTimeout(async () => {
            await m.delete();
            await interaction.deleteReply();
            await msg.delete();
            await lol.delete();
            await clearTimeout(timer);
          }, 10 * 1000);
        }
        if (!m.content.startsWith("!")) return;
        if (word.length !== 5) {
          const l = await m.channel.send(
            `**${m.author} That Is Not A 5 Letter Word**`
          );
          setTimeout(async () => {
            await m.delete();
            await l.delete();
          }, 5 * 1000);
          return;
        } else {
          const num = used.get(userId);
          if (isEnglishWord(word)) {
            await m.delete();
            const splited = word.toLocaleUpperCase().split("");
            const array1 = word.toLocaleLowerCase().split("");
            let styles = await checkGuess(array1, randomWord);
            styles = styles.split(" ");
            const butns = [
              { name: splited[0], style: styles[0] },
              { name: splited[1], style: styles[1] },
              { name: splited[2], style: styles[2] },
              { name: splited[3], style: styles[3] },
              { name: splited[4], style: styles[4] },
            ];
            const btns = await buttons(butns);
            const allButtons = msg.components;
            await allButtons.push(btns);
            if (num === 0) {
              await msg.edit({ components: [btns] });
            } else {
              await msg.edit({ components: allButtons });
            }
            const newnum = num + 1;
            used.set(userId, newnum);
            if (word === randomWord) {
              const endTime = new Date();
              const timeDifference = endTime - startTime;
              const query = {
                userId: userId,
              };
              const prfl = await Profile.findOne(query);
              let bsttime = "";
              let bstscore = "";
              if (prfl) {
                prfl.GamesWon++;
                if (timeDifference < prfl.BestTime || prfl.BestTime === 0) {
                  prfl.BestTime = timeDifference;
                  bsttime = "- **✨ Best Time ✨**";
                }
                if (newnum < prfl.BestScore || prfl.BestScore === 0) {
                  prfl.BestScore = newnum;
                  bstscore = "- **🎊 Best Score 🎊**";
                }
                await prfl.save().catch((e) => {
                  console.log(`Error saving updated data ${e}`);
                  return;
                });
              }
              let minutes = Math.floor(timeDifference / 60000);
              if (minutes === 0) {
                minutes = "";
              } else {
                minutes = `**\`${minutes}\`** Minutes & `;
              }
              const seconds = Math.floor((timeDifference % 60000) / 1000); // 1 second = 1000 milliseconds
              const timepassed = `${minutes}**\`${seconds}\`** Secondes`;
              const gifs = [
                "https://media.tenor.com/rhghD8RPVhUAAAAd/congratulations-tribe.gif",
                "https://media.tenor.com/UkRbtN4XYpwAAAAC/congratulations-emma.gif",
                "https://media.tenor.com/CAJe2HN2xswAAAAd/congratulations-congrats.gif",
                "https://media.tenor.com/zyL274BVdbMAAAAC/congratulations-congrats.gif",
                "https://media.tenor.com/25gC85a7JmgAAAAC/baby-dance.gif",
              ];
              const gif = await getRandomString(gifs);
              const embed = new EmbedBuilder()
                .setTitle("Congratulations!")
                .setDescription(
                  `🎉 You Managed To Guess **${randomWord.toLocaleUpperCase()}** In : 🎉\n- **\`${newnum}\`** Tries ${bstscore}\n- ${timepassed} ${bsttime}`
                )
                .setThumbnail(gif)
                .setColor("Green")
                .setTimestamp();
              await m.channel.send({ embeds: [embed], content: `${m.author}` });
              await collector.stop();
              await used.delete(userId);
              await clearTimeout(timer);
              return;
            }
            if (num >= 4) {
              const endTime = new Date();
              const timeDifference = endTime - startTime;
              let minutes = Math.floor(timeDifference / 60000);
              if (minutes === 0) {
                minutes = "";
              } else {
                minutes = `**\`${minutes}\`** Minutes & `;
              }
              const seconds = Math.floor((timeDifference % 60000) / 1000); // 1 second = 1000 milliseconds
              const timepassed = `${minutes}**\`${seconds}\`** Secondes`;
              const gifs = [
                "https://media.tenor.com/D5PWQVpx-toAAAAd/game-over-dwayne-johnson.gif",
                "https://media.tenor.com/Uj4RSxn_BTMAAAAC/game-over-glitch.gif",
                "https://media.tenor.com/gfehm9EBljkAAAAC/game-over-final.gif",
                "https://media.tenor.com/VmoFbV3HPUIAAAAC/game-over-video-game.gif",
                "https://media.tenor.com/cELwlJAWOVwAAAAi/youtube-superchat.gif",
                "https://media.tenor.com/L65WiEt6HfcAAAAi/game-over-done.gif",
                "https://media.tenor.com/nPtGARxtb78AAAAi/league-of-legends-riot-games.gif",
              ];
              const gif = await getRandomString(gifs);
              const embed = new EmbedBuilder()
                .setTitle("Game Over!")
                .setDescription(
                  `💔 You Failed To Guess The Word **${randomWord.toLocaleUpperCase()}** 💔\n- You've Used All **\`5\`** Tries\n- Time Passed : ${timepassed}`
                )
                .setThumbnail(gif)
                .setColor("Red")
                .setTimestamp();
              await m.channel.send({ embeds: [embed], content: `${m.author}` });
              await collector.stop();
              await used.delete(userId);
              await clearTimeout(timer);
              return;
            }
          } else {
            const gg = await m.reply(
              `**${m.content
                .replace("!", "")
                .trim()}** is not a valid English word.`
            );
            setTimeout(async () => {
              await m.delete();
              await gg.delete();
            }, 5 * 1000);
          }
        }
      });
    });
  },
};
