
import { RegionData, CityCoordinate } from './types';

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

// STRICT HIERARCHY: Region -> Governorate -> City -> Villages
export const REGIONS_DATA: RegionData[] = [
    {
        region: "منطقة الرياض",
        governorates: [
            { governorate: "الرياض", cities: [{ city: "الرياض", villages: [] }] },
            { governorate: "الخرج", cities: [{ city: "الخرج", villages: [] }] },
            { governorate: "الدوادمي", cities: [{ city: "الدوادمي", villages: [] }] },
            { governorate: "القويعية", cities: [{ city: "القويعية", villages: [] }] },
            { governorate: "عفيف", cities: [{ city: "عفيف", villages: [] }] },
            { governorate: "وادي الدواسر", cities: [{ city: "وادي الدواسر", villages: [] }] },
            { governorate: "الزلفي", cities: [{ city: "الزلفي", villages: [] }] },
            { governorate: "شقراء", cities: [{ city: "شقراء", villages: [] }] },
            { governorate: "المجمعة", cities: [{ city: "المجمعة", villages: [] }] },
            { governorate: "الأفلاج", cities: [{ city: "ليلى", villages: [] }] },
            { governorate: "السليل", cities: [{ city: "السليل", villages: [] }] }
        ]
    },
    {
        region: "منطقة مكة المكرمة",
        governorates: [
            { governorate: "مكة المكرمة", cities: [{ city: "مكة المكرمة", villages: [] }] },
            { governorate: "جدة", cities: [{ city: "جدة", villages: [] }] },
            { governorate: "الطائف", cities: [{ city: "الطائف", villages: [] }] },
            { governorate: "القنفذة", cities: [{ city: "القنفذة", villages: [] }] },
            { governorate: "الليث", cities: [{ city: "الليث", villages: [] }] },
            { governorate: "رابغ", cities: [{ city: "رابغ", villages: [] }] }
        ]
    },
    {
        region: "منطقة المدينة المنورة",
        governorates: [
            { governorate: "المدينة المنورة", cities: [{ city: "المدينة المنورة", villages: [] }] },
            { governorate: "ينبع", cities: [{ city: "ينبع", villages: [] }] },
            { governorate: "العلا", cities: [{ city: "العلا", villages: [] }] },
            { governorate: "بدر", cities: [{ city: "بدر", villages: [] }] }
        ]
    },
    {
        region: "منطقة القصيم",
        governorates: [
            { governorate: "بريدة", cities: [{ city: "بريدة", villages: [] }] },
            { governorate: "عنيزة", cities: [{ city: "عنيزة", villages: [] }] },
            { governorate: "الرس", cities: [{ city: "الرس", villages: [] }] },
            { governorate: "المذنب", cities: [{ city: "المذنب", villages: [] }] }
        ]
    },
    {
        region: "المنطقة الشرقية",
        governorates: [
            { governorate: "الدمام", cities: [{ city: "الدمام", villages: [] }] },
            { governorate: "الخبر", cities: [{ city: "الخبر", villages: [] }] },
            { governorate: "الظهران", cities: [{ city: "الظهران", villages: [] }] },
            { governorate: "الأحساء", cities: [{ city: "الهفوف", villages: [] }] },
            { governorate: "حفر الباطن", cities: [{ city: "حفر الباطن", villages: [] }] },
            { governorate: "الجبيل", cities: [{ city: "الجبيل", villages: [] }] }
        ]
    },
    {
        region: "منطقة عسير",
        governorates: [
            { governorate: "أبها", cities: [{ city: "أبها", villages: [] }] },
            { governorate: "خميس مشيط", cities: [{ city: "خميس مشيط", villages: [] }] },
            { governorate: "بيشة", cities: [{ city: "بيشة", villages: [] }] },
            { governorate: "محايل عسير", cities: [{ city: "محايل", villages: [] }] }
        ]
    },
    {
        region: "منطقة حائل",
        governorates: [
            { governorate: "حائل", cities: [{ city: "حائل", villages: [] }] },
            { governorate: "بقعاء", cities: [{ city: "بقعاء", villages: [] }] },
            { governorate: "الغزالة", cities: [{ city: "الغزالة", villages: [] }] }
        ]
    },
    {
        region: "منطقة تبوك",
        governorates: [
            { governorate: "تبوك", cities: [{ city: "تبوك", villages: [] }] },
            { governorate: "ضباء", cities: [{ city: "ضباء", villages: [] }] },
            { governorate: "الوجه", cities: [{ city: "الوجه", villages: [] }] }
        ]
    },
    {
        region: "منطقة الجوف",
        governorates: [
            { governorate: "سكاكا", cities: [{ city: "سكاكا", villages: [] }] },
            { governorate: "دومة الجندل", cities: [{ city: "دومة الجندل", villages: [] }] },
            { governorate: "القريات", cities: [{ city: "القريات", villages: [] }] },
            { governorate: "طبرجل", cities: [{ city: "طبرجل", villages: [] }] }
        ]
    },
    {
        region: "منطقة جازان",
        governorates: [
            { governorate: "جازان", cities: [{ city: "جازان", villages: [] }] },
            { governorate: "صبيا", cities: [{ city: "صبيا", villages: [] }] },
            { governorate: "أبو عريش", cities: [{ city: "أبو عريش", villages: [] }] }
        ]
    },
    {
        region: "منطقة نجران",
        governorates: [
            { governorate: "نجران", cities: [{ city: "نجران", villages: [] }] },
            { governorate: "شرورة", cities: [{ city: "شرورة", villages: [] }] }
        ]
    },
    {
        region: "منطقة الباحة",
        governorates: [
            { governorate: "الباحة", cities: [{ city: "الباحة", villages: [] }] },
            { governorate: "بلجرشي", cities: [{ city: "بلجرشي", villages: [] }] }
        ]
    },
    {
        region: "منطقة الحدود الشمالية",
        governorates: [
            { governorate: "عرعر", cities: [{ city: "عرعر", villages: [] }] },
            { governorate: "رفحاء", cities: [{ city: "رفحاء", villages: [] }] }
        ]
    }
];

