
import { RegionData, CityData } from './types';

export const APP_TITLE = "منصة مُغيث";
export const APP_SUBTITLE = "غرفة التحكم الوطنية الموحدة";

export const MOCK_SOURCES = [
  "منصة أبشر", "نظام مُغيث", "اتصال هاتفي", "دورية أمنية", "بلاغ مواطن", "مركز العمليات 911"
];

export const MOCK_STATUSES = [
  "بلاغ جديد", "قيد البحث", "قيد المتابعة", "تم العثور عليه – حي", "تم العثور عليه – متوفى", "مغلق"
];

export const TERRAINS = [
  "وادي", "صحراء", "جبال", "سهل مفتوح", "منطقة حضرية", "طرق برية"
];

export const WEATHER_CONTEXTS = [
  "أمطار", "سيول", "أجواء مستقرة", "عاصفة ترابية", "رياح قوية", "ضباب كثيف", "إجهاد حراري", "موجة حر"
];

export const DISEASES = [
  "لا يوجد", "سكري", "ضغط", "قلب", "ربو", "صرع", "زهايمر"
];

// FULL KSA REGIONS SIMULATION
export const REGIONS_DATA: RegionData[] = [
  { 
    region: "منطقة الرياض", 
    governorates: [
      { name: "إمارة منطقة الرياض", cities: ["الرياض", "الدرعية", "العمارية"] },
      { name: "محافظة الخرج", cities: ["الخرج", "الدلم", "الهياثم"] },
      { name: "محافظة وادي الدواسر", cities: ["وادي الدواسر", "السليل", "الخماسين"] },
      { name: "محافظة القويعية", cities: ["القويعية", "رويضة العرض", "حلبان"] },
      { name: "محافظة المجمعة", cities: ["المجمعة", "الأرطاوية", "تمير"] },
      { name: "محافظة الزلفي", cities: ["الزلفي"] },
      { name: "محافظة شقراء", cities: ["شقراء", "أشيقر"] },
      { name: "محافظة عفيف", cities: ["عفيف"] },
      { name: "محافظة الدوادمي", cities: ["الدوادمي", "البجادية", "نفي"] }
    ]
  },
  { 
    region: "منطقة مكة المكرمة", 
    governorates: [
      { name: "العاصمة المقدسة", cities: ["مكة المكرمة", "الجموم", "بحرة"] },
      { name: "محافظة جدة", cities: ["جدة", "ذهبان", "ثول"] },
      { name: "محافظة الطائف", cities: ["الطائف", "الهدا", "الشفا", "الحوية"] },
      { name: "محافظة القنفذة", cities: ["القنفذة", "المظيلف", "القوز"] },
      { name: "محافظة الليث", cities: ["الليث", "غميقة"] },
      { name: "محافظة رابغ", cities: ["رابغ", "مستورة"] }
    ]
  },
  { 
    region: "منطقة المدينة المنورة", 
    governorates: [
      { name: "إمارة المدينة المنورة", cities: ["المدينة المنورة", "أبيار الماشي"] },
      { name: "محافظة ينبع", cities: ["ينبع", "ينبع الصناعية", "ينبع النخل"] },
      { name: "محافظة العلا", cities: ["العلا", "مغيرا"] },
      { name: "محافظة بدر", cities: ["بدر", "الرايس"] }
    ]
  },
  { 
    region: "المنطقة الشرقية", 
    governorates: [
      { name: "أمانة المنطقة الشرقية", cities: ["الدمام", "الظهران", "الخبر"] },
      { name: "محافظة الأحساء", cities: ["الأحساء", "الهفوف", "المبرز", "العيون"] },
      { name: "محافظة حفر الباطن", cities: ["حفر الباطن", "القيصومة", "الرقعي"] },
      { name: "محافظة الجبيل", cities: ["الجبيل", "الجبيل الصناعية"] }
    ]
  },
  { 
    region: "منطقة القصيم", 
    governorates: [
      { name: "إمارة منطقة القصيم", cities: ["بريدة", "البصر"] },
      { name: "محافظة عنيزة", cities: ["عنيزة", "العوشزية"] },
      { name: "محافظة الرس", cities: ["الرس", "قصر ابن عقيل"] },
      { name: "محافظة البكيرية", cities: ["البكيرية", "الهلالية"] }
    ]
  },
  { 
    region: "منطقة عسير", 
    governorates: [
      { name: "إمارة منطقة عسير", cities: ["أبها", "السودة"] },
      { name: "محافظة خميس مشيط", cities: ["خميس مشيط", "تندحة"] },
      { name: "محافظة بيشة", cities: ["بيشة", "الحازمي"] },
      { name: "محافظة النماص", cities: ["النماص", "تنومة"] }
    ]
  },
  { 
    region: "منطقة حائل", 
    governorates: [
      { name: "إمارة منطقة حائل", cities: ["حائل", "جبة"] },
      { name: "محافظة بقعاء", cities: ["بقعاء", "تربة"] }
    ]
  },
  { 
    region: "منطقة تبوك", 
    governorates: [
      { name: "إمارة منطقة تبوك", cities: ["تبوك", "بير بن هرماس"] },
      { name: "محافظة ضباء", cities: ["ضباء", "شرما"] },
      { name: "محافظة الوجه", cities: ["الوجه"] },
      { name: "محافظة أملج", cities: ["أملج"] }
    ]
  },
  { 
    region: "منطقة جازان", 
    governorates: [
      { name: "إمارة منطقة جازان", cities: ["جازان", "أبو عريش"] },
      { name: "محافظة صبيا", cities: ["صبيا"] },
      { name: "محافظة فيفاء", cities: ["فيفاء"] },
      { name: "محافظة جزر فرسان", cities: ["فرسان"] }
    ]
  },
  { 
    region: "منطقة نجران", 
    governorates: [
      { name: "إمارة منطقة نجران", cities: ["نجران", "بئر عسكر"] },
      { name: "محافظة شرورة", cities: ["شرورة", "الوديعة"] }
    ]
  },
  { 
    region: "منطقة الباحة", 
    governorates: [
      { name: "إمارة منطقة الباحة", cities: ["الباحة", "الأطاولة"] },
      { name: "محافظة بلجرشي", cities: ["بلجرشي"] },
      { name: "محافظة المخواة", cities: ["المخواة"] }
    ]
  },
  { 
    region: "منطقة الجوف", 
    governorates: [
      { name: "إمارة منطقة الجوف", cities: ["سكاكا", "قارا"] },
      { name: "محافظة دومة الجندل", cities: ["دومة الجندل"] },
      { name: "محافظة القريات", cities: ["القريات"] }
    ]
  },
  { 
    region: "منطقة الحدود الشمالية", 
    governorates: [
      { name: "إمارة منطقة الحدود الشمالية", cities: ["عرعر", "جديدة عرعر"] },
      { name: "محافظة طريف", cities: ["طريف"] },
      { name: "محافظة رفحاء", cities: ["رفحاء"] }
    ]
  }
];

