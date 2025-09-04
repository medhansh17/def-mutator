export interface IRadarTarget {
  id: string;
  position: {
    range: number; // Distance in meters
    azimuth: number; // Angle in radians
    elevation: number; // Elevation in radians
  };
  velocity: {
    radial: number; // Radial velocity (Doppler)
    tangential: number; // Tangential velocity
  };
  signature: {
    rcs: number; // Radar Cross Section in m²
    classification: "aircraft" | "missile" | "drone" | "decoy" | "unknown";
  };
  timestamp: number;
  confidence: number;
}

export interface IRadarConfiguration {
  frequency: number; // Operating frequency in Hz
  power: number; // Transmit power in watts
  beamWidth: number; // Beam width in radians
  pulseRepetitionRate: number;
  range: {
    min: number;
    max: number;
  };
}

export interface ITrackingResult {
  targets: IRadarTarget[];
  threats: IRadarTarget[];
  systemStatus: "OPERATIONAL" | "DEGRADED" | "OFFLINE" | "MAINTENANCE";
  interferenceLevel: number;
  coverage: {
    azimuthScan: number;
    elevationScan: number;
  };
}