export const CITY_COORDINATES: CityCoordinate[] = [
  // Riyadh Region
  { city: "الرياض", coords: { lat: 24.7136, lng: 46.6753 } },
  { city: "الدرعية", coords: { lat: 24.7431, lng: 46.5746 } },
  { city: "الخرج", coords: { lat: 24.1500, lng: 47.3000 } },
  { city: "وادي الدواسر", coords: { lat: 20.4667, lng: 44.8000 } },
  { city: "السليل", coords: { lat: 20.4600, lng: 45.5700 } },
  { city: "القويعية", coords: { lat: 24.0667, lng: 45.2667 } },
  { city: "المجمعة", coords: { lat: 25.9184, lng: 45.3615 } },
  { city: "الزلفي", coords: { lat: 26.2995, lng: 44.7988 } },
  { city: "شقراء", coords: { lat: 25.2498, lng: 45.2536 } },
  { city: "عفيف", coords: { lat: 23.9065, lng: 42.9389 } },
  { city: "الدوادمي", coords: { lat: 24.5071, lng: 44.3924 } },
  { city: "ليلى", coords: { lat: 22.2925, lng: 46.7269 } }, // Aflaj capital

  // Makkah Region
  { city: "مكة المكرمة", coords: { lat: 21.3891, lng: 39.8579 } },
  { city: "جدة", coords: { lat: 21.4858, lng: 39.1925 } },
  { city: "الطائف", coords: { lat: 21.2854, lng: 40.4245 } },
  { city: "القنفذة", coords: { lat: 19.1281, lng: 41.0787 } },
  { city: "الليث", coords: { lat: 20.1417, lng: 40.2800 } },
  { city: "رابغ", coords: { lat: 22.7986, lng: 39.0349 } },

  // Madinah Region
  { city: "المدينة المنورة", coords: { lat: 24.5247, lng: 39.5692 } },
  { city: "ينبع", coords: { lat: 24.0232, lng: 38.0637 } },
  { city: "العلا", coords: { lat: 26.6032, lng: 37.9304 } },
  { city: "بدر", coords: { lat: 23.7836, lng: 38.7915 } },

  // Eastern Region
  { city: "الدمام", coords: { lat: 26.4207, lng: 50.0888 } },
  { city: "الظهران", coords: { lat: 26.2361, lng: 50.0393 } },
  { city: "الخبر", coords: { lat: 26.2172, lng: 50.1971 } },
  { city: "الهفوف", coords: { lat: 25.3667, lng: 49.5833 } }, // Al-Ahsa capital
  { city: "حفر الباطن", coords: { lat: 28.4328, lng: 45.9708 } },
  { city: "الجبيل", coords: { lat: 27.0112, lng: 49.6609 } },

  // Qassim
  { city: "بريدة", coords: { lat: 26.3260, lng: 43.9750 } },
  { city: "عنيزة", coords: { lat: 26.0844, lng: 43.9877 } },
  { city: "الرس", coords: { lat: 25.8673, lng: 43.4983 } },
  { city: "المذنب", coords: { lat: 25.8667, lng: 44.2167 } },

  // Asir
  { city: "أبها", coords: { lat: 18.2164, lng: 42.5053 } },
  { city: "خميس مشيط", coords: { lat: 18.3000, lng: 42.7333 } },
  { city: "بيشة", coords: { lat: 19.9917, lng: 42.6000 } },
  { city: "محايل", coords: { lat: 18.5500, lng: 42.0500 } },

  // Hail
  { city: "حائل", coords: { lat: 27.5219, lng: 41.6907 } },
  { city: "بقعاء", coords: { lat: 27.8833, lng: 42.4000 } },
  { city: "الغزالة", coords: { lat: 26.5500, lng: 41.2833 } },

  // Tabuk
  { city: "تبوك", coords: { lat: 28.3833, lng: 36.5667 } },
  { city: "ضباء", coords: { lat: 27.3517, lng: 35.6901 } },
  { city: "الوجه", coords: { lat: 26.2455, lng: 36.4525 } },

  // Jazan
  { city: "جازان", coords: { lat: 16.8894, lng: 42.5511 } },
  { city: "أبو عريش", coords: { lat: 16.9667, lng: 42.8333 } },
  { city: "صبيا", coords: { lat: 17.1500, lng: 42.6167 } },

  // Najran
  { city: "نجران", coords: { lat: 17.4917, lng: 44.1322 } },
  { city: "شرورة", coords: { lat: 17.4778, lng: 47.1111 } },

  // Baha
  { city: "الباحة", coords: { lat: 20.0129, lng: 41.4677 } },
  { city: "بلجرشي", coords: { lat: 19.8583, lng: 41.5667 } },

  // Jouf
  { city: "سكاكا", coords: { lat: 29.9697, lng: 40.2064 } },
  { city: "دومة الجندل", coords: { lat: 29.8114, lng: 39.8667 } },
  { city: "القريات", coords: { lat: 31.3317, lng: 37.3428 } },
  { city: "طبرجل", coords: { lat: 30.5000, lng: 39.0000 } },

  // Northern Borders
  { city: "عرعر", coords: { lat: 30.9753, lng: 41.0381 } },
  { city: "رفحاء", coords: { lat: 29.6386, lng: 43.5042 } }
];
