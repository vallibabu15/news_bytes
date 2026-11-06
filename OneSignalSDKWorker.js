// News Bytes service worker.
// 1) OneSignal పుష్ నోటిఫికేషన్లు యథావిధిగా పనిచేస్తాయి (మొదటి లైన్).
// 2) ఒకసారి చూసిన పేజీ, ఫోటోలు, ఫాంట్లు, ఫైర్‌బేస్ ఫైళ్లు ఫోన్‌లో సేవ్ అవుతాయి -> నెట్ లేకపోయినా ఓపెన్ అవుతుంది.
importScripts("https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.sw.js");

const NB_CACHE = 'nb-cache-v1';
const NB_MAX_ITEMS = 120;

async function trimCache(cache) {
  const keys = await cache.keys();
  if (keys.length > NB_MAX_ITEMS) {
    for (let i = 0; i < keys.length - NB_MAX_ITEMS; i++) await cache.delete(keys[i]);
  }
}

// పేజీ: ముందు నెట్ (4 సెకన్ల వరకు), రాకపోతే సేవ్ అయినది. కాబట్టి కొత్త ఫైల్ అప్‌లోడ్ చేస్తే వెంటనే కనిపిస్తుంది.
async function pageHandler(req) {
  const u = new URL(req.url);
  const key = new Request(u.origin + u.pathname);
  const cache = await caches.open(NB_CACHE);
  try {
    const net = await Promise.race([
      fetch(req),
      new Promise((_, rej) => setTimeout(() => rej(new Error('slow')), 4000))
    ]);
    if (net && net.ok) cache.put(key, net.clone());
    return net;
  } catch (e) {
    const hit = await cache.match(key);
    if (hit) return hit;
    return fetch(req);
  }
}

// ఫోటోలు / ఫాంట్లు / లైబ్రరీలు: సేవ్ అయినది వెంటనే చూపించి, వెనుక నుంచి కొత్తది తెచ్చి నిల్వ చేస్తుంది
async function cacheFirst(event, req) {
  const cache = await caches.open(NB_CACHE);
  const hit = await cache.match(req);
  const netP = fetch(req).then(res => {
    if (res && (res.ok || res.type === 'opaque')) {
      cache.put(req, res.clone()).then(() => trimCache(cache)).catch(() => {});
    }
    return res;
  }).catch(() => null);
  if (hit) { event.waitUntil(netP); return hit; }
  const res = await netP;
  return res || Response.error();
}

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const u = new URL(req.url);

  const isPage = req.mode === 'navigate' && u.origin === self.location.origin && u.pathname.indexOf('/news_bytes/') === 0;
  const isImage = req.destination === 'image';
  const isLib = u.hostname === 'www.gstatic.com' && u.pathname.indexOf('/firebasejs/') === 0
             || u.hostname === 'cdnjs.cloudflare.com'
             || u.hostname === 'fonts.googleapis.com'
             || u.hostname === 'fonts.gstatic.com';

  if (isPage) event.respondWith(pageHandler(req));
  else if (isImage || isLib) event.respondWith(cacheFirst(event, req));
});
