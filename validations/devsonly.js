const { devs } = require("../config.json");
const { EmbedBuilder, CommandInteraction } = require("discord.js");

/**
 * @param {CommandInteraction} interaction
 * @returns
 */
module.exports = async (interaction, commandObj) => {
  if (commandObj.devOnly) {
    if (!devs.includes(interaction.member.user.id)) {
      const embed = new EmbedBuilder()
        .setDescription(
          `**This Command Is For Devs Only, ${interaction.member.user.username} 🙃**`
        )
        .setColor("Red");
      await interaction.reply({
        content: null,
        embeds: [embed],
        ephemeral: true,
      });
      return true;
    }
  }
};
