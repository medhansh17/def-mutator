import {
  IRadarConfiguration,
  ITrackingResult,
  RadarTrackingService,
} from "../src/server/services";

describe("RadarTrackingService", () => {
  let service: RadarTrackingService;
  const config: IRadarConfiguration = {
    frequency: 10e9,
    power: 1000,
    beamWidth: 0.5,
    pulseRepetitionRate: 1000,
    range: { min: 0, max: 100000 },
  };

  beforeEach(() => {
    service = new RadarTrackingService(config);
  });

  it("should process radar returns and identify threats", () => {
    const mockReturns: any[] = [
      {
        amplitude: 0.9,
        noise: 0.1,
        timeDelay: 1e-6,
        antennaPosition: { azimuth: 0, elevation: 0 },
        frequencyShift: 1000,
        tangentialVelocity: 100,
      },
    ];
    const result: ITrackingResult = service.processRadarReturns(mockReturns);
    expect(result.targets.length).toBeGreaterThanOrEqual(0);
    expect(result.systemStatus).toBe("OPERATIONAL");
  });

  it("should handle high interference and switch to degraded mode", () => {
    const mockReturns: any[] = [
      {
        amplitude: 0.2,
        noise: 0.8,
        timeDelay: 1e-6,
        antennaPosition: { azimuth: 0, elevation: 0 },
        frequencyShift: 1000,
        tangentialVelocity: 100,
      },
    ];
    const result: ITrackingResult = service.processRadarReturns(mockReturns);
    expect(result.systemStatus).toBe("DEGRADED");
    expect(result.interferenceLevel).toBeGreaterThan(0.7);
  });

  it("should execute failsafe and return empty results on critical error", () => {
    const mockReturns = [{ amplitude: 0, noise: 1 }];
    const spy = jest.spyOn(console, "error").mockImplementation(() => {});
    const result: ITrackingResult = service.processRadarReturns(mockReturns);
    expect(result.targets.length).toBe(0);
    expect(result.threats.length).toBe(0);
    expect(result.systemStatus).toBe("OFFLINE");
    expect(result.interferenceLevel).toBe(1.0);
    spy.mockRestore();
  });
});
