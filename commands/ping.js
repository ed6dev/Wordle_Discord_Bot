const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Current Bot's Ping!"),

  run: async ({ interaction, client }) => {
    const start = Date.now();
    await interaction.reply("Pinging...");

    const end = Date.now();
    const ping = end - start;

    interaction.editReply(`**Pong! Bot's ping is ${ping}ms**`);
  },
};
