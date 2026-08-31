require("dotenv").config();

const { Client, GatewayIntentBits, Collection, Events } = require("discord.js");

const officialCommand = require("./commands/official");
const rulesCommand = require("./commands/rules");
const claimRoleCommand = require("./commands/claim-role");
const openWaveCommand = require("./commands/open-wave"); // ⬅️ new

const { handleClaimWaveRole } = require("./handlers/claimWaveRole"); // ⬅️ new

const client = new Client({
  intents: [GatewayIntentBits.Guilds],
});

client.commands = new Collection();

client.commands.set(officialCommand.data.name, officialCommand);
client.commands.set(rulesCommand.data.name, rulesCommand);
client.commands.set(claimRoleCommand.data.name, claimRoleCommand);
client.commands.set(openWaveCommand.data.name, openWaveCommand); // ⬅️ new

client.once(Events.ClientReady, (readyClient) => {
  console.log(`🐻 Ink Bear Bot online as ${readyClient.user.tag}`);
});

client.on(Events.InteractionCreate, async (interaction) => {
  // =========================
  // BUTTON HANDLER
  // =========================

  if (interaction.isButton()) {
    if (interaction.customId === "claim_wave_role") {
      // ⬅️ changed from "claim_early"
      try {
        // Only allow this button inside the claim-role channel
        if (interaction.channelId !== process.env.CLAIM_ROLE_CHANNEL_ID) {
          return interaction.reply({
            content:
              "❌ This button can only be used in the claim-role channel.",
            ephemeral: true,
          });
        }

        await handleClaimWaveRole(interaction); // ⬅️ delegate to the wave logic
      } catch (error) {
        console.error("❌ Error claiming wave role:", error);

        if (!interaction.replied && !interaction.deferred) {
          await interaction.reply({
            content: "❌ Something went wrong while claiming the role.",
            ephemeral: true,
          });
        }
      }

      return;
    }

    return;
  }

  // =========================
  // SLASH COMMAND HANDLER
  // =========================

  if (!interaction.isChatInputCommand()) return;

  const command = client.commands.get(interaction.commandName);

  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);

    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({
        content: "Something went wrong.",
        ephemeral: true,
      });
    } else {
      await interaction.reply({
        content: "Something went wrong.",
        ephemeral: true,
      });
    }
  }
});

client.login(process.env.DISCORD_TOKEN);
