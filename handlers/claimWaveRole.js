const {
  readData,
  writeData,
  getWaveData,
  hasClaimedAnyWave,
} = require("../utils/claimStore");
const { ROLES, MAX_PER_WAVE } = require("../config/waves");

const MIN_ACCOUNT_AGE_DAYS = 7;
const MIN_MEMBER_AGE_DAYS = 3;

let isWriting = false;

function daysSince(date) {
  return (Date.now() - date.getTime()) / (1000 * 60 * 60 * 24);
}

async function handleClaimWaveRole(interaction) {
  if (isWriting) {
    return interaction.reply({
      content: "⏳ The server is busy, please try again in a moment.",
      ephemeral: true,
    });
  }
  isWriting = true;

  try {
    const data = readData();
    const activeWave = data.activeWave;

    if (!activeWave || !ROLES[activeWave]) {
      return interaction.reply({
        content: "❌ There is no active wave right now.",
        ephemeral: true,
      });
    }

    // Already claimed in a previous wave -> block
    if (hasClaimedAnyWave(data, interaction.user.id)) {
      return interaction.reply({
        content:
          "❌ You've already claimed a role in a previous wave. Only one slot per person!",
        ephemeral: true,
      });
    }

    const accountAgeDays = daysSince(interaction.user.createdAt);
    if (accountAgeDays < MIN_ACCOUNT_AGE_DAYS) {
      return interaction.reply({
        content: `❌ Your Discord account is too new. It must be at least ${MIN_ACCOUNT_AGE_DAYS} days old.`,
        ephemeral: true,
      });
    }

    const memberAgeDays = daysSince(interaction.member.joinedAt);
    if (memberAgeDays < MIN_MEMBER_AGE_DAYS) {
      return interaction.reply({
        content: `❌ You haven't been in this server long enough. You must have joined at least ${MIN_MEMBER_AGE_DAYS} days ago.`,
        ephemeral: true,
      });
    }

    const waveData = getWaveData(data, activeWave);

    if (waveData.count >= MAX_PER_WAVE) {
      return interaction.reply({
        content: `❌ Wave ${activeWave} is full (${MAX_PER_WAVE}/${MAX_PER_WAVE}).`,
        ephemeral: true,
      });
    }

    const roleId = ROLES[activeWave];
    try {
      await interaction.member.roles.add(roleId);
    } catch (err) {
      console.error(err);
      return interaction.reply({
        content: "⚠️ Failed to add the role, please contact an admin.",
        ephemeral: true,
      });
    }

    waveData.count += 1;
    waveData.claimedUsers.push(interaction.user.id);
    writeData(data);

    return interaction.reply({
      content: `✅ Wave ${activeWave} role claimed successfully! (${waveData.count}/${MAX_PER_WAVE})`,
      ephemeral: true,
    });
  } catch (err) {
    console.error(err);
    return interaction.reply({
      content: "⚠️ Something went wrong, please try again or contact an admin.",
      ephemeral: true,
    });
  } finally {
    isWriting = false;
  }
}

module.exports = { handleClaimWaveRole };