export const CITY_COORDINATES: CityData[] = [
  // Riyadh Region
  { city: "الرياض", coords: { lat: 24.7136, lng: 46.6753 } },
  { city: "الدرعية", coords: { lat: 24.7431, lng: 46.5746 } },
  { city: "العمارية", coords: { lat: 24.8100, lng: 46.4300 } },
  { city: "الخرج", coords: { lat: 24.1500, lng: 47.3000 } },
  { city: "الدلم", coords: { lat: 23.9922, lng: 47.1606 } },
  { city: "الهياثم", coords: { lat: 24.2167, lng: 47.1833 } },
  { city: "وادي الدواسر", coords: { lat: 20.4667, lng: 44.8000 } },
  { city: "السليل", coords: { lat: 20.4600, lng: 45.5700 } },
  { city: "الخماسين", coords: { lat: 20.4900, lng: 44.7500 } },
  { city: "القويعية", coords: { lat: 24.0667, lng: 45.2667 } },
  { city: "رويضة العرض", coords: { lat: 23.8667, lng: 44.7500 } },
  { city: "حلبان", coords: { lat: 23.5167, lng: 44.3833 } },
  { city: "المجمعة", coords: { lat: 25.9184, lng: 45.3615 } },
  { city: "الأرطاوية", coords: { lat: 26.5133, lng: 45.3364 } },
  { city: "تمير", coords: { lat: 25.7167, lng: 45.8667 } },
  { city: "الزلفي", coords: { lat: 26.2995, lng: 44.7988 } },
  { city: "شقراء", coords: { lat: 25.2498, lng: 45.2536 } },
  { city: "أشيقر", coords: { lat: 25.3444, lng: 45.1919 } },
  { city: "عفيف", coords: { lat: 23.9065, lng: 42.9389 } },
  { city: "الدوادمي", coords: { lat: 24.5071, lng: 44.3924 } },
  { city: "البجادية", coords: { lat: 24.3167, lng: 43.7667 } },
  { city: "نفي", coords: { lat: 24.8167, lng: 43.8333 } },

  // Makkah Region
  { city: "مكة المكرمة", coords: { lat: 21.3891, lng: 39.8579 } },
  { city: "الجموم", coords: { lat: 21.6169, lng: 39.6989 } },
  { city: "بحرة", coords: { lat: 21.4000, lng: 39.5500 } },
  { city: "جدة", coords: { lat: 21.4858, lng: 39.1925 } },
  { city: "ذهبان", coords: { lat: 21.8667, lng: 39.1167 } },
  { city: "ثول", coords: { lat: 22.2833, lng: 39.1000 } },
  { city: "الطائف", coords: { lat: 21.2854, lng: 40.4245 } },
  { city: "الهدا", coords: { lat: 21.3650, lng: 40.2667 } },
  { city: "الشفا", coords: { lat: 21.1667, lng: 40.3500 } },
  { city: "الحوية", coords: { lat: 21.4167, lng: 40.4833 } },
  { city: "القنفذة", coords: { lat: 19.1281, lng: 41.0787 } },
  { city: "المظيلف", coords: { lat: 19.5333, lng: 41.0500 } },
  { city: "القوز", coords: { lat: 19.0167, lng: 41.1333 } },
  { city: "الليث", coords: { lat: 20.1417, lng: 40.2800 } },
  { city: "غميقة", coords: { lat: 20.2667, lng: 40.4500 } },
  { city: "رابغ", coords: { lat: 22.7986, lng: 39.0349 } },
  { city: "مستورة", coords: { lat: 23.0833, lng: 38.8667 } },

  // Madinah Region
  { city: "المدينة المنورة", coords: { lat: 24.5247, lng: 39.5692 } },
  { city: "أبيار الماشي", coords: { lat: 24.2833, lng: 39.4000 } },
  { city: "ينبع", coords: { lat: 24.0232, lng: 38.0637 } },
  { city: "ينبع الصناعية", coords: { lat: 23.9667, lng: 38.2167 } },
  { city: "ينبع النخل", coords: { lat: 24.1167, lng: 38.1000 } },
  { city: "العلا", coords: { lat: 26.6032, lng: 37.9304 } },
  { city: "مغيرا", coords: { lat: 26.7000, lng: 38.0500 } },
  { city: "بدر", coords: { lat: 23.7836, lng: 38.7915 } },
  { city: "الرايس", coords: { lat: 23.5667, lng: 38.6000 } },

  // Eastern Region
  { city: "الدمام", coords: { lat: 26.4207, lng: 50.0888 } },
  { city: "الظهران", coords: { lat: 26.2361, lng: 50.0393 } },
  { city: "الخبر", coords: { lat: 26.2172, lng: 50.1971 } },
  { city: "الأحساء", coords: { lat: 25.3835, lng: 49.5873 } },
  { city: "الهفوف", coords: { lat: 25.3667, lng: 49.5833 } },
  { city: "المبرز", coords: { lat: 25.4167, lng: 49.5833 } },
  { city: "العيون", coords: { lat: 25.6167, lng: 49.5667 } },
  { city: "حفر الباطن", coords: { lat: 28.4328, lng: 45.9708 } },
  { city: "القيصومة", coords: { lat: 28.3112, lng: 46.1264 } },
  { city: "الرقعي", coords: { lat: 29.1167, lng: 46.5167 } },
  { city: "الجبيل", coords: { lat: 27.0112, lng: 49.6609 } },
  { city: "الجبيل الصناعية", coords: { lat: 27.0500, lng: 49.5800 } },

  // Qassim
  { city: "بريدة", coords: { lat: 26.3260, lng: 43.9750 } },
  { city: "البصر", coords: { lat: 26.3300, lng: 43.8800 } },
  { city: "عنيزة", coords: { lat: 26.0844, lng: 43.9877 } },
  { city: "العوشزية", coords: { lat: 26.0600, lng: 44.1500 } },
  { city: "الرس", coords: { lat: 25.8673, lng: 43.4983 } },
  { city: "قصر ابن عقيل", coords: { lat: 25.8000, lng: 43.3500 } },
  { city: "البكيرية", coords: { lat: 26.1556, lng: 43.6625 } },
  { city: "الهلالية", coords: { lat: 26.1300, lng: 43.6800 } },

  // Asir
  { city: "أبها", coords: { lat: 18.2164, lng: 42.5053 } },
  { city: "السودة", coords: { lat: 18.2667, lng: 42.3667 } },
  { city: "خميس مشيط", coords: { lat: 18.3000, lng: 42.7333 } },
  { city: "تندحة", coords: { lat: 18.3667, lng: 42.8500 } },
  { city: "بيشة", coords: { lat: 19.9917, lng: 42.6000 } },
  { city: "الحازمي", coords: { lat: 19.8667, lng: 42.5500 } },
  { city: "النماص", coords: { lat: 19.1167, lng: 42.1333 } },
  { city: "تنومة", coords: { lat: 18.9667, lng: 42.1667 } },

  // Hail
  { city: "حائل", coords: { lat: 27.5219, lng: 41.6907 } },
  { city: "جبة", coords: { lat: 28.0333, lng: 40.9333 } },
  { city: "بقعاء", coords: { lat: 27.8833, lng: 42.4000 } },
  { city: "تربة", coords: { lat: 28.2500, lng: 42.7667 } }, // Note: Distinct from Makkah's Turubah

  // Tabuk
  { city: "تبوك", coords: { lat: 28.3833, lng: 36.5667 } },
  { city: "بير بن هرماس", coords: { lat: 28.8500, lng: 36.3500 } },
  { city: "ضباء", coords: { lat: 27.3517, lng: 35.6901 } },
  { city: "شرما", coords: { lat: 28.0500, lng: 35.2333 } },
  { city: "الوجه", coords: { lat: 26.2455, lng: 36.4525 } },
  { city: "أملج", coords: { lat: 25.0450, lng: 37.2650 } },

  // Jazan
  { city: "جازان", coords: { lat: 16.8894, lng: 42.5511 } },
  { city: "أبو عريش", coords: { lat: 16.9667, lng: 42.8333 } },
  { city: "صبيا", coords: { lat: 17.1500, lng: 42.6167 } },
  { city: "فيفاء", coords: { lat: 17.2667, lng: 43.1000 } },
  { city: "فرسان", coords: { lat: 16.7050, lng: 42.1183 } },

  // Najran
  { city: "نجران", coords: { lat: 17.4917, lng: 44.1322 } },
  { city: "بئر عسكر", coords: { lat: 17.6500, lng: 44.0500 } },
  { city: "شرورة", coords: { lat: 17.4778, lng: 47.1111 } },
  { city: "الوديعة", coords: { lat: 17.1167, lng: 47.1833 } },

  // Baha
  { city: "الباحة", coords: { lat: 20.0129, lng: 41.4677 } },
  { city: "الأطاولة", coords: { lat: 20.2000, lng: 41.3500 } },
  { city: "بلجرشي", coords: { lat: 19.8583, lng: 41.5667 } },
  { city: "المخواة", coords: { lat: 19.8000, lng: 41.3167 } },

  // Jouf
  { city: "سكاكا", coords: { lat: 29.9697, lng: 40.2064 } },
  { city: "قارا", coords: { lat: 29.9167, lng: 40.2167 } },
  { city: "دومة الجندل", coords: { lat: 29.8114, lng: 39.8667 } },
  { city: "القريات", coords: { lat: 31.3317, lng: 37.3428 } },

  // Northern Borders
  { city: "عرعر", coords: { lat: 30.9753, lng: 41.0381 } },
  { city: "جديدة عرعر", coords: { lat: 31.5000, lng: 41.1333 } },
  { city: "طريف", coords: { lat: 31.6725, lng: 38.6636 } },
  { city: "رفحاء", coords: { lat: 29.6386, lng: 43.5042 } }
];
