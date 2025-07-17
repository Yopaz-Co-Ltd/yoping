const getOSInfo = () => {
  let osName;

  switch (process.platform) {
    case 'darwin': // macOS
      osName = 'mac';
      break;
    case 'win32': // Windows
      osName = 'windows';
      break;
    case 'linux': // Linux
      osName = 'linux';
      break;
    default:
      osName = 'unknown';
  }
  return {
    device: {
      os: osName
    }
  };
};


module.exports = {
  getOSInfo
};