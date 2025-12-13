
import { Incident, GeoCoordinate, Companion, PredictedPath, Sensor, Team } from './types';
import { 
  MOCK_SOURCES, MOCK_STATUSES, 
  TERRAINS, WEATHER_CONTEXTS, DISEASES, REGIONS_DATA, CITY_COORDINATES 
} from './constants';

const getRandomItem = <T>(arr: T[] | readonly T[]): T => arr[Math.floor(Math.random() * arr.length)];
const getRandomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

// --- A) STRICT PERSON LOGIC ---

export const sanitizeName = (name: string): string => {
  if (!name) return "";
  const parts = name.trim().split(/\s+/);
  if (parts.length > 2) {
    return `${parts[0]} ${parts[1]}`;
  }
  return parts.join(" ");
};

const MALE_NAMES_POOL = [
  "أحمد محمد", "محمد فهد", "فهد سالم", "خالد حسين", "سلمان أحمد", 
  "جميل سعيد", "سعود عبدالعزيز", "تركي محمد", "نايف سعد", "مشعل حمد",
  "عبدالله إبراهيم", "ياسر علي", "عمر سليمان", "بدر عبدالرحمن", "سلطان خالد",
  "ناصر فهد", "فيصل سعود", "عبدالعزيز محمد", "ماجد عبدالله", "زياد صالح"
];

const FEMALE_NAMES_POOL = [
  "نور فهد", "نورة محمد", "سارة خالد", "ليان سعود", "فاطمة علي",
  "مريم عبدالله", "لطيفة حمد", "ريم خالد", "حصة صالح", "جواهر عبدالعزيز",
  "أميرة فهد", "هند سليمان", "العنود نايف", "منى إبراهيم", "دانة سالم",
  "لولوة سعد", "أروى محمد", "غادة عبدالرحمن", "نوف فهد", "مها عبدالله"
];

export const getPersonCategory = (age: number, gender: 'ذكر' | 'أنثى') => {
  if (age < 18) {
    return gender === 'ذكر' ? 'طفل' : 'طفلة';
  }
  return gender;
};

// --- LOGICAL DESCRIPTION GENERATOR ---

const generateLogicalDescription = (
    gender: 'ذكر' | 'أنثى',
    age: number,
    city: string,
    terrain: string,
    weather: string,
    diseases: string[],
    riskLevel: string,
    companions: Companion[],
    hoursAgo: number
): string => {
    let parts: string[] = [];
    parts.push(`آخر مشاهدة قبل ${hoursAgo} ساعة في نطاق ${city} (${terrain}).`);

    const isChild = age < 18;
    if (gender === 'ذكر') {
        if (terrain === 'صحراء' || terrain === 'وادي' || terrain === 'طرق برية') {
             parts.push(isChild ? "يرتدي ملابس رياضية، قد يكون خرج للتنزه." : "يرتدي ثوباً وسترة برية أو ملابس رحلات.");
        } else {
             parts.push(isChild ? "يرتدي زي المدرسة، يحمل حقيبة." : "يرتدي ثوباً أبيض وشماغ.");
        }
    } else {
        if (terrain === 'منطقة حضرية') {
             parts.push(isChild ? "ترتدي فستاناً ملوناً، تحمل لعبة." : "ترتدي عباءة سوداء وحقيبة يد.");
        } else {
             parts.push("ترتدي عباءة داكنة وتتواجد في منطقة نائية.");
        }
    }

    if (diseases.length > 0 && !diseases.includes("لا يوجد")) {
        parts.push(`الحالة الصحية: ${diseases.join('، ')} (مستوى الخطورة: ${riskLevel}).`);
    } else {
        parts.push("الحالة الصحية: لا يوجد أمراض مزمنة مسجلة.");
    }

    if (companions.length > 0) {
        parts.push(`يوجد مرافقون: ${companions.length} (${companions.map(c => c.relation).join('، ')}).`);
    } else {
        parts.push("لا توجد مرافقات مسجلة.");
    }

    return parts.join(" ");
};

const SENSOR_ANALYSIS_TEXTS = [
  "رصد حركة غير اعتيادية في الوادي الجنوبي.",
  "ارتفاع درجة حرارة الجسم المرصودة حرارياً.",
  "مرور مركبة مشبوهة في نطاق البحث.",
  "تغير مناخي مفاجئ وهبوب رياح قوية.",
  "انقطاع إشارة الهاتف في منطقة وعرة.",
  "إشارة استغاثة ضعيفة (SOS) ملتقطة."
];

