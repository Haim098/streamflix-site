/*
 * StreamFlix landing page: the two screenshots on the page.
 * To swap one, put the new file(s) in assets/shots/ and edit this file only.
 * `srcset` is optional (desktop uses it for sharp images on every screen width).
 *
 * Rules: catalogue content only. No profile names, emails or account details.
 */
window.SF_SHOTS = {
  desktop: {
    src: "assets/shots/desktop-home-1920.webp",
    srcset: "assets/shots/desktop-home-960.webp 960w, assets/shots/desktop-home.webp 1600w, assets/shots/desktop-home-1920.webp 1920w",
    w: 1920, h: 1080,
    alt: "StreamFlix במחשב: מסך הבית עם באנר גדול של סרט ושורת המשך צפייה",
  },
  phone: {
    src: "assets/shots/phone-series.webp", w: 720, h: 1497,
    alt: "StreamFlix בטלפון: לשונית הסדרות עם שורות של פוסטרים",
  },
};
