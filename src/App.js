import { useState, useEffect } from "react";
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer, Tooltip } from "recharts";

// ============================================================
// DATA: QUESTIONS
// ============================================================
// To edit questions: change the `text`, `explanation`, `pro`, `con` fields.
// `direction`: 1 = higher score = more right-leaning, -1 = higher score = more left-leaning
// `dimension`: must match one of the 6 dimensions
// ============================================================
const QUESTIONS = [
  // === כלכלה ===
  {
    id: 1, dimension: "economy", direction: 1,
    text: "המדינה צריכה להפחית את מעורבותה בקביעת שכר המינימום ולאפשר לשוק לקבוע שכר בצורה חופשית יותר.",
    explanation: "שכר מינימום הוא שכר הנמוך ביותר שמותר לשלם לעובד על פי חוק.",
    pro: "גמישות לעסקים קטנים, יצירת מקומות עבודה ותחרות.",
    con: "עלול לפגוע בעובדים בשכר נמוך ולהגדיל פערים."
  },
  {
    id: 2, dimension: "economy", direction: 1,
    text: "יש להפריט שירותים ממשלתיים כמו בריאות וחינוך ולהפעיל אותם בעיקר דרך גופים פרטיים.",
    explanation: "הפרטה היא העברת ניהול שירותים ציבוריים לידיים פרטיות.",
    pro: "תחרות עשויה לשפר יעילות ואיכות.",
    con: "עלול לפגוע בנגישות לאוכלוסיות חלשות."
  },
  {
    id: 3, dimension: "economy", direction: -1,
    text: "המדינה צריכה להגדיל משמעותית את ההשקעה בדיור ציבורי כדי להפחית את עלויות שכר הדירה.",
    explanation: "דיור ציבורי הוא דירות בבעלות המדינה המוצעות בשכר דירה נמוך.",
    pro: "מסייע לאוכלוסיות חלשות להתגורר בכבוד.",
    con: "עלות גבוהה למדינה ואתגרים בניהול."
  },
  {
    id: 4, dimension: "economy", direction: 1,
    text: "הפחתת מיסים על עסקים ויחידים תוביל לצמיחה כלכלית שתועיל לכלל הציבור.",
    explanation: "הורדת מיסים מותירה יותר כסף אצל אנשים ועסקים.",
    pro: "עידוד השקעות, יזמות וצמיחה כלכלית.",
    con: "מקטינה את הכנסות המדינה לשירותים ציבוריים."
  },
  {
    id: 5, dimension: "economy", direction: -1,
    text: "יש להגביר את הרגולציה על חברות גדולות כדי למנוע ריכוז כוח כלכלי.",
    explanation: "רגולציה היא חקיקה שמגבילה את פעילות חברות.",
    pro: "מגנה על הצרכן ועל תחרות הוגנת.",
    con: "עלולה להאט את הצמיחה ולהכביד על עסקים."
  },

  // === ביטחון ומדיניות חוץ ===
  {
    id: 6, dimension: "security", direction: 1,
    text: "ישראל צריכה לפעול בצורה חד-צדדית נגד איומים ביטחוניים, גם ללא אישור גורמים בינלאומיים.",
    explanation: "פעולה חד-צדדית פירושה ישראל פועלת לפי שיקוליה בלי לתאם עם מדינות אחרות.",
    pro: "מאפשרת תגובה מהירה ואפקטיבית לאיומים.",
    con: "עלולה לפגוע ביחסי החוץ ולגרום לבידוד דיפלומטי."
  },
  {
    id: 7, dimension: "security", direction: -1,
    text: "פתרון הסכסוך הישראלי-פלסטיני דורש פשרות טריטוריאליות מצד ישראל.",
    explanation: "פשרות טריטוריאליות פירושן ויתור על חלק מהשטחים המוחזקים בתמורה לשלום.",
    pro: "עשוי להוביל לפתרון מדיני ולהפחתת אלימות.",
    con: "טומן בחובו סיכונים ביטחוניים ומחלוקות פנימיות."
  },
  {
    id: 8, dimension: "security", direction: 1,
    text: "יש להגדיל את תקציב הביטחון גם על חשבון תקציבים אזרחיים.",
    explanation: "הגדלת תקציב הביטחון פירושה הקצאת יותר משאבים לצבא ולשב\"כ.",
    pro: "מחזקת את הגנת המדינה וההרתעה.",
    con: "מצמצמת השקעה בבריאות, חינוך ורווחה."
  },
  {
    id: 9, dimension: "security", direction: -1,
    text: "ישראל צריכה לאפשר לפלסטינים בגדה המערבית יותר אוטונומיה ושליטה על חייהם היומיומיים.",
    explanation: "אוטונומיה פירושה סמכות שלטונית עצמאית יותר לפלסטינים.",
    pro: "עשויה להפחית חיכוכים ולשפר את המצב ההומניטרי.",
    con: "מעלה שאלות ביטחוניות לגבי שליטה ישראלית."
  },
  {
    id: 10, dimension: "security", direction: 1,
    text: "ישראל לא צריכה לוותר על שטחים אסטרטגיים גם בתמורה להסכמים דיפלומטיים.",
    explanation: "שטחים אסטרטגיים הם אזורים בעלי ערך ביטחוני גבוה כמו בקעת הירדן.",
    pro: "שמירת יתרון ביטחוני ועומק אסטרטגי.",
    con: "עלול לחסום מסלולים לפתרון מדיני."
  },

  // === דת ומדינה ===
  {
    id: 11, dimension: "religion_state", direction: -1,
    text: "המדינה צריכה להפריד בין דת ומדינה ולאפשר נישואין אזרחיים לכל אזרח.",
    explanation: "נישואין אזרחיים הם נישואין שמוכרים על ידי המדינה ללא מרכיב דתי.",
    pro: "מאפשר לאנשים ללא השתייכות דתית להתחתן באופן רשמי.",
    con: "עלול לפגוע בזהות הדתית של מדינת ישראל."
  },
  {
    id: 12, dimension: "religion_state", direction: 1,
    text: "יש לשמר את הסטטוס קוו הדתי בנוגע לשמירת שבת ברשות הציבורית.",
    explanation: "הסטטוס קוו כולל הגבלות על פתיחת עסקים ותחבורה ציבורית בשבת.",
    pro: "שומר על אופי יהודי של המרחב הציבורי.",
    con: "מגביל חירות הפרט ופוגע באוכלוסייה חילונית."
  },
  {
    id: 13, dimension: "religion_state", direction: -1,
    text: "לתלמידים בישיבות יש להחיל גיוס חובה שווה כמו על כלל האוכלוסייה.",
    explanation: "כיום, חלק מהסטודנטים בישיבות פטורים משירות צבאי.",
    pro: "שוויון בנטל ביטחוני ואזרחי.",
    con: "עלול לפגוע בקיום עולם התורה."
  },
  {
    id: 14, dimension: "religion_state", direction: 1,
    text: "על המדינה להמשיך לממן מוסדות דתיים וישיבות כחלק מהתרבות היהודית.",
    explanation: "המדינה מעבירה תקציבים לישיבות ומוסדות דתיים.",
    pro: "שמירה על מורשת יהודית ותרבותית.",
    con: "מעלה שאלות לגבי הפרדת דת ומדינה."
  },
  {
    id: 15, dimension: "religion_state", direction: -1,
    text: "הרבנות הראשית צריכה לאבד את המונופול שלה על ענייני נישואין וגירושין.",
    explanation: "כיום רק הרבנות הראשית מוסמכת לרשום נישואין בין יהודים בישראל.",
    pro: "מאפשר פלורליזם דתי ושוויון בין זרמי היהדות.",
    con: "עלול לפגוע באחדות הזהות היהודית הרשמית."
  },

  // === חירויות הפרט ===
  {
    id: 16, dimension: "civil_liberties", direction: -1,
    text: "על המדינה לחוקק חוקים המגנים על שוויון זכויות ללא קשר למין, מגדר, נטייה מינית או לאום.",
    explanation: "חוקי שוויון אוסרים אפליה בתעסוקה, דיור ושירותים.",
    pro: "מגן על קבוצות מוחלשות ומקדם שוויון חברתי.",
    con: "עלול להגביל חופש הביטוי הדתי בעסקים פרטיים."
  },
  {
    id: 17, dimension: "civil_liberties", direction: -1,
    text: "יש לאפשר לבתי משפט לפסוק נגד ממשלה בנושאי זכויות אדם, גם אם הדבר נוגד את רצון הרוב.",
    explanation: "ביקורת שיפוטית מאפשרת לבתי משפט לבטל חקיקה שפוגעת בזכויות.",
    pro: "מגן על מיעוטים מפני רדנות הרוב.",
    con: "עלול להגביל את כוח הנבחרים ואת רצון הציבור."
  },
  {
    id: 18, dimension: "civil_liberties", direction: 1,
    text: "הגבלת חופש הביטוי מוצדקת כשמדובר בתכנים שעלולים לפגוע בביטחון הלאומי.",
    explanation: "הגבלות על חופש הביטוי קיימות בכל דמוקרטיה, השאלה היא היקפן.",
    pro: "מגן על בטחון אזרחים ומניעת הסתה.",
    con: "עלול לשמש כלי לדיכוי ביקורת לגיטימית."
  },
  {
    id: 19, dimension: "civil_liberties", direction: -1,
    text: "יש להגן על חופש התקשורת ולמנוע ממשלה מלרכוש השפעה על ערוצי שידור.",
    explanation: "עצמאות התקשורת חיונית לביקורת ציבורית על הממשל.",
    pro: "מבטיח מידע אמין ועצמאי לציבור.",
    con: "גבולות הרגולציה על תקשורת מורכבים."
  },
  {
    id: 20, dimension: "civil_liberties", direction: -1,
    text: "זכויות של פרט לא צריכות להיות כפופות לרוב פרלמנטרי ויש לעגן אותן בחוקה.",
    explanation: "חוקה מגנה על זכויות יסוד גם אם הכנסת מצביעה נגדן.",
    pro: "הגנה יציבה על זכויות הפרט.",
    con: "מגביל גמישות דמוקרטית ורצון הציבור."
  },

  // === מדיניות חברתית ===
  {
    id: 21, dimension: "social_policy", direction: -1,
    text: "המדינה צריכה להשקיע יותר בקליטת עלייה ובשילוב מהגרים בחברה הישראלית.",
    explanation: "קליטת עלייה כוללת שפה, תעסוקה, חינוך וזהות.",
    pro: "מחזק את הגיוון הכלכלי ומסייע לעולים.",
    con: "דורש משאבים רבים ומורכב תרבותית."
  },
  {
    id: 22, dimension: "social_policy", direction: -1,
    text: "יש להגדיל את הקצבאות החברתיות לאוכלוסיות מוחלשות גם אם הדבר מחייב העלאת מיסים.",
    explanation: "קצבאות חברתיות כוללות קצבת ילדים, קצבת נכות וסיוע לדיור.",
    pro: "מפחית עוני ומסייע לאוכלוסיות בשוליים.",
    con: "עלות למשלמי מיסים ועלול ליצור תלות."
  },
  {
    id: 23, dimension: "social_policy", direction: 1,
    text: "מדיניות העדפה מתקנת (כמו מכסות) לקבוצות מסוימות פוגעת בעיקרון של שוויון הזדמנויות.",
    explanation: "העדפה מתקנת נועדה לפצות על אפליה היסטורית.",
    pro: "מאפשר שוויון אמיתי בתוצאות.",
    con: "נתפסת כפגיעה בכישרון ובמצוינות."
  },
  {
    id: 24, dimension: "social_policy", direction: -1,
    text: "על המדינה לפעול למיגור פערים חברתיים בין פריפריה למרכז באמצעות השקעה ממשלתית.",
    explanation: "פערים פריפריה-מרכז כוללים פערים בתשתיות, חינוך ותעסוקה.",
    pro: "מחזק את הלכידות החברתית.",
    con: "עלול להיות לא יעיל ולדרוש ניהול ריכוזי."
  },
  {
    id: 25, dimension: "social_policy", direction: 1,
    text: "כל אחד נושא באחריות אישית למצבו הכלכלי והמדינה לא צריכה להתערב יתר על המידה.",
    explanation: "אחריות אישית מול אחריות קולקטיבית היא שאלה מרכזית בפילוסופיה חברתית.",
    pro: "מעודד יזמות, עצמאות ומוטיבציה.",
    con: "מתעלם מגורמים מבניים כמו עוני ומוצא."
  },

  // === מערכת המשפט ומוסדות המדינה ===
  {
    id: 26, dimension: "judiciary", direction: -1,
    text: "בית המשפט העליון צריך לשמור על סמכות לפסול חקיקה שפוגעת בזכויות יסוד.",
    explanation: "ביקורת שיפוטית מאפשרת לשפוט לבטל חוקים שנחקקו בכנסת.",
    pro: "מגן על דמוקרטיה ועל מיעוטים.",
    con: "נותן כוח לבלתי נבחרים על הנבחרים."
  },
  {
    id: 27, dimension: "judiciary", direction: 1,
    text: "הכנסת צריכה להיות מסוגלת לעקוף פסיקות בית המשפט העליון באמצעות רוב מיוחד.",
    explanation: "פסקת ההתגברות מאפשרת לכנסת להחיל חוק גם לאחר שנפסל.",
    pro: "מחזיר סמכות לנבחרי הציבור.",
    con: "עלול לאפשר חקיקה שפוגעת בזכויות."
  },
  {
    id: 28, dimension: "judiciary", direction: -1,
    text: "מינוי שופטים לבית המשפט העליון צריך להישאר בידי ועדה מקצועית ולא להפוך לתהליך פוליטי.",
    explanation: "כיום ועדה מיוחדת ממנה שופטים; יש הצעות להעביר סמכות זו לממשלה.",
    pro: "שומר על עצמאות השפיטה.",
    con: "הרכב הוועדה עצמה הוא מחלוקת."
  },
  {
    id: 29, dimension: "judiciary", direction: -1,
    text: "עצמאות מערכת אכיפת החוק (משטרה, פרקליטות) מהממשלה חיונית לשלטון חוק.",
    explanation: "עצמאות אכיפת החוק מונעת שימוש פוליטי בסמכויות חקירה.",
    pro: "מבטיח חקירה שוויונית ללא לחץ פוליטי.",
    con: "מורכב לשמור על עצמאות מבלי להעדר אחריותיות."
  },
  {
    id: 30, dimension: "judiciary", direction: 1,
    text: "הממשלה הנבחרת צריכה לקבל יותר שליטה על תהליכי מינוי בכירים במגזר הציבורי.",
    explanation: "מינוי בכירים כיום מבוסס על מכרזים מקצועיים; יש הצעות להגדיל מעורבות פוליטית.",
    pro: "מתאם מדיניות ממשלתית עם יישומה בפועל.",
    con: "עלול לפגוע במקצועיות ובנייטרליות המגזר הציבורי."
  }
];

