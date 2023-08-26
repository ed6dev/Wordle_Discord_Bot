const { ActionRowBuilder, ButtonBuilder } = require("discord.js");

function generateRandomString(length) {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  const charactersLength = characters.length;

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charactersLength);
    result += characters[randomIndex];
  }

  return result;
}

module.exports = (btnsinfo) => {
  const buttons1 = new ActionRowBuilder().setComponents(
    new ButtonBuilder()
      .setLabel(btnsinfo[0].name)
      .setStyle(btnsinfo[0].style)
      .setCustomId(generateRandomString(10)),
    new ButtonBuilder()
      .setLabel(btnsinfo[1].name)
      .setStyle(btnsinfo[1].style)
      .setCustomId(generateRandomString(10)),
    new ButtonBuilder()
      .setLabel(btnsinfo[2].name)
      .setStyle(btnsinfo[2].style)
      .setCustomId(generateRandomString(10)),
    new ButtonBuilder()
      .setLabel(btnsinfo[3].name)
      .setStyle(btnsinfo[3].style)
      .setCustomId(generateRandomString(10)),
    new ButtonBuilder()
      .setLabel(btnsinfo[4].name)
      .setStyle(btnsinfo[4].style)
      .setCustomId(generateRandomString(10))
  );
  return buttons1;
};
