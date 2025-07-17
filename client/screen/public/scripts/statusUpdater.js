export const NETWORK_STATUS_STATES = {
  GOOD: 'GOOD',
  SLOW: 'SLOW',
  OFFLINE: 'OFFLINE'
};

export function updateUI(networkInfo) {
  const statusBox = document.querySelector(".status-box");
  const statusText = statusBox.querySelector('.status-text');
  const popoverTail = document.querySelector('.popover-tail');
  const ssid = document.querySelector('.ssid');
  const pingLocalEl = document.getElementById('ping-local');
  const pingInternetEl = document.getElementById('ping-internet');

  statusBox.classList.remove('network-good', 'network-slow', 'network-offline');
  popoverTail.classList.remove('network-good', 'network-slow', 'network-offline');

  let text = "", className = "";

  switch (networkInfo.status) {
    case NETWORK_STATUS_STATES.GOOD:
      text = "Mạng ổn định";
      className = "network-good";
      break;
    case NETWORK_STATUS_STATES.SLOW:
      text = "Mạng chậm";
      className = "network-slow";
      break;
    case NETWORK_STATUS_STATES.OFFLINE:
      text = "Mất kết nối";
      className = "network-offline";
      break;
    default:
      text = "Đang kiểm tra kết nối...";
      className = "network-good";
  }

  if (statusText) statusText.textContent = text;
  if (statusBox) statusBox.classList.add(className);
  if (popoverTail) popoverTail.classList.add(className);

  document.querySelectorAll('.status-box-background').forEach(el => {
    el.classList.remove('active');
  });

  const target = document.querySelector(`.status-box-background.${className}`);
  if (target) {
    target.classList.add('active');
  }

  if (ssid) {
    if (networkInfo.type === 'wifi' && networkInfo.data) {
      ssid.textContent =
        (networkInfo.data.ssid ? `${networkInfo.data.ssid}` : '') +
        (networkInfo.data.rssi != null ? ` (${networkInfo.data.rssi})` : '');
    } else if (networkInfo.type === 'wired') {
      ssid.textContent = 'Mạng dây';
    } else {
      ssid.textContent = '';
    }
  }

  if (networkInfo.data?.ping?.local != null) {
    pingLocalEl.innerHTML = `${networkInfo.data.ping.local}<span style="font-size:14px;"> ms</span>`;
  } else {
    pingLocalEl.textContent = '...';
  }

  if (networkInfo.data?.ping?.internet != null) {
    pingInternetEl.innerHTML = `${networkInfo.data.ping.internet}<span style="font-size:14px;"> ms</span>`;
  } else {
    pingInternetEl.textContent = '...';
  }
}