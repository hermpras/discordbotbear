const {
  ChannelType,
  PermissionFlagsBits,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");

const {
  CATEGORY_ID,
  SUPPORT_ROLE_ID,
  LOG_CHANNEL_ID,
} = require("../config/tickets");

async function handleTicketInteraction(interaction) {
  // Ignore interactions that are not related to tickets
  if (!interaction.isStringSelectMenu() && !interaction.isButton()) {
    return false;
  }

  // =========================
  // CREATE TICKET
  // =========================

  if (
    interaction.isStringSelectMenu() &&
    interaction.customId === "ticket_category"
  ) {
    await interaction.deferReply({ ephemeral: true });

    // Check if user already has an open ticket
    const existingTicket = interaction.guild.channels.cache.find(
      (channel) =>
        channel.type === ChannelType.GuildText &&
        channel.topic === `ticket:${interaction.user.id}`,
    );

    if (existingTicket) {
      await interaction.editReply({
        content: `❌ You already have an open ticket: ${existingTicket}`,
      });

      return true;
    }

    const category = interaction.values[0];

    const categoryNames = {
      support: "support",
      partnership: "partnership",
      report: "report",
      other: "other",
    };

    const channelName =
      `ticket-${categoryNames[category]}-${interaction.user.username}`
        .toLowerCase()
        .replace(/[^a-z0-9-]/g, "")
        .slice(0, 90);

    // =========================
    // CHANNEL PERMISSIONS
    // =========================

    const permissionOverwrites = [
      {
        id: interaction.guild.id,
        deny: [PermissionFlagsBits.ViewChannel],
      },
      {
        id: interaction.user.id,
        allow: [
          PermissionFlagsBits.ViewChannel,
          PermissionFlagsBits.SendMessages,
          PermissionFlagsBits.ReadMessageHistory,
          PermissionFlagsBits.AttachFiles,
          PermissionFlagsBits.EmbedLinks,
        ],
      },
    ];

    // Give Support Team access
    if (SUPPORT_ROLE_ID) {
      permissionOverwrites.push({
        id: SUPPORT_ROLE_ID,
        allow: [
          PermissionFlagsBits.ViewChannel,
          PermissionFlagsBits.SendMessages,
          PermissionFlagsBits.ReadMessageHistory,
          PermissionFlagsBits.AttachFiles,
          PermissionFlagsBits.EmbedLinks,
          PermissionFlagsBits.ManageMessages,
        ],
      });
    }

    // =========================
    // CREATE CHANNEL
    // =========================

    const ticketChannel = await interaction.guild.channels.create({
      name: channelName,
      type: ChannelType.GuildText,
      parent: CATEGORY_ID || null,
      topic: `ticket:${interaction.user.id}`,
      permissionOverwrites,
    });

    // =========================
    // TICKET EMBED
    // =========================

    const embed = new EmbedBuilder()
      .setTitle("🐻 HoodBear Support")
      .setDescription(
        `Welcome ${interaction.user}!\n\n` +
          `**Category:** ${categoryNames[category]}\n\n` +
          "Please explain your issue clearly and provide any relevant information.\n\n" +
          "A member of the HoodBear team will assist you shortly.",
      )
      .setColor(0x7132f5)
      .setFooter({ text: "HoodBear Support" })
      .setTimestamp();

    // =========================
    // TICKET BUTTONS
    // =========================

    const buttons = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("ticket_close")
        .setLabel("Close Ticket")
        .setEmoji("🔒")
        .setStyle(ButtonStyle.Secondary),

      new ButtonBuilder()
        .setCustomId("ticket_delete")
        .setLabel("Delete Ticket")
        .setEmoji("🗑️")
        .setStyle(ButtonStyle.Danger),
    );

    // =========================
    // SEND TICKET MESSAGE
    // =========================

    await ticketChannel.send({
      content: `${interaction.user} ${
        SUPPORT_ROLE_ID ? `<@&${SUPPORT_ROLE_ID}>` : ""
      }`,
      embeds: [embed],
      components: [buttons],
    });

    await interaction.editReply({
      content: `✅ Your ticket has been created: ${ticketChannel}`,
    });

    return true;
  }

  // =========================
  // CLOSE TICKET
  // =========================

  if (interaction.isButton() && interaction.customId === "ticket_close") {
    const channel = interaction.channel;

    if (!channel.topic?.startsWith("ticket:")) {
      await interaction.reply({
        content: "❌ This is not a ticket channel.",
        ephemeral: true,
      });

      return true;
    }

    const ownerId = channel.topic.split(":")[1];

    await interaction.deferReply();

    // Hide ticket from the original owner
    await channel.permissionOverwrites.edit(ownerId, {
      ViewChannel: false,
      SendMessages: false,
    });

    await interaction.editReply({
      content:
        "🔒 **Ticket closed.**\n\n" +
        "A staff member can delete this ticket when it is no longer needed.",
    });

    return true;
  }

  // =========================
  // DELETE TICKET
  // =========================

  if (interaction.isButton() && interaction.customId === "ticket_delete") {
    const channel = interaction.channel;

    if (!channel.topic?.startsWith("ticket:")) {
      await interaction.reply({
        content: "❌ This is not a ticket channel.",
        ephemeral: true,
      });

      return true;
    }

    // Only Support Team or Administrator can delete
    if (
      SUPPORT_ROLE_ID &&
      !interaction.member.roles.cache.has(SUPPORT_ROLE_ID) &&
      !interaction.member.permissions.has(PermissionFlagsBits.Administrator)
    ) {
      await interaction.reply({
        content: "❌ Only the HoodBear Support Team can delete tickets.",
        ephemeral: true,
      });

      return true;
    }

    await interaction.reply({
      content: "🗑️ Deleting ticket...",
    });

    // =========================
    // LOG
    // =========================

    const logChannel = LOG_CHANNEL_ID
      ? interaction.guild.channels.cache.get(LOG_CHANNEL_ID)
      : null;

    if (logChannel) {
      const logEmbed = new EmbedBuilder()
        .setTitle("🗑️ Ticket Deleted")
        .addFields(
          {
            name: "Ticket",
            value: channel.name,
            inline: true,
          },
          {
            name: "Deleted By",
            value: `${interaction.user}`,
            inline: true,
          },
        )
        .setColor(0xed4245)
        .setTimestamp();

      await logChannel.send({
        embeds: [logEmbed],
      });
    }

    // Delete channel after short delay
    setTimeout(async () => {
      try {
        await channel.delete();
      } catch (error) {
        console.error("❌ Failed to delete ticket:", error);
      }
    }, 1500);

    return true;
  }

  return false;
}

module.exports = {
  handleTicketInteraction,
};
