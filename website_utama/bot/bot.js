require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');
const fetch = require('node-fetch');

const DISCORD_TOKEN = process.env.DISCORD_TOKEN;
const GUILD_ID = process.env.GUILD_ID;
const SYNC_SECRET = process.env.SYNC_SECRET;
const API_URL = process.env.API_URL;

if (!DISCORD_TOKEN || DISCORD_TOKEN.includes('your_discord_bot_token')) {
  console.warn('⚠️ PERINGATAN: DISCORD_TOKEN belum dikonfigurasi di file bot/.env!');
}

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers
  ]
});

// Format member object into API payload
function formatMemberData(member, isRemoved = false) {
  const roles = member.roles.cache
    .filter(role => role.name !== '@everyone')
    .map(role => role.id);

  // Get avatar URL
  let avatarUrl = member.user.displayAvatarURL({ extension: 'png', size: 256 }) || '';

  return {
    discord_id: member.id,
    username: member.user.username,
    display_name: member.displayName || member.user.globalName || member.user.username,
    avatar: avatarUrl,
    roles: roles,
    status: isRemoved ? 'inactive' : 'active'
  };
}

// Send members data to PHP API
async function sendToBackend(payload) {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-PASKUS-STRUCTURE-SECRET': SYNC_SECRET
      },
      body: JSON.stringify(payload)
    });

    const result = await response.json();
    if (response.ok && result.ok) {
      console.log(`✅ [SYNC SUCCESS] Berhasil menyinkronkan data ke website:`, result.message || '');
    } else {
      console.error(`❌ [SYNC ERROR] Gagal mengirim data ke website:`, result.message || response.statusText);
    }
  } catch (error) {
    console.error(`❌ [NETWORK ERROR] Kesalahan koneksi ke ${API_URL}:`, error.message);
  }
}

// Sync all members in the guild (Bulk Scan)
async function syncAllMembers() {
  console.log('🔄 Memulai sinkronisasi massal semua anggota...');
  try {
    const guilds = client.guilds.cache;
    if (guilds.size === 0) {
      console.warn('⚠️ Bot belum bergabung di server manapun. Pastikan bot sudah diundang ke server Discord Anda!');
    } else {
      console.log('🌐 Server tempat bot berada:');
      guilds.forEach(g => console.log(`  - Nama: "${g.name}", ID: "${g.id}"`));
    }

    const guild = await client.guilds.fetch(GUILD_ID);
    if (!guild) {
      console.error(`❌ Guild dengan ID ${GUILD_ID} tidak ditemukan.`);
      return;
    }

    // Fetch all members (requires GUILD_MEMBERS intent enabled in Discord Developer Portal)
    const members = await guild.members.fetch();
    const payload = members.map(member => formatMemberData(member, false));

    console.log(`📦 Menemukan ${payload.length} anggota di server Discord. Mengirim ke backend...`);
    await sendToBackend(payload);
  } catch (error) {
    console.error('❌ Kesalahan saat sinkronisasi massal:', error.message);
  }
}

client.once('ready', () => {
  console.log(`🤖 Bot Discord PASKUS-791 aktif sebagai ${client.user.tag}!`);
  
  // Run full sync on startup
  syncAllMembers();

  // Run full sync every 30 minutes to stay in sync
  setInterval(syncAllMembers, 30 * 60 * 1000);
});

// Event: Member Join
client.on('guildMemberAdd', (member) => {
  console.log(`📥 [MEMBER JOIN] ${member.user.tag} masuk server Discord.`);
  const payload = formatMemberData(member, false);
  sendToBackend(payload);
});

// Event: Member Leave
client.on('guildMemberRemove', (member) => {
  console.log(`📤 [MEMBER LEAVE] ${member.user.tag} keluar dari server Discord.`);
  const payload = formatMemberData(member, true);
  sendToBackend(payload);
});

// Event: Member Update (Roles, Nickname changes)
client.on('guildMemberUpdate', (oldMember, newMember) => {
  // Check if roles or nickname changed
  const oldRoles = oldMember.roles.cache.map(r => r.id).join(',');
  const newRoles = newMember.roles.cache.map(r => r.id).join(',');
  const nicknameChanged = oldMember.nickname !== newMember.nickname;
  const usernameChanged = oldMember.user.username !== newMember.user.username;
  const avatarChanged = oldMember.user.avatar !== newMember.user.avatar;

  if (oldRoles !== newRoles || nicknameChanged || usernameChanged || avatarChanged) {
    console.log(`✏️ [MEMBER UPDATE] Perubahan profil/role dideteksi pada ${newMember.user.tag}.`);
    const payload = formatMemberData(newMember, false);
    sendToBackend(payload);
  }
});

client.login(DISCORD_TOKEN).catch(err => {
  console.error('❌ Login Discord Bot gagal! Periksa DISCORD_TOKEN Anda di bot/.env:', err.message);
});