// ============================================================
// DATA: DIMENSIONS CONFIG
// ============================================================
const DIMENSIONS = {
  economy: {
    label: "כלכלה",
    weight: 0.20,
    leftLabel: "כלכלה חברתית",
    rightLabel: "שוק חופשי",
    descriptions: {
      far_left: "תמיכה חזקה בהתערבות ממשלתית, רגולציה ושירותים ציבוריים נרחבים.",
      left: "נטייה לכלכלה מעורבת עם דגש על רווחה חברתית ושוויון.",
      center: "תמיכה בכלכלה מאוזנת עם מעורבות ממשלתית ושוק חופשי.",
      right: "נטייה לשוק חופשי עם פחות רגולציה והפרטה.",
      far_right: "תמיכה חזקה בשוק חופשי, מינימום התערבות ממשלתית."
    }
  },
  security: {
    label: "ביטחון ומדיניות חוץ",
    weight: 0.20,
    leftLabel: "דיפלומטיה ופשרה",
    rightLabel: "ביטחון וחוזק",
    descriptions: {
      far_left: "דגש חזק על פשרות, שיתוף פעולה בינלאומי ופתרון שתי המדינות.",
      left: "תמיכה בדיפלומטיה תוך שמירה על ביטחון.",
      center: "גישה מאוזנת הכוללת ביטחון ודיאלוג.",
      right: "עדיפות לחוזק ביטחוני ומדיניות חד-צדדית.",
      far_right: "עדיפות גבוהה לביטחון לאומי על פני פשרות דיפלומטיות."
    }
  },
  religion_state: {
    label: "דת ומדינה",
    weight: 0.15,
    leftLabel: "הפרדה מלאה",
    rightLabel: "שמירה על אופי יהודי",
    descriptions: {
      far_left: "תמיכה חזקה בהפרדת דת ומדינה, נישואין אזרחיים וגיוס חרדים.",
      left: "נטייה לפלורליזם דתי ופחות מונופול לרבנות.",
      center: "תמיכה בשמירה על סטטוס קוו עם שינויים מתונים.",
      right: "שמירה על הסטטוס קוו ואופי יהודי של המרחב הציבורי.",
      far_right: "תמיכה חזקה בזהות יהודית-דתית של המדינה."
    }
  },
  civil_liberties: {
    label: "חירויות הפרט",
    weight: 0.15,
    leftLabel: "חירויות ליברליות",
    rightLabel: "ביטחון ומסורת",
    descriptions: {
      far_left: "תמיכה חזקה בזכויות אדם, שוויון מלא ועצמאות שיפוטית.",
      left: "נטייה לחירויות אזרחיות ולהגנה על מיעוטים.",
      center: "איזון בין חירות הפרט לצרכי הביטחון.",
      right: "נטייה לעדיפות ביטחון ומסורת על פני הרחבת חירויות.",
      far_right: "תמיכה בהגבלות על חופש הביטוי לטובת ביטחון לאומי."
    }
  },
  social_policy: {
    label: "מדיניות חברתית",
    weight: 0.15,
    leftLabel: "שוויון חברתי",
    rightLabel: "אחריות אישית",
    descriptions: {
      far_left: "תמיכה חזקה ברווחה חברתית, צמצום פערים והעדפה מתקנת.",
      left: "דגש על שוויון הזדמנויות ורשת בטחון חברתית.",
      center: "שילוב אחריות אישית עם תמיכה חברתית.",
      right: "דגש על אחריות אישית עם רשת בטחון מוגבלת.",
      far_right: "הדגשת חזקה על אחריות אישית ומיקוד בצמצום הוצאות סוציאליות."
    }
  },
  judiciary: {
    label: "מערכת המשפט ומוסדות",
    weight: 0.15,
    leftLabel: "עצמאות שיפוטית",
    rightLabel: "עליונות נבחרי הציבור",
    descriptions: {
      far_left: "תמיכה חזקה בעצמאות מלאה של בתי המשפט והמגזר הציבורי.",
      left: "תמיכה בביקורת שיפוטית ושמירה על עצמאות מוסדות.",
      center: "איזון בין עצמאות שיפוטית לאחריותיות דמוקרטית.",
      right: "נטייה להגביל ביקורת שיפוטית ולחזק את כוח הנבחרים.",
      far_right: "תמיכה חזקה בעליונות הכנסת על בתי המשפט."
    }
  }
};

