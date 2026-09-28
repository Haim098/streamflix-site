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
    src: "assets/shots/desktop-home.webp", w: 1600, h: 966,
    alt: "מסך הבית של StreamFlix במחשב: באנר גדול של סרט ותפריט ניווט בצד",
  },
  heroPhone: {
    src: "assets/shots/phone-series.webp", w: 720, h: 1497,
    alt: "לשונית הסדרות של StreamFlix בטלפון: שורות של פוסטרים לפי נושא",
  },

  // Screenshot gallery. kind: "desktop" (landscape) or "phone" (portrait).
  gallery: [
    {
      kind: "desktop", src: "assets/shots/desktop-home.webp", w: 1600, h: 966,
      caption: "מסך הבית במחשב",
      alt: "מסך הבית במחשב עם באנר של סרט, לשוניות הכל, סרטים וסדרות ותפריט צד",
    },
    {
      kind: "phone", src: "assets/shots/phone-detail.webp", w: 720, h: 1497,
      caption: "דף סרט בטלפון",
      alt: "דף סרט בטלפון: תמונה, דירוג, כפתורי נגן והורדה, תקציר ושחקנים",
    },
    {
      kind: "desktop", src: "assets/shots/desktop-detail.webp", w: 1600, h: 966,
      caption: "דף סרט במחשב",
      alt: "דף סרט במחשב: כפתורי המשך צפייה והורדה, בחירת איכות, שחקנים ועוד כמו זה",
    },
    {
      kind: "phone", src: "assets/shots/phone-genre.webp", w: 720, h: 1497,
      caption: "ז'אנרים וקטגוריות",
      alt: "מסך ז'אנר בטלפון עם שורות של סרטי אנימציה וגיבורי-על",
    },
  ],
};
