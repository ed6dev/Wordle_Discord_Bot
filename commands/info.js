const { SlashCommandBuilder , EmbedBuilder} = require("discord.js");
const Profile = require('../Utils/Schema')

module.exports = {
  data: new SlashCommandBuilder()
    .setName("info")
    .setDescription("Get A Specified User's Info!")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("Put The User's Tag")
        .setRequired(false)
    ),

  run: async ({ interaction, client }) => {
    await interaction.deferReply();
    let userID = interaction.options.get("user")?.value;
    if (!userID) {
      userID = interaction.member.user.id;
    }
    const guild = interaction.guild;
    const member = await guild.members.fetch(userID);
    if (member.user.bot) {
      const embed = new EmbedBuilder()
        .setDescription(
          `**Bots Can't Play Wordle, ${interaction.user.username} 🙄**`
        )
        .setColor("DarkButNotBlack");
      await interaction.editReply({ embeds: [embed] });
      setTimeout(async () => {
        await interaction.deleteReply();
      }, 10000);
      return;
    }
    const query = {
      userId: userID,
    };
    let embed;
    const info = await Profile.findOne(query);
    if (info) {
      const rate = Math.floor((info.GamesWon * 100) / info.GamesPlayed);
      let minutes = Math.floor(info.BestTime / 60000);
      if (minutes === 0) {
        minutes = "";
      } else {
        minutes = `${minutes} Minutes & `;
      }
      const seconds = Math.floor((info.BestTime % 60000) / 1000); // 1 second = 1000 milliseconds
      const timepassed = `${minutes}${seconds} Secondes`;
      embed = new EmbedBuilder()
        .setTitle(`✨ ${member.user.username}'s Info ✨`)
        .setDescription(
          `- **Games Won :** \`${info.GamesWon} Of ${info.GamesPlayed}\`\n- **Win Rate :** \`${rate}%\`\n\n- **Best Score :** \`${info.BestScore} Tries\`\n- **Best Time :** \`${timepassed}\``
        )
        .setAuthor({
          name: client.user.username,
          iconURL: client.user.avatarURL(),
        })
        .setColor("Blurple")
        .setTimestamp()
        .setThumbnail(member.user.avatarURL());
    } else {
      embed = new EmbedBuilder()
        .setTitle(`❓ ${member.user.username}'s Info ❓`)
        .setDescription(
          `- **Games Won :** \`-\`\n- **Win Rate :** \`-\`\n\n- **Best Score :** \`-\`\n- **Best Time :** \`-\``
        )
        .setAuthor({
          name: client.user.username,
          iconURL: client.user.avatarURL(),
        })
        .setColor("Blurple")
        .setTimestamp()
        .setThumbnail(member.user.avatarURL());
    }
    await interaction.editReply({ embeds: [embed] });
  },
};
