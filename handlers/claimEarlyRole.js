const {
  readData,
  writeData,
  getEarlyData,
  hasClaimedAny,
} = require("../utils/claimStore");
const { EARLY_ROLE_ID, EARLY_MAX } = require("../config/early");

const MIN_ACCOUNT_AGE_DAYS = 7;
const MIN_MEMBER_AGE_HOURS = 2;

let isWriting = false;

function daysSince(date) {
  return (Date.now() - date.getTime()) / (1000 * 60 * 60 * 24);
}

function hoursSince(date) {
  return (Date.now() - date.getTime()) / (1000 * 60 * 60);
}

async function handleClaimEarlyRole(interaction) {
  if (isWriting) {
    return interaction.reply({
      content: "⏳ The server is busy, please try again in a moment.",
      ephemeral: true,
    });
  }
  isWriting = true;

  try {
    if (!EARLY_ROLE_ID) {
      return interaction.reply({
        content:
          "❌ The Early role hasn't been configured yet (missing EARLY_ROLE_ID).",
        ephemeral: true,
      });
    }

    const data = readData();

    // Already claimed the Early role or a wave role -> block
    if (hasClaimedAny(data, interaction.user.id)) {
      return interaction.reply({
        content:
          "❌ You've already claimed a role (Early or a wave). Only one slot per person!",
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

    const memberAgeHours = hoursSince(interaction.member.joinedAt);
    if (memberAgeHours < MIN_MEMBER_AGE_HOURS) {
      return interaction.reply({
        content: `❌ You haven't been in this server long enough. You must have joined at least ${MIN_MEMBER_AGE_HOURS} hours ago.`,
        ephemeral: true,
      });
    }

    const earlyData = getEarlyData(data);

    if (EARLY_MAX !== null && earlyData.count >= EARLY_MAX) {
      return interaction.reply({
        content: `❌ The Early role is full (${EARLY_MAX}/${EARLY_MAX}).`,
        ephemeral: true,
      });
    }

    try {
      await interaction.member.roles.add(EARLY_ROLE_ID);
    } catch (err) {
      console.error(err);
      return interaction.reply({
        content: "⚠️ Failed to add the role, please contact an admin.",
        ephemeral: true,
      });
    }

    earlyData.count += 1;
    earlyData.claimedUsers.push(interaction.user.id);
    writeData(data);

    const progress =
      EARLY_MAX !== null ? ` (${earlyData.count}/${EARLY_MAX})` : "";

    return interaction.reply({
      content: `✅ Early role claimed successfully!${progress}`,
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

module.exports = { handleClaimEarlyRole };
