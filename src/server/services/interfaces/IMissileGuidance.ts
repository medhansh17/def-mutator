export interface IMissileGuidanceData {
  targetCoordinates: {
    latitude: number;
    longitude: number;
    altitude: number;
  };
  currentPosition: {
    latitude: number;
    longitude: number;
    altitude: number;
  };
  velocity: {
    x: number;
    y: number;
    z: number;
  };
  timeToTarget: number;
}

export interface IGPSSignal {
  satellites: number;
  accuracy: number;
  signalStrength: number;
  timestamp: number;
}

export interface INavigationResult {
  courseCorrection: {
    pitch: number;
    yaw: number;
    roll: number;
  };
  thrustVector: {
    magnitude: number;
    direction: number;
  };
  confidenceLevel: number;
  statusCode: "NOMINAL" | "DEGRADED" | "CRITICAL" | "ABORT";
}