// ============================================================
// DATA: PARTIES
// ============================================================
// NOTE: ציונים אלה הם הערכות ראשוניות בלבד ויש לעדכן אותן.
// כל ציון: 1 = שמאל, 5 = ימין
// לעדכון: שנה את הערכים תחת `scores`
// ============================================================
const PARTIES = [
  {
    id: "likud",
    party_name: "הליכוד",
    is_active: true,
    last_updated: "2026-03-13",
    scores: { economy: 4.0, security: 4.8, religion_state: 3.8, civil_liberties: 3.5, social_policy: 3.5, judiciary: 4.5 },
    rationale: {
      economy: "מגמת ליברליזם כלכלי עם יוזמות פרטיות", security: "קשת ביטחוני ימנית",
      religion_state: "שמירה על סטטוס קוו", civil_liberties: "דגש ביטחוני",
      social_policy: "אחריות אישית עם רשתות בטחון", judiciary: "מאמץ לרפורמה שיפוטית"
    },
    source_notes: "מבוסס על מצע 2022 ועמדות ציבוריות"
  },
  {
    id: "yesh_atid",
    party_name: "יש עתיד",
    is_active: true,
    last_updated: "2026-03-13",
    scores: { economy: 3.8, security: 3.5, religion_state: 2.0, civil_liberties: 2.5, social_policy: 3.0, judiciary: 2.0 },
    rationale: {
      economy: "כלכלה מעורבת עם דגש על מעמד הביניים", security: "מרכז-ימין ביטחוני",
      religion_state: "הפרדה ונישואין אזרחיים", civil_liberties: "תמיכה בזכויות",
      social_policy: "פוליטיקת מרכז", judiciary: "התנגדות לרפורמה שיפוטית"
    },
    source_notes: "מבוסס על עמדות 2022-2024"
  },
  {
    id: "mamlachtit",
    party_name: "המחנה הממלכתי",
    is_active: true,
    last_updated: "2026-03-13",
    scores: { economy: 3.5, security: 4.0, religion_state: 2.5, civil_liberties: 2.5, social_policy: 3.0, judiciary: 2.0 },
    rationale: {
      economy: "מרכז כלכלי", security: "ביטחוני חזק",
      religion_state: "חילוני-מתון", civil_liberties: "מרכז",
      social_policy: "מרכז", judiciary: "עצמאות שיפוטית"
    },
    source_notes: "מבוסס על עמדות גנץ 2023-2024"
  },
  {
    id: "labor",
    party_name: "העבודה",
    is_active: true,
    last_updated: "2026-03-13",
    scores: { economy: 2.0, security: 3.0, religion_state: 2.0, civil_liberties: 1.8, social_policy: 1.8, judiciary: 1.8 },
    rationale: {
      economy: "שמאל כלכלי קלאסי", security: "תמיכה בדיפלומטיה",
      religion_state: "פלורליזם דתי", civil_liberties: "זכויות נרחבות",
      social_policy: "שוויון חברתי", judiciary: "עצמאות שיפוטית"
    },
    source_notes: "מבוסס על מצע ועמדות 2021-2024"
  },
  {
    id: "meretz",
    party_name: "מרצ",
    is_active: true,
    last_updated: "2026-03-13",
    scores: { economy: 1.5, security: 2.0, religion_state: 1.5, civil_liberties: 1.2, social_policy: 1.5, judiciary: 1.5 },
    rationale: {
      economy: "שמאל חברתי", security: "שמאל דיפלומטי",
      religion_state: "הפרדה מלאה", civil_liberties: "זכויות נרחבות ביותר",
      social_policy: "שוויון", judiciary: "עצמאות שיפוטית חזקה"
    },
    source_notes: "מבוסס על מצע ועמדות היסטוריות"
  },
  {
    id: "shas",
    party_name: "ש\"ס",
    is_active: true,
    last_updated: "2026-03-13",
    scores: { economy: 2.5, security: 4.5, religion_state: 4.8, civil_liberties: 4.0, social_policy: 2.5, judiciary: 4.0 },
    rationale: {
      economy: "דגש חברתי-דתי", security: "ימין ביטחוני",
      religion_state: "הלכה ומדינה", civil_liberties: "ערכי מסורת",
      social_policy: "דאגה לאוכלוסייה ספרדית", judiciary: "ריכוז כוח"
    },
    source_notes: "מבוסס על עמדות מסורתיות"
  },
  {
    id: "utj",
    party_name: "יהדות התורה",
    is_active: true,
    last_updated: "2026-03-13",
    scores: { economy: 2.5, security: 4.0, religion_state: 5.0, civil_liberties: 4.5, social_policy: 2.5, judiciary: 4.5 },
    rationale: {
      economy: "כלכלה קהילתית", security: "ימין ביטחוני",
      religion_state: "מקסימום שמירת הלכה", civil_liberties: "ערכים חרדים",
      social_policy: "דאגה לחרדים", judiciary: "תמיכה ברפורמה"
    },
    source_notes: "מבוסס על עמדות מסורתיות"
  },
  {
    id: "otzma",
    party_name: "עוצמה יהודית",
    is_active: true,
    last_updated: "2026-03-13",
    scores: { economy: 4.2, security: 5.0, religion_state: 4.5, civil_liberties: 4.8, social_policy: 3.5, judiciary: 4.8 },
    rationale: {
      economy: "לאומי-כלכלי", security: "ימין קיצוני",
      religion_state: "ציוני-דתי", civil_liberties: "ביטחון לאומי",
      social_policy: "לאומי", judiciary: "עליונות הכנסת"
    },
    source_notes: "מבוסס על עמדות 2022-2024"
  },
  {
    id: "hadash",
    party_name: "חד\"ש",
    is_active: true,
    last_updated: "2026-03-13",
    scores: { economy: 1.3, security: 1.5, religion_state: 1.5, civil_liberties: 1.3, social_policy: 1.3, judiciary: 1.5 },
    rationale: {
      economy: "שמאל כלכלי", security: "שלום ודיאלוג",
      religion_state: "פלורליזם", civil_liberties: "זכויות נרחבות",
      social_policy: "שוויון", judiciary: "עצמאות שיפוטית"
    },
    source_notes: "מבוסס על עמדות היסטוריות"
  },
  {
    id: "religious_zionism",
    party_name: "הציונות הדתית",
    is_active: true,
    last_updated: "2026-03-13",
    scores: { economy: 4.0, security: 5.0, religion_state: 4.5, civil_liberties: 4.2, social_policy: 3.5, judiciary: 4.8 },
    rationale: {
      economy: "שוק חופשי לאומי", security: "ימין קיצוני",
      religion_state: "ציוני-דתי", civil_liberties: "ביטחון ולאומיות",
      social_policy: "לאומי", judiciary: "עליונות הכנסת"
    },
    source_notes: "מבוסס על עמדות 2022-2024"
  }
];

