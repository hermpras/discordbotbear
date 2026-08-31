module.exports = {
  // Category tempat semua ticket dibuat
  CATEGORY_ID: process.env.TICKET_CATEGORY_ID || null,

  // Role yang bisa melihat dan menangani ticket
  SUPPORT_ROLE_ID: process.env.SUPPORT_ROLE_ID || null,

  // Channel untuk log ticket
  LOG_CHANNEL_ID: process.env.TICKET_LOG_CHANNEL_ID || null,
};
