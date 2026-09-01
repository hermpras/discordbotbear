const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("role-info")
    .setDescription("Display information about HoodBear roles."),

  async execute(interaction) {
    const embed = new EmbedBuilder()
      .setTitle("ROLE INFORMATION")
      .setDescription(
        "━━━━━━━━━━━━━━━━━━\n\n" +
          "**TEAM ROLES**\n\n" +
          "<@&1540748202230157392>\n" +
          "Founder & Lead of HoodBear. Oversees the project's direction, development, and community vision.\n\n" +
          "<@&1541024932308197396>\n" +
          "Community moderation team. Enforces server rules, manages chats, and assists members.\n\n" +
          "━━━━━━━━━━━━━━━━━━\n\n" +
          "**COMMUNITY ROLES**\n\n" +
          "<@&1540754726084419685>\n" +
          "Members with guaranteed access to the HoodBear mint.\n\n" +
          "<@&1540749354908909568>\n" +
          "Verified HoodBear community member. Granted to members who have completed verification.\n\n" +
          "<@&1541072332351742032>\n" +
          "Early supporters of HoodBear who joined the community during its early stages.\n\n" +
          "<@&1540806845600366602>\n" +
          "Recognizes community members who actively contribute to HoodBear through meaningful contributions, support, and participation.\n\n" +
          "━━━━━━━━━━━━━━━━━━\n\n" +
          "**ROLE HIERARCHY**\n\n" +
          "Team roles are assigned by the HoodBear team.\n" +
          "Community roles are earned through verification, early participation, contributions, or official HoodBear activities.",
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
