import { Notification } from 'electron';
import { NOTIFICATION } from './const.js';


const showNotification = () => {
  const notification = new Notification({
    title: NOTIFICATION.TITLE,
    body: NOTIFICATION.BODY,
  });

  notification.show();
}

module.exports = {
  showNotification
};