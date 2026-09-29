/*
 * StreamFlix landing page: every screenshot on the page is listed here.
 * To swap one, put the new file(s) in assets/shots/ and edit this file only.
 * Rules: catalogue content only. No profile names, emails or account details.
 */
window.SF_SHOTS = {
  // Hero mock-ups.
  heroDesktop: {
    src: "assets/shots/desktop-home-1600.webp",
    srcset: "assets/shots/desktop-home-960.webp 960w, assets/shots/desktop-home-1600.webp 1600w",
    w: 1600, h: 900,
    alt: "StreamFlix במחשב: מסך הבית עם באנר גדול של סרט ושורת המשך צפייה",
  },
  heroPhone: {
    src: "assets/shots/phone-series.webp", w: 720, h: 1497,
    alt: "StreamFlix בטלפון: לשונית הסדרות עם שורות של פוסטרים",
  },

  // Screenshots section: the first one is shown wide, the rest side by side.
  // Each caption is the feature it shows: a short title + one short line.
  gallery: [
    {
      src: "assets/shots/desktop-foryou-1600.webp",
      srcset: "assets/shots/desktop-foryou-960.webp 960w, assets/shots/desktop-foryou-1600.webp 1600w",
      w: 1600, h: 900,
      title: "בשבילך",
      text: "המלצות שלומדות ממה שאתם אוהבים.",
      alt: "כרטיס \"מומלץ בשבילך\" במחשב, עם הסבר למה הסרט הומלץ ושורת עשרת הפופולריים",
    },
    {
      src: "assets/shots/desktop-series-1600.webp",
      srcset: "assets/shots/desktop-series-960.webp 960w, assets/shots/desktop-series-1600.webp 1600w",
      w: 1600, h: 900,
      title: "ממשיכים מאותה נקודה",
      text: "בטלפון או במחשב, דרך Google Drive שלכם.",
      alt: "דף הסדרה \"דברים מוזרים\" במחשב עם כפתור המשך פרק",
    },
    {
      src: "assets/shots/desktop-movie-1600.webp",
      srcset: "assets/shots/desktop-movie-960.webp 960w, assets/shots/desktop-movie-1600.webp 1600w",
      w: 1600, h: 900,
      title: "גם בלי אינטרנט",
      text: "מורידים סרט או פרק וצופים בכל מקום.",
      alt: "דף הסרט \"סיינס\" במחשב עם כפתורי נגן והורדה",
    },
  ],
};
