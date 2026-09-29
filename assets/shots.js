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

  // Screenshots showcase: a stage that cycles through the desktop shots (in this order),
  // with a phone frame beside it (wide screens) cycling through the phone shots.
  // Each desktop shot: base name in assets/shots/ (files <name>-320/-960.webp + <name>.webp at 1600 px),
  // a short title and one short line.
  showcase: {
    desktop: [
      {
        name: "desktop-home", title: "מסך הבית", text: "באנר גדול, והמשך צפייה מאיפה שעצרתם.",
        alt: "מסך הבית של StreamFlix במחשב: באנר קולנועי של סרט ושורת המשך צפייה",
      },
      {
        name: "desktop-foryou", title: "בשבילך", text: "המלצות שמסבירות למה הן כאן.",
        alt: "כרטיס \"מומלץ בשבילך\" במחשב: תמונת רקע רחבה, הסבר להמלצה, כפתורי פעולה ושורת עשרת הפופולריים",
      },
      {
        name: "desktop-series", title: "דף סדרה", text: "דירוג, שחקנים, והמשך לפרק הבא.",
        alt: "דף הסדרה \"דברים מוזרים\" במחשב: רקע אדום, דירוג, כפתור המשך פרק ושורת שחקנים",
      },
      {
        name: "desktop-episodes", title: "פרקים", text: "כל עונה וכל פרק, במבט אחד.",
        alt: "רשימת הפרקים של סדרה במחשב: בחירת עונה ושני טורים של פרקים עם תמונה, אורך ותקציר",
      },
      {
        name: "desktop-categories", title: "קטגוריות", text: "כל הז'אנרים, בלחיצה אחת.",
        alt: "מסך הקטגוריות במחשב: אריחי ז'אנרים עם תמונות רקע וכותרות בעברית",
      },
    ],
    phone: [
      { src: "assets/shots/phone-series.webp", alt: "לשונית הסדרות בטלפון: שורות של פוסטרים" },
      { src: "assets/shots/phone-detail.webp", alt: "דף סרט בטלפון: דירוג, כפתורי נגן והורדה, תקציר ושחקנים" },
      { src: "assets/shots/phone-genre.webp", alt: "מסך ז'אנר בטלפון עם שורות של סרטים" },
    ],
  },
};
