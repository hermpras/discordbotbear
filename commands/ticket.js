const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  EmbedBuilder,
  ActionRowBuilder,
  StringSelectMenuBuilder,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("setup-ticket")
    .setDescription("Set up the HoodBear support ticket panel.")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  async execute(interaction) {
    const embed = new EmbedBuilder()
      .setTitle("🐻 HOODBEAR SUPPORT")
      .setDescription(
        "Need help? Select a category below to open a private ticket.\n\n" +
          "Please provide as much information as possible so our team can help you quickly.",
      )
      .setColor(0xc8ff00)
      .setFooter({
        text: "HoodBear Support",
      });

    const menu = new StringSelectMenuBuilder()
      .setCustomId("ticket_category")
      .setPlaceholder("Select a ticket category...")
      .addOptions([
        {
          label: "Support",
          description: "General questions or assistance",
          value: "support",
          emoji: "🛠️",
        },
        {
          label: "Partnership",
          description: "Collaboration and partnership inquiries",
          value: "partnership",
          emoji: "🤝",
        },
        {
          label: "Report",
          description: "Report an issue or user",
          value: "report",
          emoji: "🐛",
        },
        {
          label: "Other",
          description: "Anything else",
          value: "other",
          emoji: "❓",
        },
      ]);

    const row = new ActionRowBuilder().addComponents(menu);

    await interaction.channel.send({
      embeds: [embed],
      components: [row],
    });

    await interaction.reply({
      content: "✅ Ticket panel has been created.",
      ephemeral: true,
    });
  },
};
