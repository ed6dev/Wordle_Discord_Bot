require("dotenv").config();
const Discord = require("discord.js");
const {
  Client,
  IntentsBitField,
} = require("discord.js");
const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
    IntentsBitField.Flags.GuildInvites,
    IntentsBitField.Flags.GuildMessageReactions,
    IntentsBitField.Flags.GuildPresences,
  ],
});

const path = require("path");
const { CommandHandler } = require("djs-commander");
const mongoose = require("mongoose");

new CommandHandler({
  client,
  commandsPath: path.join(__dirname, "commands"),
  eventsPath: path.join(__dirname, "events"),
  validationsPath: path.join(__dirname, "validations"),
  testServer: "1133152077489635348"
});

(async () => {
  await mongoose.connect(process.env.MONGODB);
  console.log("Connected To The Database");

  client.login(process.env.TOKEN);
})();
