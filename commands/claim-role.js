const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const { readData, writeData, getEarlyData } = require("../utils/claimStore");
const { EARLY_MAX } = require("../config/early");
const { buildEarlyEmbed, buildEarlyButtonRow } = require("../utils/panelEmbed");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("claim-role")
    .setDescription("Post the static Early role claim panel")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  async execute(interaction) {
    const channelId = process.env.CLAIM_ROLE_CHANNEL_ID;

    if (interaction.channelId !== channelId) {
      return interaction.reply({
        content: `This command can only be used in <#${channelId}>.`,
        ephemeral: true,
      });
    }

    const data = readData();
    const earlyData = getEarlyData(data);

    const embed = buildEarlyEmbed(earlyData, EARLY_MAX);
    const button = buildEarlyButtonRow();

    const sentMessage = await interaction.channel.send({
      embeds: [embed],
      components: [button],
    });

    // Remember which message is the live panel, so future claims can edit it
    earlyData.panelChannelId = sentMessage.channelId;
    earlyData.panelMessageId = sentMessage.id;
    writeData(data);

    await interaction.reply({
      content: "✅ Early role panel posted.",
      ephemeral: true,
    });
  },
};