// ============================================================
// SCORING LOGIC
// ============================================================
// חישוב ציונים: כל תשובה היא 1-5.
// אם direction=1 (ימין): הציון עובר ישירות
// אם direction=-1 (שמאל): הציון מתהפך: score = 6 - answer
// ממוצע לכל תחום = ממוצע הציונים המנורמלים
// ============================================================
function calculateScores(answers) {
  const dimensionScores = {};
  Object.keys(DIMENSIONS).forEach(dim => { dimensionScores[dim] = []; });

  QUESTIONS.forEach(q => {
    const answer = answers[q.id];
    if (answer === undefined) return;
    // answer: 1=agree, 5=disagree
    // direction 1 (right-leaning question): agree(1) = right = high score → normalize to 6-answer
    // direction -1 (left-leaning question): agree(1) = left = low score → normalize to answer
    const normalized = q.direction === 1 ? (6 - answer) : answer;
    dimensionScores[q.dimension].push(normalized);
  });

  const scores = {};
  Object.keys(DIMENSIONS).forEach(dim => {
    const vals = dimensionScores[dim];
    scores[dim] = vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : 3;
  });

  const overall = Object.keys(DIMENSIONS).reduce((sum, dim) => {
    return sum + scores[dim] * DIMENSIONS[dim].weight;
  }, 0);

  return { dimension: scores, overall };
}

