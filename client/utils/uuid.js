const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const path = require('path');
const os = require('os');

const uuidFilePath = path.join(os.homedir(), '.yoping');

function getDeviceUUID() {
  if (fs.existsSync(uuidFilePath)) {
    return fs.readFileSync(uuidFilePath, 'utf-8').trim();
  }

  const uuid = uuidv4();
  fs.writeFileSync(uuidFilePath, uuid, 'utf-8');
  return uuid;
}

module.exports = { getDeviceUUID };