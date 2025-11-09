const keytar = require("keytar");

async function saveToken(token: string) {
    await keytar.setPassword("ps-frontend", "token", token);
}

async function getToken() {
    return await keytar.getPassword("ps-frontend", "token");
}

async function deleteToken() {
    await keytar.deletePassword("ps-frontend", "token");
}

module.exports = {
  getToken,
  saveToken,
  deleteToken,
};
