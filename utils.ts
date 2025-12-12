
import { Incident, GeoCoordinate, Companion, PredictedPath, Sensor, Team } from './types';
import { 
  MOCK_SOURCES, MOCK_STATUSES, 
  TERRAINS, WEATHER_CONTEXTS, DISEASES, REGIONS_DATA, CITY_COORDINATES 
} from './constants';

const getRandomItem = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
const getRandomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

// --- STRICT 2-PART NAME SYSTEM ---

// 1. Sanitize Function (Global Rule)
export const sanitizeName = (name: string): string => {
  if (!name) return "";
  const parts = name.trim().split(/\s+/);
  // Keep only the first two words
  if (parts.length > 2) {
    return `${parts[0]} ${parts[1]}`;
  }
  return parts.join(" ");
};

// 2. Strict Name Lists
const MALE_FIRST_NAMES = [
  "محمد", "أحمد", "علي", "سعيد", "خالد", "فهد", "عبدالله", "سلطان", "تركي", "نايف", 
  "سلمان", "عمر", "إبراهيم", "يوسف", "بدر", "ماجد", "فيصل", "سعود", "عبدالعزيز", "مشعل"
];

const FEMALE_FIRST_NAMES = [
  "نورة", "سارة", "فاطمة", "مريم", "ريم", "مها", "جواهر", "العنود", "أمل", "هدى", 
  "ليلى", "زينب", "عائشة", "منيرة", "حصة", "لطيفة"
];

// Father names must ALWAYS be male names.
const FATHER_NAMES = MALE_FIRST_NAMES;

const MALE_DESCRIPTIONS = [
  "يرتدي ثوباً أبيض وشماغ أحمر، آخر مشاهدة كانت بالقرب من محطة الوقود.",
  "يرتدي بدلة رياضية زرقاء، يعاني من النسيان في بعض الأحيان.",
  "كان يرتدي قميصاً رمادياً وبنطال جينز، يحمل حقيبة ظهر سوداء.",
  "يرتدي ملابس برية (كاكي)، كان متوجهاً لرعي الأغنام.",
  "يرتدي ثوباً بنياً، لديه علامة مميزة (جرح قديم) على يده اليمنى.",
  "شوهد يرتدي معطفاً شتوياً أسود رغم حرارة الجو، يبدو عليه الارتباك.",
  "يرتدي زي العمل الرسمي (أزرق غامق)، خرج ولم يعد."
];

const FEMALE_DESCRIPTIONS = [
  "ترتدي عباءة سوداء ونقاب، شوهدت آخر مرة تخرج من المنزل سيرًا على الأقدام.",
  "ترتدي عباءة ملونة وطرحة بيضاء، تعاني من صعوبة في المشي.",
  "كانت ترتدي فستاناً منزلياً وعباءة كتف، خرجت للبحث عن الماشية.",
  "ترتدي عباءة رأس سوداء، تحمل حقيبة يدوية بنية اللون.",
  "ترتدي عباءة مطرزة، شوهدت بالقرب من السوق الشعبي.",
  "ترتدي عباءة رمادية، كانت بصحبة طفل صغير قبل أن تفقد."
];

const SENSOR_ANALYSIS_TEXTS = [
  "رصد حركة غير اعتيادية في الوادي الجنوبي.",
  "ارتفاع درجة حرارة الجسم المرصودة حرارياً.",
  "مرور مركبة مشبوهة في نطاق البحث.",
  "تغير مناخي مفاجئ وهبوب رياح قوية.",
  "انقطاع إشارة الهاتف في منطقة جبلية وعرة."
];

// Generate path radiating from center with randomization
const generateMockPath = (start: GeoCoordinate, segments: number): GeoCoordinate[] => {
  const path = [start];
  let current = { ...start };
  const biasLat = (Math.random() - 0.5) * 0.003;
  const biasLng = (Math.random() - 0.5) * 0.003;

  for (let i = 0; i < segments; i++) {
    const latChange = biasLat + (Math.random() - 0.5) * 0.001;
    const lngChange = biasLng + (Math.random() - 0.5) * 0.001;
    current = { lat: current.lat + latChange, lng: current.lng + lngChange };
    path.push(current);
  }
  return path;
};

