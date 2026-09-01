const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("rules")
    .setDescription("Show Hood Bear community rules"),

  async execute(interaction) {
    const embed = new EmbedBuilder()
      .setTitle("📜 HOOD BEAR COMMUNITY RULES")
      .setDescription(
        [
          "# Welcome to the Hood Bear Community Discord. Please follow the rules of the community!",
          "",
          "🤗 **Treat everyone with respect.** Absolutely no harassment, witch hunting, sexism, racism, or hate speech will be tolerated.",
          "",
          "💬 **Stay on topic.** Discuss things in the appropriate channel and keep conversations relevant to Ink Bear.",
          "",
          "👨‍💻 **Do your own due diligence.** Nothing mentioned on this Discord server should be considered investment advice.",
          "",
          "⚠️ **Beware of scammers and impersonators.** Our admins will **NEVER DM you to ask for funds or offer tokens.**",
          "",
          "⚠️ **Keep the community safe.** If you see something against the rules or something that makes you feel unsafe, let the staff know. We want this server to be a welcoming and enjoyable space!",
          "",
          "🚫 **No spam or self-promotion.** Server invites, advertisements, and similar content are not allowed without permission from a staff member. This also includes DMing fellow members.",
          "",
          "**ADVICE**",
          "",
          "⚠️ Don’t share private keys or passwords with **ANYONE** under any circumstances. Be careful with private messages.",
          "",
          "⚠️ Be suspicious when someone asks you to send funds.",
          "",
          "⚠️ Don’t take anything too personally or seriously.",
          "",
          '**The Hood Bear Team will NEVER DM you first, NEVER ask for your private information, and NEVER send you links to "fix" your account.**',
        ].join("\n"),
      )
      .setColor("#c8ff00")
      .setFooter({ text: "Hood Bear • Community Rules" });

    await interaction.reply({
      embeds: [embed],
    });
  },
};
