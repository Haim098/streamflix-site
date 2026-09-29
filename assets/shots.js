/*
 * StreamFlix landing page: every screenshot on the page is listed here.
 * To swap a screenshot, drop the new file into assets/shots/ and change the
 * `src` (and `w`/`h` = the image's pixel size) below. Nothing else needs editing.
 *
 * Rules: catalogue content only. No profile names, emails or account details.
 */
window.SF_SHOTS = {
  // Hero mock-ups (laptop frame + phone frame).
  heroDesktop: {
    src: "assets/shots/desktop-home.webp", w: 1600, h: 900,
    alt: "מסך הבית של StreamFlix במחשב: באנר קולנועי גדול של סרט עם כפתורי נגן ופרטים נוספים, ושורת המשך צפייה",
  },
  heroPhone: {
    src: "assets/shots/phone-series.webp", w: 720, h: 1497,
    alt: "לשונית הסדרות של StreamFlix בטלפון: שורות של פוסטרים לפי נושא",
  },

  // Screenshot gallery. kind: "desktop" (16:9) or "phone" (portrait).
  // Wide screens lay it out as a 6-column bento: keep the order desktop, phone, desktop, phone, desktop, desktop.
  gallery: [
    {
      kind: "desktop", src: "assets/shots/desktop-foryou.webp", w: 1600, h: 900,
      caption: "המלצות \"בשבילך\" במחשב",
      alt: "כרטיס ההמלצה \"מומלץ בשבילך\" במחשב: תמונת רקע רחבה, הסבר למה הסרט הומלץ, כפתורי נגן, הרשימה שלי ולא בשבילי, ושורת עשרת הפופולריים",
    },
    {
      kind: "phone", src: "assets/shots/phone-detail.webp", w: 720, h: 1497,
      caption: "דף סרט בטלפון",
      alt: "דף סרט בטלפון: תמונה, דירוג, כפתורי נגן והורדה, תקציר ושחקנים",
    },
    {
      kind: "desktop", src: "assets/shots/desktop-series.webp", w: 1600, h: 900,
      caption: "דף סדרה במחשב",
      alt: "דף הסדרה \"דברים מוזרים\" במחשב: רקע אדום, דירוג, כפתור המשך פרק, בחירת איכות, תקציר ושורת שחקנים",
    },
    {
      kind: "phone", src: "assets/shots/phone-genre.webp", w: 720, h: 1497,
      caption: "ז'אנרים בטלפון",
      alt: "מסך ז'אנר בטלפון עם שורות של סרטי אנימציה וגיבורי-על",
    },
    {
      kind: "desktop", src: "assets/shots/desktop-episodes.webp", w: 1600, h: 900,
      caption: "פרקים ועונות",
      alt: "רשימת הפרקים של סדרה במחשב: בחירת עונה ושני טורים של פרקים עם תמונה, שם, אורך ותקציר",
    },
    {
      kind: "desktop", src: "assets/shots/desktop-categories.webp", w: 1600, h: 900,
      caption: "קטגוריות",
      alt: "מסך הקטגוריות במחשב: אריחים של ז'אנרים עם תמונות רקע וכותרות בעברית",
    },
  ],
};
