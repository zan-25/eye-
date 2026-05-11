export interface Patient {
  id: string;
  name: string;
  dob: string;
  age: string;
  surgeon: string;
}

export interface Metric {
  label: string;
  value: string | number;
  unit: string;
  color: 'blue' | 'yellow' | 'green' | 'default';
}

export interface StabilityData {
  index: number;
  movement: string;
  quality: string;
}

export type ViewStage = 'patient' | 'live' | 'oct' | 'view_data' | 'settings';
export type EyeType = 'OD' | 'OS';
export type ImagingMode = 'IR' | 'RGB' | 'Grayscale';
