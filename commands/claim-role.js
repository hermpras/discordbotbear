const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");
const { readData, getEarlyData } = require("../utils/claimStore");
const { EARLY_MAX } = require("../config/early");

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

    const slotsLine =
      EARLY_MAX !== null
        ? `🟢 **Slots remaining: ${EARLY_MAX - earlyData.count}/${EARLY_MAX}**`
        : "🟢 **Open to all early community members**";

    const embed = new EmbedBuilder()
      .setTitle("🎟️ CLAIM YOUR ROLE — EARLY")
      .setDescription(
        [
          "Want to be part of the early HoodBear community?",
          "",
          "Click the button below to claim your **Early** role.",
          "",
          "⚠️ Claiming this role means you won't be able to claim a wave role later — Early and wave roles are mutually exclusive.",
          "",
          slotsLine,
        ].join("\n"),
      )
      .setColor("#273524")
      .setFooter({ text: "HoodBear • Community Roles" });

    const button = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("claim_early_role")
        .setLabel("Claim Early Role")
        .setEmoji("🟢")
        .setStyle(ButtonStyle.Success),
    );

    await interaction.channel.send({
      embeds: [embed],
      components: [button],
    });

    await interaction.reply({
      content: "✅ Early role panel posted.",
      ephemeral: true,
    });
  },
};
