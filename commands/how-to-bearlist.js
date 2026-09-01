const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("how-to-bearlist")
    .setDescription("Show how to become a Bear List member."),

  async execute(interaction) {
    const embed = new EmbedBuilder()
      .setTitle("HOW TO BECOME A BEAR LIST")
      .setDescription(
        "There are **3 ways** to become a Bear List member.\n\n" +
          "### 01 — APPLY\n\n" +
          "Apply through our website and complete the required steps.\n\n" +
          "https://www.hoodbear.xyz/apply\n\n" +
          "### 02 — EARLY\n\n" +
          `Have the <@&1541072332351742032> role?\n\n` +
          "You can submit your wallet directly through the Bear List Claim page.\n\n" +
          "https://www.hoodbear.xyz/claim\n\n" +
          "### 03 — CONTRIBUTOR\n\n" +
          "Want to contribute to HoodBear?\n\n" +
          "Share your contributions and community activity in " +
          "<#1540797263821930607>.\n\n" +
          `The <@&1540806845600366602> role is awarded to community members ` +
          "who actively contribute, participate, and help grow HoodBear.\n\n" +
          "If selected, you can submit your wallet directly through the Bear List Claim page.\n\n" +
          "https://www.hoodbear.xyz/claim\n\n" +
          "> **Contribute. Get noticed. Become a Bear List.**",
      )
      .setColor(0xc8ff00)
      .setFooter({
        text: "HoodBear",
      });

    await interaction.reply({
      embeds: [embed],
    });
  },
};
