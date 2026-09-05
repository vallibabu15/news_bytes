importScripts('https://www.gstatic.com/firebasejs/10.8.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.8.1/firebase-messaging-compat.js');

// మీ ప్రాజెక్ట్ వివరాలు
firebase.initializeApp({
    messagingSenderId: "26695955001"
});

const messaging = firebase.messaging();

// బ్యాక్‌గ్రౌండ్‌లో నోటిఫికేషన్ వచ్చినప్పుడు చూపించే విధానం
messaging.onBackgroundMessage((payload) => {
    const notificationTitle = payload.notification.title;
    const notificationOptions = {
        body: payload.notification.body,
        icon: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEh2mta9Iy8-4mBSEIR9zBP3rQegrCAOnmCWv8AIs8Y1a9MYgBWIzg7IcajCAH_wmEXmfsyglaEELRXheyQFqlm-PHMmDpppi-aDuNEgCYEK5Dc_kSmjoFgoIyUpD44Ke26C3LzVrt00pD9VC00P5I7wgf8jssacWWdE3xbu609hb5qpOGh3NlKjyCPyn7yg/s1844/106383.png',
        image: payload.notification.image,
        data: {
            url: 'https://vallibabu15.github.io/news_bytes/'
        }
    };
    return self.registration.showNotification(notificationTitle, notificationOptions);
});
