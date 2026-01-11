const keytar = require("keytar");

async function saveToken(token) {
    await keytar.setPassword("ps-frontend", "token", token);
}
async function saveRefreshToken(refresh_token) {
    await keytar.setPassword("ps-frontend", "refresh_token", refresh_token);
}

async function getToken() {
    return await keytar.getPassword("ps-frontend", "token");
}
async function getRefreshToken() {
    return await keytar.getPassword("ps-frontend", "refresh_token");
}

async function deleteToken() {
    await keytar.deletePassword("ps-frontend", "token");
}

async function deleteRefreshToken() {
    await keytar.deletePassword("ps-frontend", "refresh_token");
}


module.exports = {
    getToken,
    getRefreshToken,
    saveToken,
    saveRefreshToken,
    deleteToken,
    deleteRefreshToken
};