function getIdeologicalLabel(score) {
  if (score <= 1.8) return "far_left";
  if (score <= 2.6) return "left";
  if (score <= 3.4) return "center";
  if (score <= 4.2) return "right";
  return "far_right";
}

function getOverallLabel(score) {
  if (score <= 1.8) return { label: "שמאל", color: "#4f8ef7", position: 0 };
  if (score <= 2.4) return { label: "מרכז-שמאל", color: "#7ab3f5", position: 20 };
  if (score <= 3.6) return { label: "מרכז", color: "#8b8b8b", position: 50 };
  if (score <= 4.2) return { label: "מרכז-ימין", color: "#f59d7a", position: 80 };
  return { label: "ימין", color: "#f46b4f", position: 100 };
}

// ============================================================
// POLITICAL TYPE LOGIC
// ============================================================
function getPoliticalType(scores, overall) {
  const { economy, security, religion_state, civil_liberties, judiciary } = scores;
  
  if (overall >= 4.0) {
    if (religion_state >= 4.0) return "לאומי-דתי";
    return "ימין ביטחוני";
  }
  if (overall <= 2.0) {
    if (economy <= 2.0) return "שמאל חברתי";
    return "ליברל אזרחי";
  }
  if (security >= 4.0 && civil_liberties <= 2.5) return "ימין ביטחוני עם נטייה אזרחית ליברלית";
  if (economy >= 3.8 && religion_state <= 2.5) return "ליברל כלכלי חילוני";
  if (economy <= 2.5 && security >= 3.5) return "שמאל חברתי עם עמדה ביטחונית מורכבת";
  if (Math.abs(overall - 3) < 0.4) return "מרכז פרגמטי";
  if (overall < 3) return "מרכז-שמאל עם עמדות מעורבות";
  return "מרכז-ימין עם גישה מאוזנת";
}

function getSummary(scores, overall) {
  const label = getOverallLabel(overall);
  const type = getPoliticalType(scores, overall);
  const { economy, security, religion_state, civil_liberties } = scores;
  
  let summary = `הפרופיל שלך ממוקם ב${label.label} על הסקאלה הפוליטית הישראלית. `;
  
  if (economy > security + 0.8) summary += "בתחום הכלכלי, עמדותיך נוטות לשוק חופשי יותר מאשר בתחומים אחרים. ";
  else if (security > economy + 0.8) summary += "הביטחון הלאומי נמצא במרכז עמדותיך, מעבר לעמדות הכלכליות שלך. ";
  
  if (religion_state <= 2.0) summary += "בשאלות דת ומדינה, את/ה תומך/ת בהפרדה ברורה. ";
  else if (religion_state >= 4.0) summary += "בשאלות דת ומדינה, את/ה מעדיף/ה לשמר את הקשר בין ממסד דתי ומדינה. ";
  
  if (civil_liberties <= 2.0) summary += "עמדותיך בתחום חירויות הפרט מצביעות על תמיכה חזקה בזכויות אדם. ";
  
  summary += `בסך הכל, הפרופיל שלך מאפיין ${type}.`;
  return summary;
}

// ============================================================
// PARTY MATCHING LOGIC
// ============================================================
function matchParties(userScores) {
  const weights = Object.fromEntries(Object.entries(DIMENSIONS).map(([k, v]) => [k, v.weight]));
  
  return PARTIES
    .filter(p => p.is_active)
    .map(party => {
      const dist = Object.keys(party.scores).reduce((sum, dim) => {
        const diff = userScores[dim] - party.scores[dim];
        return sum + weights[dim] * diff * diff;
      }, 0);
      return { ...party, distance: Math.sqrt(dist), match: Math.max(0, 100 - dist * 30) };
    })
    .sort((a, b) => a.distance - b.distance)
    .slice(0, 3);
}

// ============================================================
// COMPONENTS
// ============================================================

