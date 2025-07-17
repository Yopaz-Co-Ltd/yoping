const { Notification } = require("electron");
const { NOTIFICATION } = require("./const");

const showNotification = () => {
  const notification = new Notification({
    title: NOTIFICATION.TITLE,
    body: NOTIFICATION.BODY,
  });

  notification.show();
}

module.exports = {
  showNotification,
};