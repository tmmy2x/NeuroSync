export const requestNotificationPermission = async () => {
    if ("Notification" in window && Notification.permission !== "granted") {
      await Notification.requestPermission();
    }
  };
  
  export const showNotification = (message: string) => {
    if (Notification.permission === "granted" && message) {
      new Notification("🧠 PulseSync Nudge", {
        body: message,
        icon: "/favicon.ico"
      });
    }
  };
  