const ScaleBar = ({ score, leftLabel, rightLabel }) => {
  const pct = ((score - 1) / 4) * 100;
  return (
    <div style={{ direction: "ltr" }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#888", marginBottom: 4 }}>
        <span style={{ direction: "rtl" }}>{leftLabel}</span>
        <span style={{ direction: "rtl" }}>{rightLabel}</span>
      </div>
      <div style={{ height: 6, background: "linear-gradient(to right, #4f8ef7, #aaa, #f46b4f)", borderRadius: 3, position: "relative" }}>
        <div style={{
          position: "absolute", top: -5, width: 16, height: 16, borderRadius: "50%",
          background: "#fff", border: "2px solid #1a1a2e", boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
          left: `${pct}%`, transform: "translateX(-50%)", transition: "left 0.5s"
        }} />
      </div>
    </div>
  );
};

// ============================================================
// SCREENS
// ============================================================

function WelcomeScreen({ onStart }) {
  return (
    <div style={{
      minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center",
      justifyContent: "center", padding: 24, background: "linear-gradient(135deg, #0f0c29, #1a1a3e, #1e3a5f)",
      direction: "rtl", fontFamily: "'Heebo', sans-serif"
    }}>
      <div style={{ maxWidth: 480, width: "100%", textAlign: "center" }}>
        <div style={{ marginBottom: 32 }}>
          <div style={{
            width: 72, height: 72, borderRadius: "50%", margin: "0 auto 20px",
            background: "linear-gradient(135deg, #4f8ef7, #f46b4f)",
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32
          }}>🗳️</div>
          <h1 style={{ color: "#fff", fontSize: 28, fontWeight: 700, margin: "0 0 8px", lineHeight: 1.3 }}>
            מה העמדה הפוליטית שלך?
          </h1>
          <p style={{ color: "#a0b4cc", fontSize: 16, margin: 0, lineHeight: 1.6 }}>
            שאלון מאוזן שיעזור לך להבין את מיקומך על הסקאלה הפוליטית הישראלית
          </p>
        </div>

        <div style={{
          background: "rgba(255,255,255,0.06)", borderRadius: 16, padding: 24, marginBottom: 28,
          border: "1px solid rgba(255,255,255,0.1)"
        }}>
          {[
            { icon: "📋", text: "30 שאלות ב-6 תחומים" },
            { icon: "⚖️", text: "שאלות מנוסחות באיזון ובניטרליות" },
            { icon: "📊", text: "ניתוח מפורט ומדויק בסוף" },
            { icon: "🔒", text: "לא נשמר מידע אישי" }
          ].map((item, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: i < 3 ? 16 : 0, textAlign: "right" }}>
              <span style={{ fontSize: 20 }}>{item.icon}</span>
              <span style={{ color: "#d0dff0", fontSize: 15 }}>{item.text}</span>
            </div>
          ))}
        </div>

        <button onClick={onStart} style={{
          width: "100%", padding: "16px 32px", borderRadius: 14, border: "none",
          background: "linear-gradient(135deg, #4f8ef7, #6c4ef7)", color: "#fff",
          fontSize: 17, fontWeight: 700, cursor: "pointer", fontFamily: "'Heebo', sans-serif",
          boxShadow: "0 8px 24px rgba(79,142,247,0.4)", transition: "transform 0.15s",
          letterSpacing: 0.5
        }}>
          התחל בשאלון
        </button>
        <p style={{ color: "#607080", fontSize: 12, marginTop: 16 }}>
          כ-8 דקות • לא נדרשת הרשמה
        </p>
      </div>
    </div>
  );
}

