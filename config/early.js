// Early stage claim role — static, not tied to wave 1-9.
// Set EARLY_MAX in .env if you want to cap it (e.g. EARLY_MAX=500).
// Leave it unset for an uncapped/static Early role.
module.exports = {
  EARLY_ROLE_ID: process.env.EARLY_ROLE_ID,
  EARLY_MAX: process.env.EARLY_MAX ? Number(process.env.EARLY_MAX) : null,
};
