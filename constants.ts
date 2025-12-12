
import { RegionData, CityData } from './types';

export const APP_TITLE = "منصة مُغيث";
export const APP_SUBTITLE = "غرفة التحكم الوطنية الموحدة";

export const REGIONS_DATA: RegionData[] = [
  { region: "الرياض", cities: ["الرياض","الخرج","وادي الدواسر","القويعية","عفيف","الدوادمي","الزلفي","المجمعة","شقراء","حوطة بني تميم","الأفلاج","المزاحمية"] },
  { region: "مكة المكرمة", cities: ["مكة المكرمة","جدة","الطائف","رابغ","القنفذة","الليث","خليص","الكامل","الخرمة","رنية","تربة"] },
  { region: "المدينة المنورة", cities: ["المدينة المنورة","ينبع","العلا","بدر","الحناكية","مهد الذهب","خيبر"] },
  { region: "الشرقية", cities: ["الدمام","الخبر","الظهران","الأحساء","القطيف","حفر الباطن","الجبيل","النعيرية","الخفجي","رأس تنورة","بقيق"] },
  { region: "القصيم", cities: ["بريدة","عنيزة","الرس","البكيرية","المذنب","البدائع","الأسياح","النبهانية"] },
  { region: "عسير", cities: ["أبها","خميس مشيط","بيشة","محايل","النماص","رجال ألمع","تثليث","سراة عبيدة","أحد رفيدة"] },
  { region: "حائل", cities: ["حائل","بقعاء","الغزالة","الشنان","موقق","الحائط"] },
  { region: "الجوف", cities: ["سكاكا","دومة الجندل","القريات","طبرجل"] },
  { region: "تبوك", cities: ["تبوك","ضباء","الوجه","أملج","حقل","تيماء"] },
  { region: "جازان", cities: ["جازان","صامطة","أبو عريش","صبيا","بيش","الدرب","العارضة","فيفاء"] },
  { region: "نجران", cities: ["نجران","شرورة","حبونة","بدر الجنوب","يدمة"] },
  { region: "الباحة", cities: ["الباحة","بلجرشي","المندق","المخواة","قلوة","العقيق"] },
  { region: "الحدود الشمالية", cities: ["عرعر","طريف","رفحاء","العويقيلة"] }
];