function QuestionScreen({ answers, onAnswer, onBack, onFinish }) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selected, setSelected] = useState(null);
  const [animating, setAnimating] = useState(false);

  const q = QUESTIONS[currentIdx];
  const total = QUESTIONS.length;
  const progress = ((currentIdx) / total) * 100;

  useEffect(() => {
    setSelected(answers[q.id] || null);
  }, [currentIdx]);

  const goNext = () => {
    if (!selected) return;
    onAnswer(q.id, selected);
    setAnimating(true);
    setTimeout(() => {
      setAnimating(false);
      if (currentIdx < total - 1) {
        setCurrentIdx(currentIdx + 1);
      } else {
        onFinish({ ...answers, [q.id]: selected });
      }
    }, 200);
  };

  const goPrev = () => {
    if (currentIdx > 0) {
      onAnswer(q.id, selected);
      setCurrentIdx(currentIdx - 1);
    } else {
      onBack();
    }
  };

  const dimLabel = DIMENSIONS[q.dimension]?.label;
  const labels = ["מסכים מאוד", "מסכים", "ניטרלי", "לא מסכים", "לא מסכים בכלל"];
  const colors = ["#4f8ef7", "#7ab3f5", "#8b8b9b", "#f5a77a", "#f46b4f"];

  return (
    <div style={{
      minHeight: "100vh", background: "#0f1220", direction: "rtl",
      fontFamily: "'Heebo', sans-serif", display: "flex", flexDirection: "column"
    }}>
      {/* Header */}
      <div style={{ padding: "16px 20px", background: "#151828", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ maxWidth: 600, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <span style={{ color: "#506070", fontSize: 13 }}>שאלה {currentIdx + 1} מתוך {total}</span>
            <span style={{
              background: "rgba(79,142,247,0.15)", color: "#4f8ef7", borderRadius: 20,
              padding: "4px 12px", fontSize: 12, fontWeight: 600
            }}>{dimLabel}</span>
          </div>
          <div style={{ height: 4, background: "#1e2435", borderRadius: 2, overflow: "hidden" }}>
            <div style={{
              height: "100%", borderRadius: 2, transition: "width 0.4s ease",
              width: `${progress}%`, background: "linear-gradient(90deg, #4f8ef7, #6c4ef7)"
            }} />
          </div>
        </div>
      </div>

      {/* Question */}
      <div style={{ flex: 1, padding: "24px 20px", display: "flex", flexDirection: "column" }}>
        <div style={{ maxWidth: 600, margin: "0 auto", width: "100%" }}>
          <div style={{
            opacity: animating ? 0 : 1, transition: "opacity 0.2s",
            background: "#151828", borderRadius: 20, padding: 24, marginBottom: 20,
            border: "1px solid rgba(255,255,255,0.07)"
          }}>
            <p style={{ color: "#e8f0f8", fontSize: 18, lineHeight: 1.6, margin: 0, fontWeight: 500 }}>
              {q.text}
            </p>

            <div style={{
              marginTop: 16, padding: 14, background: "rgba(255,255,255,0.03)",
              borderRadius: 12, borderRight: "3px solid #4f8ef7"
            }}>
              <p style={{ color: "#7090aa", fontSize: 13, lineHeight: 1.5, margin: "0 0 8px", fontWeight: 600 }}>
                הקשר: {q.explanation}
              </p>
              <p style={{ color: "#507090", fontSize: 12, lineHeight: 1.5, margin: 0 }}>
                ✅ <span style={{ color: "#4fa"}}>{q.pro}</span>
              </p>
              <p style={{ color: "#507090", fontSize: 12, lineHeight: 1.5, margin: "4px 0 0" }}>
                ⚠️ <span style={{ color: "#fa9"}}>{q.con}</span>
              </p>
            </div>
          </div>

          {/* Answer buttons */}
          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>
            {labels.map((label, i) => {
              const val = i + 1;
              const isSelected = selected === val;
              return (
                <button key={val} onClick={() => setSelected(val)} style={{
                  padding: "14px 20px", borderRadius: 12, border: `2px solid ${isSelected ? colors[i] : "rgba(255,255,255,0.08)"}`,
                  background: isSelected ? `${colors[i]}22` : "rgba(255,255,255,0.03)",
                  color: isSelected ? colors[i] : "#a0b8cc", fontSize: 15, cursor: "pointer",
                  fontFamily: "'Heebo', sans-serif", textAlign: "right", fontWeight: isSelected ? 700 : 400,
                  transition: "all 0.15s", display: "flex", alignItems: "center", gap: 12
                }}>
                  <span style={{
                    width: 24, height: 24, borderRadius: "50%", border: `2px solid ${isSelected ? colors[i] : "#334"}`,
                    display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                    background: isSelected ? colors[i] : "transparent", fontSize: 12, color: "#fff"
                  }}>
                    {isSelected ? "✓" : ""}
                  </span>
                  {label}
                </button>
              );
            })}
          </div>

          <div style={{ display: "flex", gap: 12 }}>
            <button onClick={goPrev} style={{
              padding: "14px 20px", borderRadius: 12, border: "1px solid rgba(255,255,255,0.1)",
              background: "transparent", color: "#607080", fontSize: 15, cursor: "pointer",
              fontFamily: "'Heebo', sans-serif"
            }}>← חזור</button>
            <button onClick={goNext} disabled={!selected} style={{
              flex: 1, padding: "14px 20px", borderRadius: 12, border: "none",
              background: selected ? "linear-gradient(135deg, #4f8ef7, #6c4ef7)" : "#1e2435",
              color: selected ? "#fff" : "#405060", fontSize: 16, cursor: selected ? "pointer" : "default",
              fontFamily: "'Heebo', sans-serif", fontWeight: 700, transition: "all 0.2s",
              boxShadow: selected ? "0 4px 16px rgba(79,142,247,0.3)" : "none"
            }}>
              {currentIdx < total - 1 ? "הבא ←" : "לתוצאות ←"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ResultsScreen({ answers, onRestart }) {
  const { dimension: dimScores, overall } = calculateScores(answers);
  const overallInfo = getOverallLabel(overall);
  const politicalType = getPoliticalType(dimScores, overall);
  const summary = getSummary(dimScores, overall);
  const topParties = matchParties(dimScores);

  const radarData = Object.entries(DIMENSIONS).map(([key, dim]) => ({
    subject: dim.label,
    score: dimScores[key],
    fullMark: 5
  }));

  const pct = overallInfo.position;

  return (
    <div style={{
      minHeight: "100vh", background: "#0a0d1a", direction: "rtl",
      fontFamily: "'Heebo', sans-serif", padding: "0 0 60px"
    }}>
      {/* Hero */}
      <div style={{
        background: "linear-gradient(135deg, #0f0c29, #1a1a3e, #1e3a5f)",
        padding: "40px 24px 60px", textAlign: "center"
      }}>
        <div style={{ maxWidth: 600, margin: "0 auto" }}>
          <div style={{
            display: "inline-block", background: "rgba(255,255,255,0.08)", borderRadius: 24,
            padding: "8px 20px", marginBottom: 20, color: "#a0b8cc", fontSize: 13
          }}>
            הפרופיל הפוליטי שלך
          </div>
          <h1 style={{ color: "#fff", fontSize: 36, fontWeight: 800, margin: "0 0 8px" }}>
            {politicalType}
          </h1>
          <div style={{
            display: "inline-block", marginTop: 8, background: `${overallInfo.color}22`,
            border: `1px solid ${overallInfo.color}66`, borderRadius: 20,
            padding: "6px 20px", color: overallInfo.color, fontSize: 16, fontWeight: 600
          }}>
            {overallInfo.label}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 600, margin: "-20px auto 0", padding: "0 20px" }}>

        {/* Overall scale */}
        <div style={{
          background: "#151828", borderRadius: 20, padding: 24, marginBottom: 20,
          border: "1px solid rgba(255,255,255,0.07)", boxShadow: "0 8px 32px rgba(0,0,0,0.3)"
        }}>
          <h2 style={{ color: "#e8f0f8", fontSize: 16, fontWeight: 700, margin: "0 0 20px" }}>
            מיקומך על הסקאלה הפוליטית
          </h2>
          <div style={{ marginBottom: 12, direction: "ltr" }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#607080", marginBottom: 8 }}>
              <span>שמאל</span>
              <span>מרכז</span>
              <span>ימין</span>
            </div>
            <div style={{ height: 12, background: "linear-gradient(to right, #4f8ef7, #888, #f46b4f)", borderRadius: 6, position: "relative" }}>
              <div style={{
                position: "absolute", top: -4, width: 20, height: 20, borderRadius: "50%",
                background: "#fff", border: `3px solid ${overallInfo.color}`,
                boxShadow: `0 0 0 4px ${overallInfo.color}44`,
                left: `${pct}%`, transform: "translateX(-50%)", transition: "left 1s ease"
              }} />
            </div>
            <div style={{ textAlign: "center", marginTop: 16, color: overallInfo.color, fontSize: 18, fontWeight: 700, direction: "rtl" }}>
              {overallInfo.label} • {Number.isInteger(overall) ? overall : overall.toFixed(1)}/5
            </div>
          </div>
        </div>

        {/* Radar Chart */}
        <div style={{
          background: "#151828", borderRadius: 20, padding: 24, marginBottom: 20,
          border: "1px solid rgba(255,255,255,0.07)"
        }}>
          <h2 style={{ color: "#e8f0f8", fontSize: 16, fontWeight: 700, margin: "0 0 16px" }}>
            מפת העמדות שלך
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={radarData} margin={{ top: 20, right: 50, bottom: 20, left: 50 }}>
              <PolarGrid stroke="#1e2a3a" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: "#7090aa", fontSize: 10, fontFamily: "'Heebo', sans-serif" }} />
              <Radar name="עמדותיך" dataKey="score" stroke="#4f8ef7" fill="#4f8ef7" fillOpacity={0.25} strokeWidth={2} />
              <Tooltip
                formatter={(v) => [v.toFixed(1), "ציון"]}
                contentStyle={{ background: "#1e2a3a", border: "1px solid #334", borderRadius: 8, direction: "rtl" }}
              />
            </RadarChart>
          </ResponsiveContainer>
          <p style={{ color: "#506070", fontSize: 11, textAlign: "center", margin: "8px 0 0" }}>
            1 = שמאל | 5 = ימין
          </p>
        </div>

        {/* Dimension breakdown */}
        <div style={{
          background: "#151828", borderRadius: 20, padding: 24, marginBottom: 20,
          border: "1px solid rgba(255,255,255,0.07)"
        }}>
          <h2 style={{ color: "#e8f0f8", fontSize: 16, fontWeight: 700, margin: "0 0 20px" }}>
            פירוט לפי תחום
          </h2>
          {Object.entries(DIMENSIONS).map(([key, dim]) => {
            const score = dimScores[key];
            const label = getIdeologicalLabel(score);
            return (
              <div key={key} style={{ marginBottom: 24, paddingBottom: 24, borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                  <span style={{ color: "#e8f0f8", fontWeight: 700 }}>{dim.label}</span>
                  <span style={{ color: "#4f8ef7", fontWeight: 700, fontSize: 14 }}>
                    {Number.isInteger(score) ? score : score.toFixed(1)}/5
                  </span>
                </div>
                <ScaleBar score={score} leftLabel={dim.leftLabel} rightLabel={dim.rightLabel} />
                <p style={{ color: "#7090aa", fontSize: 13, lineHeight: 1.5, margin: "10px 0 0" }}>
                  {dim.descriptions[label]}
                </p>
              </div>
            );
          })}
        </div>

        {/* Summary */}
        <div style={{
          background: "linear-gradient(135deg, #0f1a2e, #1a2a3e)", borderRadius: 20, padding: 24, marginBottom: 20,
          border: "1px solid rgba(79,142,247,0.2)"
        }}>
          <h2 style={{ color: "#e8f0f8", fontSize: 16, fontWeight: 700, margin: "0 0 12px" }}>
            סיכום הפרופיל שלך
          </h2>
          <p style={{ color: "#a0c0d8", fontSize: 15, lineHeight: 1.7, margin: 0 }}>
            {summary}
          </p>
        </div>

        {/* Party matches */}
        <div style={{
          background: "#151828", borderRadius: 20, padding: 24, marginBottom: 20,
          border: "1px solid rgba(255,255,255,0.07)"
        }}>
          <h2 style={{ color: "#e8f0f8", fontSize: 16, fontWeight: 700, margin: "0 0 6px" }}>
            התאמה משוערת למפלגות
          </h2>
          <p style={{ color: "#506070", fontSize: 12, margin: "0 0 20px", lineHeight: 1.5 }}>
            ⚠️ ההתאמה היא הערכה בלבד, המבוססת על עמדות ציבוריות ומצעים. עמדות מפלגות עשויות להשתנות.
          </p>
          {topParties.map((party, i) => (
            <div key={party.id} style={{
              display: "flex", alignItems: "center", gap: 16, marginBottom: i < 2 ? 16 : 0,
              padding: 16, borderRadius: 14,
              background: i === 0 ? "rgba(79,142,247,0.1)" : "rgba(255,255,255,0.03)",
              border: i === 0 ? "1px solid rgba(79,142,247,0.3)" : "1px solid rgba(255,255,255,0.06)"
            }}>
              <div style={{
                width: 36, height: 36, borderRadius: "50%", flexShrink: 0,
                background: i === 0 ? "#4f8ef7" : i === 1 ? "#6c4ef7" : "#334",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "#fff", fontWeight: 800, fontSize: 16
              }}>{i + 1}</div>
              <div style={{ flex: 1 }}>
                <div style={{ color: "#e8f0f8", fontWeight: 700 }}>{party.party_name}</div>
                <div style={{ height: 4, background: "#1e2a3a", borderRadius: 2, marginTop: 6, overflow: "hidden" }}>
                  <div style={{
                    height: "100%", borderRadius: 2,
                    width: `${Math.min(100, party.match)}%`,
                    background: i === 0 ? "#4f8ef7" : i === 1 ? "#6c4ef7" : "#506080"
                  }} />
                </div>
              </div>
              <div style={{
                color: i === 0 ? "#4f8ef7" : "#607080", fontSize: 13, fontWeight: 700, flexShrink: 0
              }}>
                {Math.round(party.match)}%
              </div>
            </div>
          ))}
        </div>

        <button onClick={onRestart} style={{
          width: "100%", padding: "16px 24px", borderRadius: 14, border: "1px solid rgba(255,255,255,0.1)",
          background: "transparent", color: "#a0b8cc", fontSize: 16, cursor: "pointer",
          fontFamily: "'Heebo', sans-serif", fontWeight: 600
        }}>
          🔄 עשה את השאלון שוב
        </button>
      </div>
    </div>
  );
}

// ============================================================
// APP
// ============================================================
export default function App() {
  const [screen, setScreen] = useState("welcome");
  const [answers, setAnswers] = useState({});

  const handleAnswer = (id, val) => setAnswers(prev => ({ ...prev, [id]: val }));

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Heebo:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #0a0d1a; }
        button:active { transform: scale(0.97); }
      `}</style>
      {screen === "welcome" && <WelcomeScreen onStart={() => setScreen("quiz")} />}
      {screen === "quiz" && (
        <QuestionScreen
          answers={answers}
          onAnswer={handleAnswer}
          onBack={() => setScreen("welcome")}
          onFinish={(finalAnswers) => { setAnswers(finalAnswers); setScreen("results"); }}
        />
      )}
      {screen === "results" && (
        <ResultsScreen
          answers={answers}
          onRestart={() => { setAnswers({}); setScreen("welcome"); }}
        />
      )}
    </>
  );
}
