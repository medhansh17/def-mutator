import {
  IGPSSignal,
  IMissileGuidanceData,
  INavigationResult,
  missileGuidanceService,
} from "../src/server/services";

describe("MissileGuidanceService", () => {
  const mockGuidanceData: IMissileGuidanceData = {
    targetCoordinates: {
      latitude: 34.0522,
      longitude: -118.2437,
      altitude: 100,
    },
    currentPosition: { latitude: 34.05, longitude: -118.24, altitude: 1000 },
    velocity: { x: 100, y: 0, z: 0 },
    timeToTarget: 60,
  };

  const mockGPSSignalNominal: IGPSSignal = {
    satellites: 8,
    accuracy: 2.0,
    signalStrength: 0.9,
    timestamp: Date.now(),
  };

  const mockGPSSignalDegraded: IGPSSignal = {
    satellites: 3,
    accuracy: 8.0,
    signalStrength: 0.2,
    timestamp: Date.now() - 4000,
  };

  it("should execute nominal guidance with valid GPS signal", () => {
    const result: INavigationResult = missileGuidanceService.calculateGuidanceVector(
      mockGuidanceData,
      mockGPSSignalNominal
    );
    expect(result.statusCode).toBe("NOMINAL");
    expect(result.confidenceLevel).toBeGreaterThan(0);
  });

  it("should switch to backup navigation with degraded GPS signal", () => {
    const result: INavigationResult = missileGuidanceService.calculateGuidanceVector(
      mockGuidanceData,
      mockGPSSignalDegraded
    );
    expect(result.statusCode).toBe("DEGRADED");
    expect(result.confidenceLevel).toBe(0.6);
  });

  it("should execute emergency abort with communication timeout", () => {
    const mockGPSSignalTimeout: IGPSSignal = {
      satellites: 8,
      accuracy: 2.0,
      signalStrength: 0.9,
      timestamp: Date.now() - 4000,
    };
    const result: INavigationResult = missileGuidanceService.calculateGuidanceVector(
      mockGuidanceData,
      mockGPSSignalTimeout
    );
    expect(result.statusCode).toBe("ABORT");
    expect(result.confidenceLevel).toBe(0);
  });
});