export const generateMockIncidents = (count: number): Incident[] => {
  const incidents: Incident[] = [];
  const usedNames = new Set<string>();
  const usedCoords = new Set<string>(); // Ensure strict unique coords

  for (let i = 0; i < count; i++) {
    const regionObj = getRandomItem(REGIONS_DATA);
    const city = getRandomItem(regionObj.cities);
    
    // STRICT CITY BINDING: Fallback only if catastrophic failure in data
    const cityCoords = CITY_COORDINATES.find(c => c.city === city)?.coords || { lat: 24.7136, lng: 46.6753 };
    
    // Improved Jitter: Spread incidents significantly (15-20km) to avoid overlap
    // Ensure UNIQUE coordinates
    let coords: GeoCoordinate;
    let coordKey: string;
    let coordAttempts = 0;
    
    do {
        coords = {
          lat: cityCoords.lat + (Math.random() - 0.5) * 0.35, // Wider spread
          lng: cityCoords.lng + (Math.random() - 0.5) * 0.35
        };
        coordKey = `${coords.lat.toFixed(4)},${coords.lng.toFixed(4)}`;
        coordAttempts++;
    } while (usedCoords.has(coordKey) && coordAttempts < 50);
    
    usedCoords.add(coordKey);

    // --- STRICT GENDER & NAME GENERATION ---
    const gender = Math.random() > 0.6 ? 'ذكر' : 'أنثى';
    let fullName = "";
    
    // Ensure uniqueness while strictly maintaining 2 words
    let attempts = 0;
    do {
        const firstName = gender === 'ذكر' ? getRandomItem(MALE_FIRST_NAMES) : getRandomItem(FEMALE_FIRST_NAMES);
        const fatherName = getRandomItem(FATHER_NAMES);
        
        // STRICT RULE: Only First + Father Name. No families.
        fullName = `${firstName} ${fatherName}`;
        attempts++;
        // If duplicate, try again. If too many tries, we accept overlap or allow same name different city ideally,
        // but for this mock, we might just append a number hiddenly if needed, but per strict rules, names are non-unique in real life too.
        // We will just try to unique it 50 times.
    } while (usedNames.has(fullName) && attempts < 50);
    
    usedNames.add(fullName);

    const description = gender === 'ذكر' ? getRandomItem(MALE_DESCRIPTIONS) : getRandomItem(FEMALE_DESCRIPTIONS);

    // AI Risk Scoring & Logic
    let riskScore = getRandomInt(40, 70); 
    const terrain = getRandomItem(TERRAINS);
    const weather = getRandomItem(WEATHER_CONTEXTS);
    const diseases = [getRandomItem(DISEASES)];
    
    let healthRiskLevel = "منخفض";
    if (diseases.includes("قلب") || diseases.includes("سكري") || diseases.includes("صرع")) {
        healthRiskLevel = "مرتفع";
        riskScore += 25;
    } else if (diseases.includes("لا يوجد")) {
        healthRiskLevel = "منخفض";
    } else {
        healthRiskLevel = "متوسط";
        riskScore += 10;
    }

    if (weather === "سيول" || weather === "عاصفة ترابية") riskScore += 20;
    else if (weather === "أمطار") riskScore += 10;

    if (terrain === "جبال" || terrain === "صحراء" || terrain === "وادي") riskScore += 15;

    if (riskScore > 99) riskScore = 99;
    if (riskScore >= 85) healthRiskLevel = "حرج";

    // Companions
    const hasCompanions = Math.random() > 0.8;
    const numCompanions = hasCompanions ? getRandomInt(1, 3) : 0;
    const companions: Companion[] = [];
    for(let j=0; j<numCompanions; j++) {
        companions.push({
            name: gender === 'ذكر' ? "مرافق" : "مرافقة", // Simplified generic name
            relation: getRandomItem(["صديق", "أخ", "ابن عم", "سائق", "قريب"]),
            phone: "05" + getRandomInt(10000000, 99999999)
        });
    }

    // Predictive Paths
    const numPaths = getRandomInt(2, 4);
    const predictedPaths: PredictedPath[] = [];
    for(let k=0; k<numPaths; k++) {
        const confidence = k === 0 ? getRandomInt(75, 95) : getRandomInt(30, 60); 
        predictedPaths.push({
            points: generateMockPath(coords, getRandomInt(5, 12)),
            confidence: confidence,
            label: k === 0 ? "مسار مرجح" : `مسار محتمل`
        });
    }
    predictedPaths.sort((a,b) => b.confidence - a.confidence);

    const hasSensorData = Math.random() < 0.5;
    const sensorText = hasSensorData ? getRandomItem(SENSOR_ANALYSIS_TEXTS) : undefined;

    incidents.push({
      id: `INC-${2024}-${1000 + i}`,
      missing_name: fullName, // Already sanitized
      age: getRandomInt(5, 85),
      gender: gender as 'ذكر' | 'أنثى',
      region: regionObj.region,
      city: city,
      coords,
      terrain_type: terrain as any,
      weather_context: weather as any,
      status: getRandomItem(MOCK_STATUSES) as any,
      last_seen_hours_ago: getRandomInt(1, 72),
      report_date: new Date().toISOString(),
      source: getRandomItem(MOCK_SOURCES),
      missing_description: description,
      health_profile: {
        chronic_diseases: diseases,
        risk_level: healthRiskLevel as any
      },
      ai_profile: {
        ghayath_risk_score: riskScore,
        ghayath_confidence: getRandomInt(60, 99),
        ghayath_short_line: "تحليل النطاق الجغرافي مكتمل.",
        ghayath_explanation: `تم تحديد مستوى الخطورة (${healthRiskLevel}) بناءً على ${terrain} ووجود أمراض مزمنة (${diseases.join(',')}).`,
        predicted_paths: predictedPaths,
        sensor_analysis: sensorText,
        survival_estimate: `${getRandomInt(12, 48)} ساعة`,
        clustering_group: "Cluster-A"
      },
      companions: companions,
      connections: {
          absher: Math.random() > 0.1,
          tawakkalna: Math.random() > 0.1,
          sehaty: Math.random() > 0.2, // Ensure Sehaty connection
          ncm: Math.random() > 0.1
      },
      is_security_routed: Math.random() > 0.7
    });
  }
  return incidents;
};