export const CITY_COORDINATES: CityData[] = [
  // Riyadh Region
  { city: "الرياض", coords: { lat: 24.7136, lng: 46.6753 } },
  { city: "الخرج", coords: { lat: 24.1500, lng: 47.3000 } },
  { city: "وادي الدواسر", coords: { lat: 20.4667, lng: 44.8000 } },
  { city: "القويعية", coords: { lat: 24.0667, lng: 45.2667 } },
  { city: "عفيف", coords: { lat: 23.9065, lng: 42.9389 } },
  { city: "الدوادمي", coords: { lat: 24.5071, lng: 44.3924 } },
  { city: "الزلفي", coords: { lat: 26.2995, lng: 44.7988 } },
  { city: "المجمعة", coords: { lat: 25.9184, lng: 45.3615 } },
  { city: "شقراء", coords: { lat: 25.2498, lng: 45.2536 } },
  { city: "حوطة بني تميم", coords: { lat: 23.5236, lng: 46.8524 } },
  { city: "الأفلاج", coords: { lat: 22.2982, lng: 46.7333 } },
  { city: "المزاحمية", coords: { lat: 24.4717, lng: 46.2625 } },

  // Makkah Region
  { city: "مكة المكرمة", coords: { lat: 21.3891, lng: 39.8579 } },
  { city: "جدة", coords: { lat: 21.4858, lng: 39.1925 } },
  { city: "الطائف", coords: { lat: 21.2854, lng: 40.4245 } },
  { city: "رابغ", coords: { lat: 22.7986, lng: 39.0349 } },
  { city: "القنفذة", coords: { lat: 19.1281, lng: 41.0787 } },
  { city: "الليث", coords: { lat: 20.1417, lng: 40.2800 } },
  { city: "خليص", coords: { lat: 22.1466, lng: 39.3175 } },
  { city: "الكامل", coords: { lat: 22.2133, lng: 39.4853 } },
  { city: "الخرمة", coords: { lat: 21.9312, lng: 42.1643 } },
  { city: "رنية", coords: { lat: 21.2678, lng: 42.8596 } },
  { city: "تربة", coords: { lat: 21.2144, lng: 41.6339 } },

  // Madinah Region
  { city: "المدينة المنورة", coords: { lat: 24.5247, lng: 39.5692 } },
  { city: "ينبع", coords: { lat: 24.0232, lng: 38.0637 } },
  { city: "العلا", coords: { lat: 26.6032, lng: 37.9304 } },
  { city: "بدر", coords: { lat: 23.7836, lng: 38.7915 } },
  { city: "الحناكية", coords: { lat: 24.8672, lng: 40.5239 } },
  { city: "مهد الذهب", coords: { lat: 23.4981, lng: 40.8580 } },
  { city: "خيبر", coords: { lat: 25.6946, lng: 39.2905 } },

  // Eastern Region
  { city: "الدمام", coords: { lat: 26.4207, lng: 50.0888 } },
  { city: "الخبر", coords: { lat: 26.2172, lng: 50.1971 } },
  { city: "الظهران", coords: { lat: 26.2361, lng: 50.0393 } },
  { city: "الأحساء", coords: { lat: 25.3835, lng: 49.5873 } },
  { city: "القطيف", coords: { lat: 26.5652, lng: 49.9964 } },
  { city: "حفر الباطن", coords: { lat: 28.4462, lng: 45.9489 } },
  { city: "الجبيل", coords: { lat: 27.0000, lng: 49.6611 } },
  { city: "النعيرية", coords: { lat: 27.4217, lng: 48.4233 } },
  { city: "الخفجي", coords: { lat: 28.4444, lng: 48.4900 } },
  { city: "رأس تنورة", coords: { lat: 26.6433, lng: 50.1583 } },
  { city: "بقيق", coords: { lat: 25.9353, lng: 49.6692 } },

  // Qassim
  { city: "بريدة", coords: { lat: 26.3592, lng: 43.9818 } },
  { city: "عنيزة", coords: { lat: 26.0944, lng: 43.9734 } },
  { city: "الرس", coords: { lat: 25.8694, lng: 43.4973 } },
  { city: "البكيرية", coords: { lat: 26.1264, lng: 43.6603 } },
  { city: "المذنب", coords: { lat: 25.8633, lng: 44.2081 } },
  { city: "البدائع", coords: { lat: 26.0028, lng: 43.7667 } },
  { city: "الأسياح", coords: { lat: 26.5414, lng: 44.1331 } },
  { city: "النبهانية", coords: { lat: 25.8500, lng: 43.0500 } },

  // Asir
  { city: "أبها", coords: { lat: 18.2164, lng: 42.5053 } },
  { city: "خميس مشيط", coords: { lat: 18.3000, lng: 42.7333 } },
  { city: "بيشة", coords: { lat: 20.0005, lng: 42.6052 } },
  { city: "محايل", coords: { lat: 18.5544, lng: 42.0272 } },
  { city: "النماص", coords: { lat: 19.1158, lng: 42.1286 } },
  { city: "رجال ألمع", coords: { lat: 18.2045, lng: 42.2345 } },
  { city: "تثليث", coords: { lat: 19.5539, lng: 43.5131 } },
  { city: "سراة عبيدة", coords: { lat: 18.0828, lng: 43.1439 } },
  { city: "أحد رفيدة", coords: { lat: 18.1744, lng: 42.8361 } },

  // Hail
  { city: "حائل", coords: { lat: 27.5114, lng: 41.7208 } },
  { city: "بقعاء", coords: { lat: 27.8383, lng: 42.3683 } },
  { city: "الغزالة", coords: { lat: 26.9667, lng: 41.2833 } },
  { city: "الشنان", coords: { lat: 27.2667, lng: 42.4333 } },
  { city: "موقق", coords: { lat: 27.4208, lng: 41.1394 } },
  { city: "الحائط", coords: { lat: 25.9667, lng: 40.4833 } },

  // Jouf
  { city: "سكاكا", coords: { lat: 29.9697, lng: 40.1993 } },
  { city: "دومة الجندل", coords: { lat: 29.8144, lng: 39.8700 } },
  { city: "القريات", coords: { lat: 31.3318, lng: 37.3440 } },
  { city: "طبرجل", coords: { lat: 30.5000, lng: 38.2167 } },

  // Tabuk
  { city: "تبوك", coords: { lat: 28.3838, lng: 36.5550 } },
  { city: "ضباء", coords: { lat: 27.3517, lng: 35.6901 } },
  { city: "الوجه", coords: { lat: 26.2333, lng: 36.4500 } },
  { city: "أملج", coords: { lat: 25.0306, lng: 37.2625 } },
  { city: "حقل", coords: { lat: 29.2833, lng: 34.9333 } },
  { city: "تيماء", coords: { lat: 27.6333, lng: 38.5333 } },

  // Jazan
  { city: "جازان", coords: { lat: 16.8894, lng: 42.5511 } },
  { city: "صامطة", coords: { lat: 16.5986, lng: 42.9461 } },
  { city: "أبو عريش", coords: { lat: 16.9678, lng: 42.8272 } },
  { city: "صبيا", coords: { lat: 17.1495, lng: 42.6254 } },
  { city: "بيش", coords: { lat: 17.3622, lng: 42.5317 } },
  { city: "الدرب", coords: { lat: 17.7225, lng: 42.2536 } },
  { city: "العارضة", coords: { lat: 17.0667, lng: 43.0500 } },
  { city: "فيفاء", coords: { lat: 17.2667, lng: 43.1000 } },

  // Najran
  { city: "نجران", coords: { lat: 17.4917, lng: 44.1322 } },
  { city: "شرورة", coords: { lat: 17.4811, lng: 47.1128 } },
  { city: "حبونة", coords: { lat: 17.8444, lng: 44.0722 } },
  { city: "بدر الجنوب", coords: { lat: 17.7833, lng: 43.8333 } },
  { city: "يدمة", coords: { lat: 18.0667, lng: 44.0167 } },

  // Baha
  { city: "الباحة", coords: { lat: 20.0129, lng: 41.4677 } },
  { city: "بلجرشي", coords: { lat: 19.8594, lng: 41.5586 } },
  { city: "المندق", coords: { lat: 20.1558, lng: 41.2858 } },
  { city: "المخواة", coords: { lat: 19.7850, lng: 41.4344 } },
  { city: "قلوة", coords: { lat: 19.9500, lng: 41.3333 } },
  { city: "العقيق", coords: { lat: 20.2667, lng: 41.6500 } },

  // Northern Borders
  { city: "عرعر", coords: { lat: 30.9753, lng: 41.0381 } },
  { city: "طريف", coords: { lat: 31.6725, lng: 38.6637 } },
  { city: "رفحاء", coords: { lat: 29.6267, lng: 43.4933 } },
  { city: "العويقيلة", coords: { lat: 30.1333, lng: 42.2167 } }
];

