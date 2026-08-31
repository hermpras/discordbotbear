require("dotenv").config();

const { REST, Routes } = require("discord.js");

const officialCommand = require("./commands/official");
const rulesCommand = require("./commands/rules");
const claimRoleCommand = require("./commands/claim-role");
const openWaveCommand = require("./commands/open-wave"); // ⬅️ baru

const commands = [
  officialCommand.data.toJSON(),
  rulesCommand.data.toJSON(),
  claimRoleCommand.data.toJSON(),
  openWaveCommand.data.toJSON(), // ⬅️ baru
];

const rest = new REST({ version: "10" }).setToken(process.env.DISCORD_TOKEN);

(async () => {
  try {
    console.log("🔄 Registering Hood Bear commands...");

    await rest.put(
      Routes.applicationGuildCommands(
        process.env.CLIENT_ID,
        process.env.GUILD_ID,
      ),
      {
        body: commands,
      },
    );

    console.log(
      "✅ /official, /rules, /claim-role, and /open-wave registered successfully!",
    );
  } catch (error) {
    console.error(error);
  }
})();
