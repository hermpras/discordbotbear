const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "..", "data", "claimData.json");

// Structure standar agar bot tidak crash
const defaultData = {
  activeWave: null,
  panelChannelId: null,
  panelMessageId: null,
  waves: {},
};

function readData() {
  try {
    // 1. Jika file belum ada, buat baru beserta folder parent-nya
    if (!fs.existsSync(filePath)) {
      fs.mkdirSync(path.dirname(filePath), { recursive: true });
      fs.writeFileSync(filePath, JSON.stringify(defaultData, null, 2));
      return { ...defaultData };
    }

    // 2. Baca isi file
    const fileContent = fs.readFileSync(filePath, "utf8");

    // 3. Cegah crash jika isi file kosong atau hanya whitespace
    if (!fileContent.trim()) {
      fs.writeFileSync(filePath, JSON.stringify(defaultData, null, 2));
      return { ...defaultData };
    }

    const parsedData = JSON.parse(fileContent);

    // 4. Pastikan objek 'waves' selalu ada walau file JSON sebelumnya berisi `{}`
    if (!parsedData.waves || typeof parsedData.waves !== "object") {
      parsedData.waves = {};
    }

    return parsedData;
  } catch (error) {
    console.error(
      "Gagal membaca atau memproses claimData.json:",
      error.message,
    );
    // Fallback aman agar bot tidak mati
    return { ...defaultData };
  }
}

function writeData(data) {
  try {
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error("Gagal menyimpan data ke claimData.json:", error.message);
  }
}

function getWaveData(data, wave) {
  // Amankan jika parameter 'data' null/undefined atau 'waves' tidak tersedia
  if (!data || typeof data !== "object") return { count: 0, claimedUsers: [] };
  if (!data.waves) data.waves = {};

  if (!data.waves[wave]) {
    data.waves[wave] = { count: 0, claimedUsers: [] };
  }
  return data.waves[wave];
}

// Check whether a user has already claimed a role in ANY wave (not just the active one)
function hasClaimedAnyWave(data, userId) {
  if (!data || !data.waves) return false;
  return Object.values(data.waves).some((w) =>
    w?.claimedUsers?.includes(userId),
  );
}

module.exports = { readData, writeData, getWaveData, hasClaimedAnyWave };
