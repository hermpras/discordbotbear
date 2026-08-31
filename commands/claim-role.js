const {
  SlashCommandBuilder,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");
const { readData, getWaveData } = require("../utils/claimStore");
const { MAX_PER_WAVE } = require("../config/waves");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("claim-role")
    .setDescription("Re-post the claim panel for the currently active wave"),

  async execute(interaction) {
    const channelId = process.env.CLAIM_ROLE_CHANNEL_ID;

    if (interaction.channelId !== channelId) {
      return interaction.reply({
        content: `This command can only be used in <#${channelId}>.`,
        ephemeral: true,
      });
    }

    const data = readData();
    const activeWave = data.activeWave;

    if (!activeWave) {
      return interaction.reply({
        content:
          "❌ There's no active wave right now. Use `/open-wave` first to start one.",
        ephemeral: true,
      });
    }

    const waveData = getWaveData(data, activeWave);
    const remaining = MAX_PER_WAVE - waveData.count;

    const embed = new EmbedBuilder()
      .setTitle(`🎟️ CLAIM YOUR ROLE — WAVE ${activeWave}`)
      .setDescription(
        [
          "Want to be part of the early HoodBear community?",
          "",
          `Click the button below to claim your **Wave ${activeWave}** role.`,
          "",
          `🟢 **Slots remaining: ${remaining}/${MAX_PER_WAVE}**`,
        ].join("\n"),
      )
      .setColor("#273524")
      .setFooter({ text: "HoodBear • Community Roles" });

    const button = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("claim_wave_role")
        .setLabel(`Claim Wave ${activeWave}`)
        .setEmoji("🟢")
        .setStyle(ButtonStyle.Success),
    );

    await interaction.channel.send({
      embeds: [embed],
      components: [button],
    });

    await interaction.reply({
      content: `✅ Wave ${activeWave} panel re-posted.`,
      ephemeral: true,
    });
  },
};
