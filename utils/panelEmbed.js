const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");

function buildEarlyEmbed(earlyData, EARLY_MAX) {
  const slotsLine =
    EARLY_MAX !== null
      ? `🟢 **Slots remaining: ${EARLY_MAX - earlyData.count}/${EARLY_MAX}**`
      : "🟢 **Open to all early community members**";

  return new EmbedBuilder()
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
}

function buildEarlyButtonRow() {
  return new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId("claim_early_role")
      .setLabel("Claim Early Role")
      .setEmoji("🟢")
      .setStyle(ButtonStyle.Success),
  );
}

function buildWaveEmbed(waveNumber, waveData, MAX_PER_WAVE) {
  const remaining = MAX_PER_WAVE - waveData.count;

  return new EmbedBuilder()
    .setTitle(`🎟️ CLAIM YOUR ROLE — WAVE ${waveNumber}`)
    .setDescription(
      [
        "Want to be part of the early HoodBear community?",
        "",
        `Click the button below to claim your **Wave ${waveNumber}** role.`,
        "",
        `🟢 **Slots remaining: ${remaining}/${MAX_PER_WAVE}**`,
      ].join("\n"),
    )
    .setColor("#273524")
    .setFooter({ text: "HoodBear • Community Roles" });
}

function buildWaveButtonRow(waveNumber) {
  return new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId("claim_wave_role")
      .setLabel(`Claim Wave ${waveNumber}`)
      .setEmoji("🟢")
      .setStyle(ButtonStyle.Success),
  );
}

// Tries to edit a previously-posted panel message with a fresh embed.
// Silently does nothing if the panel was never posted or got deleted —
// this must never block or crash the claim flow.
async function refreshPanelMessage(
  client,
  channelId,
  messageId,
  embed,
  components,
) {
  if (!channelId || !messageId) return;

  try {
    const channel = await client.channels.fetch(channelId);
    if (!channel) return;

    const message = await channel.messages.fetch(messageId);
    if (!message) return;

    await message.edit({ embeds: [embed], components });
  } catch (err) {
    // Message/channel might have been deleted, or bot lost access — non-fatal.
    console.error("⚠️ Failed to refresh panel message:", err.message);
  }
}

module.exports = {
  buildEarlyEmbed,
  buildEarlyButtonRow,
  buildWaveEmbed,
  buildWaveButtonRow,
  refreshPanelMessage,
};
