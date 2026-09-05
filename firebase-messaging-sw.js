importScripts('https://www.gstatic.com/firebasejs/10.8.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.8.1/firebase-messaging-compat.js');

firebase.initializeApp({
    apiKey: "AIzaSyDQJ0x2mFZqoCgiE_34fg9WxomurFWoopg",
    authDomain: "newsbytes-848a9.firebaseapp.com",
    projectId: "newsbytes-848a9",
    storageBucket: "newsbytes-848a9.firebasestorage.app",
    messagingSenderId: "26695955001",
    appId: "1:26695955001:web:0c25b74d7a849f4a9d13e8"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {

    const notification = payload.notification || {};

    const notificationTitle =
        notification.title || "News Bytes";

    const notificationOptions = {
        body: notification.body || "కొత్త వార్త వచ్చింది",
        icon: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEh2mta9Iy8-4mBSEIR9zBP3rQegrCAOnmCWv8AIs8Y1a9MYgBWIzg7IcajCAH_wmEXmfsyglaEELRXheyQFqlm-PHMmDpppi-aDuNEgCYEK5Dc_kSmjoFgoIyUpD44Ke26C3LzVrt00pD9VC00P5I7wgf8jssacWWdE3xbu609hb5qpOGh3NlKjyCPyn7yg/s1844/106383.png",
        image: notification.image || undefined,
        data: {
            url: "https://vallibabu15.github.io/news_bytes/"
        }
    };

    self.registration.showNotification(
        notificationTitle,
        notificationOptions
    );
});

self.addEventListener("notificationclick", (event) => {
    event.notification.close();

    event.waitUntil(
        clients.openWindow(
            "https://vallibabu15.github.io/news_bytes/"
        )
    );
});
