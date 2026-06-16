/*
 * Team DUKUN PASKUS 791
 * Jevier - Frontend
 * Teddy - Backend
 * Lee - Cyber Sector
 * Osiris - Bot Manufactur
 * Internal proprietary source notice.
 *
 * PM2 config untuk deploy domain staff.paskus791.cloud
 */

module.exports = {
  apps: [
    {
      name: "pelatihdash",
      cwd: "/var/www/pelatihdash",
      script: "server/index.mjs",
      interpreter: "node",
      instances: 1,
      exec_mode: "fork",
      env: {
        NODE_ENV: "production",
        API_PORT: 8787,
      },
    },
  ],
};
