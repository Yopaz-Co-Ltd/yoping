export const NETWORK_STATUS_STATES = {
  GOOD: 'GOOD',
  SLOW: 'SLOW',
  OFFLINE: 'OFFLINE'
};

export function updateUI(statusCode) {
  const statusBox = document.querySelector(".status-box");
  const statusText = statusBox.querySelector('.status-text');
  const popoverTail = document.querySelector('.popover-tail');

  // Remove gradient to start fade out
  statusBox.classList.remove('gradient-active');
  // Force reflow so opacity transition starts
  void statusBox.offsetWidth;

  // Remove previous status classes
  statusBox.classList.remove('network-good', 'network-slow', 'network-offline');
  popoverTail.classList.remove('network-good', 'network-slow', 'network-offline');

  let text = "", className = "";

  switch (statusCode) {
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

  // Reflow again before fading in new gradient
  void statusBox.offsetWidth;
  statusBox.classList.add('gradient-active');
}