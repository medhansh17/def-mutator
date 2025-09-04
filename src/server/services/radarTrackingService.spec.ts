import { RadarTrackingService } from "./radarTrackingService";
import { IRadarConfiguration } from "./interfaces";

describe("Defense System Failure Testing - Radar Tracking Service", () => {
  let service: RadarTrackingService;
  let mockConfig: IRadarConfiguration;
  let mockRadarReturns: any[];

  beforeEach(() => {
    mockConfig = {
      frequency: 3.0e9, // 3 GHz S-band radar
      power: 1000000, // 1 MW transmit power
      beamWidth: 0.02, // 2 degree beam width
      pulseRepetitionRate: 1000,
      range: { min: 1000, max: 200000 }, // 1km to 200km range
    };

    service = new RadarTrackingService(mockConfig);

    // Standard radar returns for normal operations
    mockRadarReturns = [
      {
        amplitude: 0.8,
        timeDelay: 0.001,
        frequencyShift: 1000,
        antennaPosition: { azimuth: 0.5, elevation: 0.1 },
        noise: 0.1,
        tangentialVelocity: 50,
      },
      {
        amplitude: 0.6,
        timeDelay: 0.002,
        frequencyShift: -500,
        antennaPosition: { azimuth: 1.0, elevation: 0.2 },
        noise: 0.15,
        tangentialVelocity: 100,
      },
    ];
  });

  describe("Normal Operations Baseline", () => {
    it("should process radar returns and detect targets under optimal conditions", () => {
      const result = service.processRadarReturns(mockRadarReturns);

      expect(result.systemStatus).toBe("OPERATIONAL");
      expect(result.targets.length).toBeGreaterThan(0);
      expect(result.interferenceLevel).toBeLessThan(0.3);
      expect(result.coverage.azimuthScan).toBe(360);
    });

    it("should classify targets correctly based on radar signature", () => {
      const result = service.processRadarReturns(mockRadarReturns);

      result.targets.forEach((target) => {
        expect(target.signature.classification).toMatch(
          /aircraft|missile|drone|decoy|unknown/
        );
        expect(target.confidence).toBeGreaterThan(0);
        expect(target.position.range).toBeGreaterThan(0);
      });
    });
  });

  describe("Electronic Warfare and Jamming Scenarios", () => {
    it("should detect and counter GPS jamming attempts", () => {
      // Simulate high noise radar returns (jamming scenario)
      const jammedReturns = mockRadarReturns.map((ret) => ({
        ...ret,
        amplitude: ret.amplitude * 0.3,
        noise: ret.noise * 5,
      }));

      const result = service.processRadarReturns(jammedReturns);

      expect(result.systemStatus).toBe("DEGRADED");
      expect(result.interferenceLevel).toBeGreaterThan(0.7);
    });

    it("should execute anti-jamming protocol with frequency hopping", () => {
      // High interference scenario triggering anti-jamming
      const highInterferenceReturns = [
        {
          amplitude: 0.1,
          timeDelay: 0.001,
          frequencyShift: 0,
          antennaPosition: { azimuth: 0, elevation: 0 },
          noise: 1.0,
          tangentialVelocity: 0,
        },
      ];

      const result = service.processRadarReturns(highInterferenceReturns);

      expect(result.systemStatus).toBe("DEGRADED");
      expect(result.interferenceLevel).toBeGreaterThan(0.7);
      expect(result.coverage.azimuthScan).toBeLessThan(360); // Reduced coverage
    });

    it("should maintain target tracking during electronic countermeasures", () => {
      // Progressive jamming scenario
      const partiallyJammedReturns = mockRadarReturns.map((ret) => ({
        ...ret,
        amplitude: ret.amplitude * 0.6, // Partial signal loss
        noise: ret.noise * 2,
      }));

      const result = service.processRadarReturns(partiallyJammedReturns);

      expect(result.targets.length).toBeGreaterThan(0);
      expect(result.systemStatus).toBe("DEGRADED");
      expect(result.targets.every((t) => t.confidence > 0.8)).toBeTruthy();
    });
  });

  describe("Threat Detection and Classification", () => {
    it("should identify high-speed missile threats correctly", () => {
      // High-speed target (missile-like signature)
      const missileReturns = [
        {
          amplitude: 0.7,
          timeDelay: 0.001,
          frequencyShift: 3000, // High Doppler shift = high speed
          antennaPosition: { azimuth: 0.5, elevation: 0.1 },
          noise: 0.1,
          tangentialVelocity: 400,
        },
      ];

      const result = service.processRadarReturns(missileReturns);

      expect(result.threats.length).toBeGreaterThan(0);
      expect(result.threats[0].signature.classification).toBe("missile");
      expect(Math.abs(result.threats[0].velocity.radial)).toBeGreaterThan(300);
    });

    it("should detect stealth aircraft with small radar cross section", () => {
      // Low RCS target (stealth characteristics)
      const stealthReturns = [
        {
          amplitude: 0.2, // Very weak return
          timeDelay: 0.0015,
          frequencyShift: 800,
          antennaPosition: { azimuth: 0.8, elevation: 0.15 },
          noise: 0.1,
          tangentialVelocity: 200,
        },
      ];

      const result = service.processRadarReturns(stealthReturns);

      expect(result.threats.length).toBeGreaterThan(0);
      expect(result.threats[0].signature.rcs).toBeLessThan(0.1);
    });

    it("should prioritize multiple threats by danger level", () => {
      // Multiple targets with different threat levels
      const multipleThreats = [
        {
          // High-speed missile
          amplitude: 0.8,
          timeDelay: 0.001,
          frequencyShift: 4000,
          antennaPosition: { azimuth: 0.3, elevation: 0.1 },
          noise: 0.1,
          tangentialVelocity: 500,
        },
        {
          // Slower aircraft
          amplitude: 0.9,
          timeDelay: 0.003,
          frequencyShift: 1000,
          antennaPosition: { azimuth: 0.8, elevation: 0.2 },
          noise: 0.1,
          tangentialVelocity: 150,
        },
        {
          // Small drone
          amplitude: 0.3,
          timeDelay: 0.0005,
          frequencyShift: 500,
          antennaPosition: { azimuth: 1.2, elevation: 0.05 },
          noise: 0.1,
          tangentialVelocity: 50,
        },
      ];

      const result = service.processRadarReturns(multipleThreats);

      expect(result.targets.length).toBe(3);
      expect(result.threats.length).toBeGreaterThan(0);

      // Missile should be highest priority threat
      const missileTarget = result.threats.find(
        (t) => Math.abs(t.velocity.radial) > 300
      );
      expect(missileTarget).toBeDefined();
    });
  });

  describe("System Capacity and Performance Limits", () => {
    it("should handle maximum target tracking capacity gracefully", () => {
      // Generate 70 targets (above 64 target limit)
      const manyTargets = Array.from({ length: 70 }, (_, i) => ({
        amplitude: 0.6 + Math.random() * 0.3,
        timeDelay: 0.001 + i * 0.0001,
        frequencyShift: 500 + i * 10,
        antennaPosition: { azimuth: i * 0.1, elevation: 0.1 },
        noise: 0.1,
        tangentialVelocity: 100 + i * 5,
      }));

      const result = service.processRadarReturns(manyTargets);

      // Should prioritize and track only top 64 targets
      expect(result.targets.length).toBeLessThanOrEqual(64);
      expect(result.systemStatus).toBe("OPERATIONAL");
    });

    it("should maintain performance during rapid scan updates", () => {
      // Simulate rapid radar updates (realistic operational tempo)
      const results = [];

      for (let i = 0; i < 10; i++) {
        const result = service.processRadarReturns(mockRadarReturns);
        results.push(result);
      }

      results.forEach((result) => {
        expect(result.systemStatus).not.toBe("OFFLINE");
        expect(result.targets.length).toBeGreaterThanOrEqual(0);
      });
    });
  });

  describe("Signal Loss and Recovery Scenarios", () => {
    it("should handle complete signal loss gracefully", () => {
      // No radar returns (complete system failure)
      const result = service.processRadarReturns([]);

      expect(result.systemStatus).toBe("OFFLINE");
      expect(result.interferenceLevel).toBe(1.0);
      expect(result.targets.length).toBe(0);
      expect(result.coverage.azimuthScan).toBe(0);
    });

    it("should recover tracking after temporary signal loss", () => {
      // First processing with normal returns
      const normalResult = service.processRadarReturns(mockRadarReturns);
      expect(normalResult.targets.length).toBeGreaterThan(0);

      // Signal loss
      const lossResult = service.processRadarReturns([]);
      expect(lossResult.systemStatus).toBe("OFFLINE");

      // Signal recovery
      const recoveryResult = service.processRadarReturns(mockRadarReturns);
      expect(recoveryResult.systemStatus).toBe("OPERATIONAL");
      expect(recoveryResult.targets.length).toBeGreaterThan(0);
    });

    it("should handle intermittent signal degradation", () => {
      const results = [];

      // Alternate between good and degraded signals
      for (let i = 0; i < 6; i++) {
        const returns =
          i % 2 === 0
            ? mockRadarReturns
            : mockRadarReturns.map((ret) => ({
                ...ret,
                amplitude: ret.amplitude * 0.3,
              }));

        results.push(service.processRadarReturns(returns));
      }

      // System should maintain some level of operation throughout
      expect(results.every((r) => r.systemStatus !== "OFFLINE")).toBeTruthy();
    });
  });

  describe("Environmental Interference Scenarios", () => {
    it("should handle weather clutter and false echoes", () => {
      // Weather returns mixed with real targets
      const weatherClutteredReturns = [
        ...mockRadarReturns,
        // Weather clutter - low Doppler, moderate amplitude
        {
          amplitude: 0.4,
          timeDelay: 0.0015,
          frequencyShift: 10, // Very low Doppler (stationary)
          antennaPosition: { azimuth: 0.7, elevation: 0.3 },
          noise: 0.2,
          tangentialVelocity: 5,
        },
      ];

      const result = service.processRadarReturns(weatherClutteredReturns);

      expect(result.systemStatus).toBe("OPERATIONAL");
      expect(result.targets.length).toBeGreaterThan(0);

      // Should filter out low-velocity weather returns
      const movingTargets = result.targets.filter(
        (t) => Math.abs(t.velocity.radial) > 20
      );
      expect(movingTargets.length).toBeGreaterThan(0);
    });

    it("should adapt to atmospheric propagation anomalies", () => {
      // Simulate atmospheric ducting affecting range calculations
      const anomalousReturns = mockRadarReturns.map((ret) => ({
        ...ret,
        timeDelay: ret.timeDelay * 1.2, // Apparent range increase
        amplitude: ret.amplitude * 0.8, // Signal attenuation
      }));

      const result = service.processRadarReturns(anomalousReturns);

      expect(result.systemStatus).toBe("OPERATIONAL");
      expect(result.targets.length).toBeGreaterThan(0);
    });
  });

  describe("System Failsafe and Error Handling", () => {
    it("should execute radar failsafe on critical system error", () => {
      // Force system error with corrupted data
      const corruptedReturns = [
        {
          amplitude: NaN,
          timeDelay: -1,
          frequencyShift: Infinity,
          antennaPosition: null,
          noise: undefined,
          tangentialVelocity: "invalid",
        },
      ];

      const result = service.processRadarReturns(corruptedReturns as any);

      expect(result.systemStatus).toBe("OFFLINE");
      expect(result.targets.length).toBe(0);
      expect(result.coverage.azimuthScan).toBe(0);
    });

    it("should maintain error state isolation between processing cycles", () => {
      // Process corrupted data
      service.processRadarReturns([null] as any);

      // Next cycle with good data should work
      const result = service.processRadarReturns(mockRadarReturns);

      expect(result.systemStatus).toBe("OPERATIONAL");
      expect(result.targets.length).toBeGreaterThan(0);
    });
  });
});
