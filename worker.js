self.addEventListener("push", e => {
  const data = e.data.json();
 
  self.registration.showNotification(data.title, {
    body: "Provide the way to AMBULANCE ♥ ",
    vibrate: [200, 100, 200, 100, 200, 100, 200],
    timeout: 10000,

    icon: "https://raw.githubusercontent.com/NON-Localhost/Ambulance-Notifier/main/192.png",
    badge: "https://raw.githubusercontent.com/NON-Localhost/Ambulance-Notifier/main/96.png"

}); 
});