// Generate path radiating from center with randomization
const generateMockPath = (start: GeoCoordinate, segments: number, spread: number = 0.003): GeoCoordinate[] => {
  const path = [start];
  let current = { ...start };
  // Direction bias
  const biasLat = (Math.random() - 0.5) * spread;
  const biasLng = (Math.random() - 0.5) * spread;

  for (let i = 0; i < segments; i++) {
    const latChange = biasLat + (Math.random() - 0.5) * (spread / 3);
    const lngChange = biasLng + (Math.random() - 0.5) * (spread / 3);
    current = { lat: current.lat + latChange, lng: current.lng + lngChange };
    path.push(current);
  }
  return path;
};

// --- MAIN GENERATOR ---

export const generateMockIncidents = (count: number): Incident[] => {
  const incidents: Incident[] = [];
  const usedNames = new Set<string>();
  const usedCoords = new Set<string>();
  
  // Flatten Locations
  const allLocations: {region: string, governorate: string, city: string}[] = [];
  REGIONS_DATA.forEach(r => {
      r.governorates.forEach(g => {
          g.cities.forEach(c => {
              if (CITY_COORDINATES.find(cc => cc.city === c.city)) {
                  allLocations.push({ region: r.region, governorate: g.governorate, city: c.city });
              }
          });
      });
  });

  for (let i = 0; i < count; i++) {
    const loc = getRandomItem(allLocations);
    const cityData = CITY_COORDINATES.find(c => c.city === loc.city);
    if (!cityData) continue; 

    const cityCoords = cityData.coords; // Anchor for the city
    
    // Generate Last Seen (Offset from city)
    let coords: GeoCoordinate;
    let coordKey: string;
    let coordAttempts = 0;
    do {
        coords = {
          lat: cityCoords.lat + (Math.random() - 0.5) * 0.08,
          lng: cityCoords.lng + (Math.random() - 0.5) * 0.08
        };
        coordKey = `${coords.lat.toFixed(4)},${coords.lng.toFixed(4)}`;
        coordAttempts++;
    } while (usedCoords.has(coordKey) && coordAttempts < 50);
    usedCoords.add(coordKey);

    // Person Data
    const gender = Math.random() > 0.65 ? 'ذكر' : 'أنثى';
    let fullName = "";
    let nameAttempts = 0;
    const namePool = gender === 'ذكر' ? MALE_NAMES_POOL : FEMALE_NAMES_POOL;
    do {
        fullName = getRandomItem(namePool);
        nameAttempts++;
    } while (usedNames.has(fullName) && nameAttempts < 50);
    usedNames.add(fullName);

    const age = getRandomInt(4, 85);
    const isChild = age < 18;
    const isElderly = age >= 60;

    // Context
    const terrain = getRandomItem(TERRAINS);
    const weather = getRandomItem(["أجواء مستقرة", "رياح قوية", "عاصفة ترابية"]);

    // Health
    let diseases = [getRandomItem(DISEASES)];
    if (age <= 17) {
        diseases = diseases.filter(d => !["زهايمر", "ضغط", "قلب"].includes(d)); 
        if (diseases.length === 0) diseases = ["لا يوجد"];
    }
    let healthRiskLevel = "منخفض";
    if (diseases.includes("قلب") || diseases.includes("صرع")) healthRiskLevel = "مرتفع";
    else if (diseases.includes("لا يوجد")) healthRiskLevel = "منخفض";
    else healthRiskLevel = "متوسط";

    // Survival
    let survivalHours = 48;
    if (isChild) survivalHours = 24;
    else if (isElderly) survivalHours = 30;
    
    let riskScore = 100 - survivalHours; 
    if (riskScore > 99) riskScore = 99;
    if (riskScore >= 85) healthRiskLevel = "حرج";

    // Companions
    const hasCompanions = Math.random() > 0.8;
    const numCompanions = hasCompanions ? getRandomInt(1, 2) : 0;
    const companions: Companion[] = [];
    for(let j=0; j<numCompanions; j++) {
        companions.push({
            name: gender === 'ذكر' ? `مرافق ${j+1}` : `مرافقة ${j+1}`,
            relation: "قريب",
            phone: "05" + getRandomInt(10000000, 99999999)
        });
    }

    const hoursAgo = getRandomInt(1, 48);
    const description = generateLogicalDescription(
        gender as any, age, loc.city, terrain, weather, diseases, healthRiskLevel, companions, hoursAgo
    );

    // --- GHAYATH AI STRICT PATHS ---
    // Rule: Exactly 3 paths. Green, Yellow, Orange.
    
    // 1. Primary Path (Green - High Confidence 70-90%)
    const path1Points = generateMockPath(coords, getRandomInt(12, 18), 0.002);
    const path1: PredictedPath = {
        points: path1Points,
        confidence: getRandomInt(70, 90),
        label: "مسار مرجّح",
        type: 'primary',
        color: "#22c55e", // Green
        width: 6,
        timeEstimate: "15-30 دقيقة"
    };

    // 2. Secondary Path (Yellow - Medium Confidence 45-69%)
    const path2Points = generateMockPath(coords, getRandomInt(10, 14), 0.004);
    const path2: PredictedPath = {
        points: path2Points,
        confidence: getRandomInt(45, 69),
        label: "مسار متوسط",
        type: 'secondary',
        color: "#eab308", // Yellow
        width: 5,
        timeEstimate: "45-90 دقيقة"
    };

    // 3. Tertiary Path (Orange - Low Confidence 25-44%)
    const path3Points = generateMockPath(coords, getRandomInt(8, 12), 0.006);
    const path3: PredictedPath = {
        points: path3Points,
        confidence: getRandomInt(25, 44),
        label: "مسار بديل",
        type: 'tertiary',
        color: "#f97316", // Orange
        width: 4,
        timeEstimate: "2 ساعة+"
    };

    const predictedPaths = [path1, path2, path3];
    // --------------------------------

    const hasVolunteerSupport = Math.random() > 0.6 && healthRiskLevel !== 'منخفض';

    incidents.push({
      id: `INC-${2024}-${1000 + i}`,
      missing_name: fullName,
      age: age,
      gender: gender as 'ذكر' | 'أنثى',
      region: loc.region,
      governorate: loc.governorate,
      city: loc.city,
      coords: coords, // Bound to Last Seen
      cityCoords: cityCoords, // Bound to City Anchor
      terrain_type: terrain as any,
      weather_context: weather as any,
      status: getRandomItem(MOCK_STATUSES) as any,
      last_seen_hours_ago: hoursAgo,
      report_date: new Date().toISOString(),
      source: getRandomItem(MOCK_SOURCES),
      missing_description: description,
      health_profile: {
        chronic_diseases: diseases,
        risk_level: healthRiskLevel as any
      },
      ai_profile: {
        ghayath_risk_score: riskScore,
        ghayath_confidence: getRandomInt(75, 99),
        ghayath_short_line: isChild ? "حالة قاصر – أولوية قصوى." : "تحليل النطاق الجغرافي مكتمل.",
        predicted_paths: predictedPaths,
        sensor_analysis: Math.random() < 0.3 ? getRandomItem(SENSOR_ANALYSIS_TEXTS) : undefined,
        survival_estimate: `${Math.round(survivalHours)} ساعة`,
        clustering_group: "Cluster-A"
      },
      companions: companions,
      connections: {
          absher: true,
          tawakkalna: true,
          sehaty: diseases.length > 0 && diseases[0] !== "لا يوجد",
          ncm: true
      },
      is_security_routed: Math.random() > 0.7,
      has_volunteer_support: hasVolunteerSupport
    });
  }
  return incidents;
};