export const MALE_NAMES = [
  "أحمد محمد", "محمد فهد", "خالد سالم", "سلطان عبدالله", 
  "عبدالعزيز ناصر", "فهد صالح", "عبدالله إبراهيم", "سعود عبدالعزيز",
  "ياسر علي", "عمر سليمان", "بدر عبدالرحمن", "تركي محمد", "نايف سعد", "مشعل حمد"
];

export const FEMALE_NAMES = [
  "نورة محمد", "سارة خالد", "فاطمة علي", "مريم عبدالله",
  "لطيفة حمد", "ريم سعد", "حصة صالح", "جواهر عبدالعزيز",
  "أميرة فهد", "هند سليمان", "العنود نايف", "منى إبراهيم", "لولوة سعود", "مها عبدالرحمن"
];

export const MOCK_SOURCES = ["منصة أبشر", "نظام مُغيث", "اتصال هاتفي"];
export const MOCK_STATUSES = ["بلاغ جديد", "قيد البحث", "تم العثور عليه – حي", "تم العثور عليه – متوفى"];
export const RISK_LEVELS = ["منخفض", "متوسط", "مرتفع", "حرج"];
export const TERRAINS = ["وادي", "صحراء", "جبال", "سهل مفتوح", "منطقة حضرية"];
export const WEATHER_CONTEXTS = ["أمطار", "سيول", "أجواء مستقرة", "عاصفة ترابية"];
export const DISEASES = ["سكري", "ضغط", "قلب", "لا يوجد", "ربو", "صرع"];

export const SENSOR_METRICS = [
  "حرارة المكان", "حركة الأجسام", "مرور المركبات", "تغير مناخي مفاجئ"
];

export const COLORS = {
  primary: "#3F4226",
  primary_light: "#4A4D2C",
  text_main: "#FFFFFF",
  text_muted: "#D1D4C8",
  danger: "#FF4C4C",
  warning: "#EEDB6A",
  success: "#5EE178",
  info: "#5EC8EA",
  ai_purple: "#A365F8"
};
