const {
  SlashCommandBuilder,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("official")
    .setDescription("Show official Hoodbear Bear links"),

  async execute(interaction) {
    const embed = new EmbedBuilder()
      .setTitle("🔗 OFFICIAL HOODBEAR")
      .setDescription(
        [
          "Welcome to the official Hoodbear community.",
          "",
          "🌐 **Website**",
          "https://hoodbear.xyz",
          "",
          "🐦 **X / Twitter**",
          "https://x.com/hoodbearNFT",
          "",
          "📖 **Docs**",
          "https://hoodbear.xyz/docs",
          "",
          "🐻 **Bearlist Stats**",
          "https://hoodbear.xyz/claim",
          "",
          "💬 **Discord**",
          "You are here.",
          "",
          "⚠️ **Stay Safe**",
          "Only trust links shared by the official HoodBear team.",
          "We will never ask for your seed phrase or private key.",
        ].join("\n"),
      )
      .setColor("#c8ff00")
      .setFooter({ text: "HOODBEAR • Official Links" });

    const buttons = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setLabel("Website")
        .setStyle(ButtonStyle.Link)
        .setURL("https://hoodbear.xyz"),

      new ButtonBuilder()
        .setLabel("X")
        .setStyle(ButtonStyle.Link)
        .setURL("https://x.com/hoodbearNFT"),

      new ButtonBuilder()
        .setLabel("Docs")
        .setStyle(ButtonStyle.Link)
        .setURL("https://hoodbear.xyz/docs"),

      new ButtonBuilder()
        .setLabel("Bearlist")
        .setStyle(ButtonStyle.Link)
        .setURL("https://hoodbear.xyz/claim"),
    );

    await interaction.reply({
      embeds: [embed],
      components: [buttons],
    });
  },
};