// Generate Spatially Linked Assets
export const generateAssetsForIncident = (incident: Incident) => {
    const sensors: Sensor[] = [];
    const teams: Team[] = [];
    const center = incident.coords;

    // Ground Teams (Blue)
    if (incident.status === 'قيد البحث') {
        teams.push({
            id: `GT-${incident.id.split('-')[2]}`,
            name: `فريق أرضي (${incident.id.split('-')[2]})`,
            type: 'ground',
            status: 'searching',
            coords: { lat: center.lat - 0.003, lng: center.lng + 0.003 },
            assignedIncidentId: incident.id
        });
    }

    // Volunteers (Purple)
    if (incident.has_volunteer_support && incident.status === 'قيد البحث') {
        teams.push({
            id: `VT-${incident.id.split('-')[2]}`,
            name: `فريق تطوعي (عون)`,
            type: 'volunteer', 
            status: 'en-route',
            coords: { lat: center.lat + 0.004, lng: center.lng + 0.004 },
            assignedIncidentId: incident.id
        });
    }

    // Security Drones (Rose - Map Only)
    if (Math.random() > 0.5) {
        teams.push({
            id: `DR-${incident.id.split('-')[2]}`,
            name: `درون مراقبة`,
            type: 'drone',
            status: 'searching',
            coords: { lat: center.lat + 0.002, lng: center.lng - 0.002 },
            battery: getRandomInt(50, 90),
            assignedIncidentId: incident.id
        });
    }

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
    case 'قيد المتابعة': return 'text-orange-400 border-orange-500/50 bg-orange-500/10';
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
