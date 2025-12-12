
export type ScreenId = 
  | 'nav_new_incident' 
  | 'nav_dashboard' 
  | 'nav_incidents' 
  | 'nav_map' 
  | 'nav_operations' 
  | 'nav_sensors' 
  | 'nav_weather' 
  | 'nav_ghayath' 
  | 'nav_reports' 
  | 'nav_settings'
  | 'nav_incident_details';

export type IncidentStatus = "بلاغ جديد" | "قيد البحث" | "تم العثور عليه – حي" | "تم العثور عليه – متوفى" | "مغلق";
export type RiskLevel = "منخفض" | "متوسط" | "مرتفع" | "حرج";
export type TerrainType = "وادي" | "صحراء" | "جبال" | "سهل مفتوح" | "منطقة حضرية";
export type WeatherContext = "أمطار" | "سيول" | "أجواء مستقرة" | "عاصفة ترابية";

export interface GeoCoordinate {
  lat: number;
  lng: number;
}

export interface HealthProfile {
  chronic_diseases: string[];
  risk_level: RiskLevel;
}

export interface PredictedPath {
  points: GeoCoordinate[];
  confidence: number;
  label: string;
}

export interface AIProfile {
  ghayath_risk_score: number;
  ghayath_confidence: number;
  ghayath_short_line: string;
  ghayath_explanation?: string;
  predicted_paths: PredictedPath[];
  sensor_analysis?: string; // IoT Sensor analysis text
  survival_estimate?: string;
  clustering_group?: string;
}

export interface Companion {
  name: string;
  relation: string;
  phone?: string;
  notes?: string;
}

export interface ConnectionStatus {
  absher: boolean;
  tawakkalna: boolean;
  sehaty: boolean;
  ncm: boolean;
}

export interface Team {
  id: string;
  name: string;
  type: 'ground' | 'air' | 'drone' | 'rescue';
  status: 'en-route' | 'searching' | 'standby' | 'returning';
  coords: GeoCoordinate;
  assignedIncidentId?: string;
  battery?: number; 
}

export interface Sensor {
  id: string;
  name?: string;
  type: 'camera' | 'thermal' | 'motion' | 'seismic';
  status: 'active' | 'alert' | 'offline';
  coords: GeoCoordinate;
  battery: number;
  last_update: string;
  reading_value?: string;
  location_name?: string;
  metric_label?: string; // e.g. "حرارة المكان"
}

export interface Incident {
  id: string;
  missing_name: string;
  missing_id?: string;
  age: number;
  gender: 'ذكر' | 'أنثى';
  region: string;
  city: string;
  coords: GeoCoordinate;
  terrain_type: TerrainType;
  weather_context: WeatherContext;
  status: IncidentStatus;
  last_seen_hours_ago: number;
  report_date: string;
  source: string;
  missing_description?: string;
  health_profile: HealthProfile;
  ai_profile: AIProfile;
  reporter_name?: string;
  reporter_phone?: string;
  companions?: Companion[];
  connections: ConnectionStatus; 
  is_security_routed: boolean;
}

export interface CityData {
  city: string;
  coords: GeoCoordinate;
}

export interface RegionData {
  region: string;
  cities: string[];
}
