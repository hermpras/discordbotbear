require("dotenv").config();

const { Client, GatewayIntentBits, Collection, Events } = require("discord.js");

const officialCommand = require("./commands/official");
const rulesCommand = require("./commands/rules");
const claimRoleCommand = require("./commands/claim-role");
const openWaveCommand = require("./commands/open-wave");
const ticketCommand = require("./commands/ticket");
const roleInfoCommand = require("./commands/role-info");
const howToBearListCommand = require("./commands/how-to-bearlist");

const { handleClaimWaveRole } = require("./handlers/claimWaveRole");
const { handleTicketInteraction } = require("./handlers/ticketHandler");

const client = new Client({
  intents: [GatewayIntentBits.Guilds],
});

client.commands = new Collection();

client.commands.set(officialCommand.data.name, officialCommand);
client.commands.set(rulesCommand.data.name, rulesCommand);
client.commands.set(claimRoleCommand.data.name, claimRoleCommand);
client.commands.set(openWaveCommand.data.name, openWaveCommand);
client.commands.set(ticketCommand.data.name, ticketCommand);
client.commands.set(roleInfoCommand.data.name, roleInfoCommand);
client.commands.set(howToBearListCommand.data.name, howToBearListCommand);

client.once(Events.ClientReady, async (readyClient) => {
  console.log(`🐻 HoodBear Bot online as ${readyClient.user.tag}`);

  try {
    const guild = readyClient.guilds.cache.get(process.env.GUILD_ID);

    if (!guild) {
      console.log("❌ Bot tidak menemukan GUILD_ID.");
      return;
    }

    console.log(`🏠 Server: ${guild.name}`);
    console.log(`🆔 Server ID: ${guild.id}`);

    const botMember = await guild.members.fetch(readyClient.user.id);

    console.log(`🤖 Bot: ${botMember.user.tag}`);
    console.log(`🤖 Bot ID: ${botMember.id}`);

    const channel = await guild.channels.fetch("1541146666529329274");

    if (!channel) {
      console.log("❌ Channel tidak ditemukan.");
      return;
    }

    console.log(`📺 Channel: ${channel.name}`);
    console.log(`🆔 Channel ID: ${channel.id}`);

    const permissions = channel.permissionsFor(botMember);

    if (!permissions) {
      console.log("❌ Tidak bisa membaca permission bot.");
      return;
    }

    console.log(`👀 ViewChannel: ${permissions.has("ViewChannel")}`);

    console.log(`💬 SendMessages: ${permissions.has("SendMessages")}`);

    console.log(`🔗 EmbedLinks: ${permissions.has("EmbedLinks")}`);

    console.log(
      `📖 ReadMessageHistory: ${permissions.has("ReadMessageHistory")}`,
    );

    console.log(`🛠️ ManageChannels: ${permissions.has("ManageChannels")}`);
  } catch (error) {
    console.error("❌ Permission diagnostic error:", error);
  }
});

client.on(Events.InteractionCreate, async (interaction) => {
  try {
    // =========================
    // TICKET HANDLER
    // =========================

    const handledByTicket = await handleTicketInteraction(interaction);

    if (handledByTicket) {
      return;
    }

    // =========================
    // BUTTON HANDLER
    // =========================

    if (interaction.isButton()) {
      if (interaction.customId === "claim_wave_role") {
        try {
          if (interaction.channelId !== process.env.CLAIM_ROLE_CHANNEL_ID) {
            return interaction.reply({
              content:
                "❌ This button can only be used in the claim-role channel.",
              ephemeral: true,
            });
          }

          await handleClaimWaveRole(interaction);
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

    if (!interaction.isChatInputCommand()) {
      return;
    }

    const command = client.commands.get(interaction.commandName);

    if (!command) {
      return;
    }

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
  } catch (error) {
    console.error("❌ Interaction error:", error);

    if (!interaction.replied && !interaction.deferred) {
      await interaction.reply({
        content: "❌ Something went wrong.",
        ephemeral: true,
      });
    }
  }
});

client.login(process.env.DISCORD_TOKEN);
