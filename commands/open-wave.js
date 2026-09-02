const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const { readData, writeData, getWaveData } = require("../utils/claimStore");
const { ROLES, MAX_PER_WAVE } = require("../config/waves");
const { buildWaveEmbed, buildWaveButtonRow } = require("../utils/panelEmbed");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("open-wave")
    .setDescription("Open a new claim role wave")
    .addIntegerOption((opt) =>
      opt
        .setName("number")
        .setDescription("Wave number (1-9)")
        .setRequired(true)
        .setMinValue(1)
        .setMaxValue(9),
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  async execute(interaction) {
    const waveNumber = interaction.options.getInteger("number");

    if (!ROLES[waveNumber]) {
      return interaction.reply({
        content: `❌ Role for Wave ${waveNumber} hasn't been configured yet.`,
        ephemeral: true,
      });
    }

    const channelId = process.env.CLAIM_ROLE_CHANNEL_ID;
    if (interaction.channelId !== channelId) {
      return interaction.reply({
        content: `This command can only be used in <#${channelId}>.`,
        ephemeral: true,
      });
    }

    const data = readData();
    data.activeWave = waveNumber;
    getWaveData(data, waveNumber); // make sure the entry exists
    writeData(data);

    const waveData = getWaveData(data, waveNumber);

    const embed = buildWaveEmbed(waveNumber, waveData, MAX_PER_WAVE);
    const button = buildWaveButtonRow(waveNumber);

    const sentMessage = await interaction.channel.send({
      embeds: [embed],
      components: [button],
    });

    // Remember which message is the live panel, so future claims can edit it
    data.panelChannelId = sentMessage.channelId;
    data.panelMessageId = sentMessage.id;
    writeData(data);

    return interaction.reply({
      content: `✅ Wave ${waveNumber} is now active. Panel has been posted.`,
      ephemeral: true,
    });
  },
};
