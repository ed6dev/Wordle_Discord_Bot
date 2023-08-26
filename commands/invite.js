const { SlashCommandBuilder , EmbedBuilder , ActionRowBuilder, ButtonBuilder} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("invite")
    .setDescription("Invite The Bot To Your Server!"),

  run: async ({ interaction, client }) => {
    await interaction.deferReply()
    const embed = new EmbedBuilder()
    .setDescription('**Click The Button Below To Invite Me 😏**')
    .setColor('Blue')
    const row = new ActionRowBuilder().setComponents(
        new ButtonBuilder()
        .setLabel('❤')
        .setURL('https://discord.com/api/oauth2/authorize?client_id=1144384536990453790&permissions=964220529728&scope=bot%20applications.commands') // Change this with yours
        .setStyle('Link')
    )
    await interaction.editReply({embeds: [embed], components: [row]})
  },
};
