// Use exposed API via preload
document.addEventListener('DOMContentLoaded', () => {
  const btn = document.querySelector('.more-icon');
  if (btn) {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      window.electronAPI.showContextMenu();
    });
  }
});