// Generate Spatially Linked Assets
export const generateAssetsForIncident = (incident: Incident) => {
    const sensors: Sensor[] = [];
    const teams: Team[] = [];
    const center = incident.coords;

    // 1. Generate spatially linked sensors
    const sensorCount = getRandomInt(2, 4);
    for (let i = 0; i < sensorCount; i++) {
        const type = getRandomItem(['thermal', 'motion', 'camera', 'seismic'] as const);
        const metricMap: any = {
            'thermal': 'حرارة المكان',
            'motion': 'حركة الأجسام',
            'camera': 'مرور المركبات',
            'seismic': 'تغير مناخي مفاجئ' // Approximate mapping
        };
        sensors.push({
            id: `SENS-${incident.id.split('-')[2]}-${i}`,
            type: type,
            status: incident.health_profile.risk_level === 'حرج' ? 'alert' : 'active',
            coords: {
                lat: center.lat + (Math.random() - 0.5) * 0.008,
                lng: center.lng + (Math.random() - 0.5) * 0.008
            },
            battery: getRandomInt(40, 100),
            last_update: 'الآن',
            location_name: `نطاق ${incident.city}`,
            reading_value: `${getRandomInt(20, 45)}`,
            metric_label: metricMap[type]
        });
    }

    // 2. Generate case-specific teams
    // Ground team
    teams.push({
        id: `GT-${incident.id.split('-')[2]}`,
        name: `فريق أرضي (${incident.id.split('-')[2]})`,
        type: 'ground',
        status: 'searching',
        coords: {
            lat: center.lat - 0.003,
            lng: center.lng + 0.003
        },
        assignedIncidentId: incident.id
    });

    // Drone (Monitoring only, on map)
    teams.push({
        id: `DR-${incident.id.split('-')[2]}`,
        name: `درون ${incident.city} - قطاع ${getRandomInt(1,5)}`,
        type: 'drone',
        status: 'searching',
        coords: {
            lat: center.lat + 0.004,
            lng: center.lng - 0.002
        },
        battery: getRandomInt(50, 90),
        assignedIncidentId: incident.id
    });

    return { sensors, teams };
};

export const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('ar-SA', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric'
  });
};

export const getStatusColor = (status: string) => {
  switch (status) {
    case 'بلاغ جديد': return 'text-red-400 border-red-500/50 bg-red-500/10';
    case 'قيد البحث': return 'text-yellow-400 border-yellow-500/50 bg-yellow-500/10';
    case 'تم العثور عليه – حي': return 'text-green-400 border-green-500/50 bg-green-500/10';
    case 'تم العثور عليه – متوفى': return 'text-gray-400 border-gray-500/50 bg-gray-500/10';
    default: return 'text-blue-400 border-blue-500/50 bg-blue-500/10';
  }
};

export const getRiskColor = (risk: string) => {
   switch (risk) {
    case 'حرج': return 'text-red-500';
    case 'مرتفع': return 'text-orange-500';
    case 'متوسط': return 'text-yellow-500';
    case 'منخفض': return 'text-green-500';
    default: return 'text-white';
   }
};
