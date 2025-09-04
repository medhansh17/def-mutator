Of course. As a defense system test engineer, my focus is on rigor, realism, and verifying system resilience under worst-case conditions. Here are the comprehensive Jest test cases for the specified failure scenarios, designed to stress the `RadarTrackingService` and validate its fail-safe and degradation behaviors.

---

### `RadarTrackingService.test.ts`

```typescript
import { RadarTrackingService } from './RadarTrackingService';
import { IRadarConfiguration, IRadarTarget, ITrackingResult } from './interfaces';

// Mock interfaces for standalone testing
// In a real project, these would be imported from a shared types file.
export interface IRadarTarget {
  id: string;
  position: { range: number; azimuth: number; elevation: number };
  velocity: { radial: number; tangential: number };
  signature: { rcs: number; classification: string };
  timestamp: number;
  confidence: number;
}

export interface IRadarConfiguration {
  frequency: number; // in Hz
  power: number;     // in Watts
}

export interface ITrackingResult {
  targets: IRadarTarget[];
  threats: IRadarTarget[];
  systemStatus: 'OPERATIONAL' | 'DEGRADED' | 'OFFLINE' | 'MAINTENANCE';
  interferenceLevel: number;
  coverage: { azimuthScan: number; elevationScan: number };
}


/**
 * @description Test data generation utility for creating realistic radar returns.
 * This helps maintain clean and readable test cases.
 */
const createMockReturn = (params: {
  id: number;
  timeDelay: number;
  frequencyShift: number;
  amplitude: number;
  noise?: number;
  antennaPosition?: { azimuth: number; elevation: number };
}) => {
  return {
    id: `return_${params.id}`,
    timeDelay: params.timeDelay, // Determines range
    frequencyShift: params.frequencyShift, // Determines radial velocity
    amplitude: params.amplitude, // Signal strength, affects confidence & RCS
    noise: params.noise || 0.05, // Background noise level
    antennaPosition: params.antennaPosition || { azimuth: 1.5, elevation: 0.2 },
  };
};

/**
 * @description Creates a return simulating a high-priority threat (e.g., a supersonic missile).
 */
const createHighThreatReturn = (id: number, rangeKm: number) => {
    const speedOfLight = 299792458;
    return createMockReturn({
        id,
        // High speed (Mach 2+) towards sensor -> large negative frequency shift
        frequencyShift: -7e6, 
        // Small RCS (stealthy) -> low amplitude
        amplitude: 0.7, 
        // Time delay for a given range
        timeDelay: (rangeKm * 1000 * 2) / speedOfLight, 
        antennaPosition: { azimuth: 2.1, elevation: 0.5 },
    });
};


describe('RadarTrackingService - Defense System Failure Scenarios', () => {
  let service: RadarTrackingService;
  let baseConfig: IRadarConfiguration;

  // Set up a consistent baseline configuration for all tests
  beforeEach(() => {
    baseConfig = {
      frequency: 10e9, // 10 GHz X-band radar
      power: 50000,    // 50 kW
    };
    service = new RadarTrackingService(baseConfig);
    // Use fake timers to control time-based logic like track timeouts
    jest.useFakeTimers();
  });

  afterEach(() => {
    // Restore all mocks and timers after each test to prevent side effects
    jest.restoreAllMocks();
    jest.useRealTimers();
  });

  /**
   * @description Establish a baseline for normal system operation against which
   * failure modes can be compared.
   */
  describe('Baseline Normal Operation', () => {
    it('should acquire, track, and correctly classify a standard threat', () => {
      // SCENARIO: A single, clear-as-day missile is inbound.
      const missileReturn = createHighThreatReturn(1, 100);

      const result = service.processRadarReturns([missileReturn]);

      // VERIFICATION: The system should be fully operational and tracking the threat.
      expect(result.systemStatus).toBe('OPERATIONAL');
      expect(result.interferenceLevel).toBeLessThan(0.1);
      expect(result.targets.length).toBe(1);
      expect(result.threats.length).toBe(1);
      
      const trackedThreat = result.threats[0];
      expect(trackedThreat.signature.classification).toBe('missile');
      expect(trackedThreat.velocity.radial).toBeCloseTo(-1049, 0); // Approx. -1049 m/s
    });
  });

  /**
   * @risk CRITICAL
   * @description Simulates a persistent, gradually worsening mechanical drift in the
   * radar's antenna position encoders. This failure can lead to track fragmentation
   * and an inability to form a stable fire-control solution.
   */
  describe('Failure: Persistent Mechanical Drift', () => {
    it('should fail to maintain a stable track, creating multiple fragmented tracks instead', () => {
      let result: ITrackingResult;
      const initialAzimuth = 1.5;
      const initialReturn = createMockReturn({ id: 1, timeDelay: 0.00067, frequencyShift: -5e6, amplitude: 0.9, antennaPosition: { azimuth: initialAzimuth, elevation: 0.2 } });

      // First detection: establish a track
      result = service.processRadarReturns([initialReturn]);
      expect(result.targets.length).toBe(1);
      expect(result.targets[0].position.azimuth).toBe(initialAzimuth);

      // Subsequent detections with worsening drift
      for (let i = 1; i <= 5; i++) {
        // The drift exceeds the track correlation tolerance (0.1 rad in the code)
        const drift = i * 0.12; 
        const driftingReturn = createMockReturn({
          id: 1, // Same physical target
          timeDelay: 0.00067,
          frequencyShift: -5e6,
          amplitude: 0.9,
          antennaPosition: { azimuth: initialAzimuth + drift, elevation: 0.2 },
        });

        jest.advanceTimersByTime(2000); // Simulate time between radar sweeps
        result = service.processRadarReturns([driftingReturn]);
      }

      // VERIFICATION: Instead of updating one track, the system created multiple false tracks.
      // This saturates the tracker and prevents a stable firing solution.
      expect(result.targets.length).toBeGreaterThan(1);
      expect(result.targets.length).toBeLessThanOrEqual(6); // One new track per failed correlation
      console.log(`Drift test resulted in ${result.targets.length} fragmented tracks.`);
    });
  });

  /**
   * @risk HIGH
   * @description Simulates a significant data link latency spike. The processing unit
   * receives data that is dangerously out-of-date, causing it to drop a valid track
   * and re-acquire it as new, losing valuable tracking history.
   */
  describe('Failure: Data Link Latency Spike', () => {
    it('should drop an active track due to timeout and re-acquire it as a new target', () => {
      const targetReturn = createMockReturn({ id: 1, timeDelay: 0.0005, frequencyShift: 1e6, amplitude: 0.8 });
      
      // Initial detection
      let result = service.processRadarReturns([targetReturn]);
      const initialTargetId = result.targets[0].id;
      expect(result.targets.length).toBe(1);

      // Simulate a major latency spike (15s), exceeding the 10s track timeout
      jest.advanceTimersByTime(15000);

      // The same target data finally arrives
      result = service.processRadarReturns([targetReturn]);

      // VERIFICATION: The system should have dropped the original track and created a new one.
      // The loss of track continuity is a critical failure for predictive targeting.
      expect(result.targets.length).toBe(1);
      const newTargetId = result.targets[0].id;
      expect(newTargetId).not.toBe(initialTargetId);
      console.log(`Latency test confirmed track drop: old ID ${initialTargetId}, new ID ${newTargetId}`);
    });
  });

  /**
   * @risk CRITICAL
   * @description Simulates an intermittent power brownout that degrades detection sensitivity.
   * This can make the radar temporarily blind to stealthy or distant targets, creating
   * dangerous gaps in defensive coverage.
   */
  describe('Failure: Intermittent Power Brownout', () => {
    it('should lose track of a low-signature target during the brownout and then re-acquire it', () => {
      // A stealthy target with a low-amplitude return, just above the normal detection threshold (0.6)
      const stealthyTargetReturn = createMockReturn({ id: 1, timeDelay: 0.0008, frequencyShift: -4e6, amplitude: 0.65 });

      // 1. Normal Operation: Target detected
      let result = service.processRadarReturns([stealthyTargetReturn]);
      expect(result.targets.length).toBe(1);
      const originalTargetId = result.targets[0].id;

      // 2. Brownout Simulation: The same return's amplitude drops below the detection threshold
      const brownoutReturn = { ...stealthyTargetReturn, amplitude: 0.5 };
      jest.advanceTimersByTime(2000);
      result = service.processRadarReturns([brownoutReturn]);

      // VERIFICATION (During Brownout): The system is now blind to the target.
      expect(result.targets.length).toBe(0);
      console.log('Brownout confirmed: stealth target track lost.');

      // 3. Power Recovery: Amplitude returns to normal
      jest.advanceTimersByTime(2000);
      result = service.processRadarReturns([stealthyTargetReturn]);

      // VERIFICATION (Post-Recovery): The target is re-acquired, but as a NEW track.
      expect(result.targets.length).toBe(1);
      expect(result.targets[0].id).not.toBe(originalTargetId);
      console.log('Power recovery confirmed: target re-acquired with a new track ID.');
    });
  });

  /**
   * @risk HIGH
   * @description Simulates a high-power EMI event (e.g., electronic warfare jamming)
   * that creates a flood of false 'ghost' targets, attempting to saturate the system.
   */
  describe('Failure: High-Power Electromagnetic Interference (EMI)', () => {
    it('should activate anti-jamming protocol, degrade gracefully, and prioritize real threats', () => {
      // SCENARIO: A storm of 70 ghost returns and one real high-threat missile.
      // The high noise floor simulates a jamming environment.
      const ghostReturns = Array.from({ length: 70 }, (_, i) => 
        createMockReturn({
          id: 100 + i,
          timeDelay: 0.0001 + Math.random() * 0.001,
          frequencyShift: (Math.random() - 0.5) * 1e6,
          amplitude: 0.8,
          noise: 0.6, // High noise characteristic of EMI
        })
      );
      const realThreatReturn = createHighThreatReturn(1, 80);
      realThreatReturn.noise = 0.6; // The threat is also in the jamming environment

      const allReturns = [...ghostReturns, realThreatReturn];
      const result = service.processRadarReturns(allReturns);

      // VERIFICATION 1: System correctly identifies high interference and degrades.
      expect(result.systemStatus).toBe('DEGRADED');
      expect(result.interferenceLevel).toBeGreaterThan(0.7);

      // VERIFICATION 2: System prioritizes and does not drop the high-threat target.
      // The total number of targets should be capped by MAX_TRACKING_TARGETS (64).
      const MAX_TRACKING_TARGETS = 64;
      expect(result.targets.length).toBeLessThanOrEqual(MAX_TRACKING_TARGETS);
      
      const realThreatIsTracked = result.targets.some(
        t => t.signature.classification === 'missile'
      );
      expect(realThreatIsTracked).toBe(true);
      console.log(`EMI test: System degraded, tracked ${result.targets.length} targets, and retained the real threat.`);
    });
  });

  /**
   * @risk MEDIUM
   * @description Simulates a bug or misconfiguration where the track timeout is too short.
   * This prevents stable tracks from forming even on clearly visible targets, as minor
   * delays between radar sweeps cause the track to be dropped prematurely.
   */
  describe('Failure: Excessively Short Track Timeout', () => {
    it('should drop a track between sweeps even with a short delay', () => {
      // NOTE: The timeout is hardcoded at 10s in the source. This test will simulate
      // a failure by advancing time just beyond that hardcoded value. In a real system,
      // this value would be configurable, and we would test with a misconfigured value (e.g., 1s).
      const targetReturn = createMockReturn({ id: 1, timeDelay: 0.0005, frequencyShift: 1e6, amplitude: 0.8 });

      // First detection
      let result = service.processRadarReturns([targetReturn]);
      const initialTargetId = result.targets[0].id;
      expect(result.targets.length).toBe(1);

      // Simulate a delay that is SHORTER than the correct timeout but would
      // fail a hypothetical "short timeout" of 2s. We test the existing 10s timeout here.
      jest.advanceTimersByTime(10001); // 10.001 seconds, just over the threshold

      // Next radar sweep sees the same target
      result = service.processRadarReturns([targetReturn]);

      // VERIFICATION: Track was dropped due to the timeout.
      expect(result.targets.length).toBe(1);
      expect(result.targets[0].id).not.toBe(initialTargetId);
      console.log('Short timeout simulation successful: Track was dropped and re-initialized.');
    });
  });

  /**
   * @risk CRITICAL
   * @description Simulates corrupted data packets from the sensor array, feeding
   * physically impossible values (e.g., negative time, NaN) into the processing logic.
   * The system must handle this gracefully without crashing.
   */
  describe('Failure: Corrupted Raw Return Data', () => {
    it('should trigger the system failsafe and go OFFLINE without crashing', () => {
      const corruptedReturn = {
        timeDelay: -0.001, // Physically impossible
        frequencyShift: NaN,
        amplitude: 1.0,
        antennaPosition: null, // Null pointer risk
      };

      // Spy on console.error to ensure critical failures are logged
      const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      const result = service.processRadarReturns([corruptedReturn]);

      // VERIFICATION 1: The top-level error handler was invoked and logged the issue.
      expect(errorSpy).toHaveBeenCalledWith('CRITICAL: Radar processing failure', expect.any(Error));

      // VERIFICATION 2: The system correctly entered a failsafe state.
      expect(result.systemStatus).toBe('OFFLINE');
      expect(result.targets.length).toBe(0);
      expect(result.threats.length).toBe(0);
      expect(result.coverage.azimuthScan).toBe(0);
      console.log('Data corruption test successful: System entered failsafe OFFLINE state.');
    });
  });

  /**
   * @risk HIGH
   * @description Simulates a miscalibrated reference oscillator, introducing a persistent
   * bias in all Doppler velocity measurements. This can cause the system to misclassify
   * targets, such as interpreting a slow-moving civilian aircraft as a high-speed threat.
   */
  describe('Failure: Persistent Doppler Velocity Bias', () => {
    it('should misclassify a non-threatening target as a threat due to biased velocity', () => {
      // SCENARIO: A large, slow-moving aircraft (e.g., airliner).
      // True speed: ~250 m/s. True frequency shift should be around -1.67e6.
      const trueFrequencyShift = -1.67e6;
      
      const airlinerReturn = createMockReturn({
        id: 1,
        timeDelay: 0.0006, // ~90km away
        frequencyShift: trueFrequencyShift,
        amplitude: 0.95, // High amplitude due to large RCS
      });

      // Baseline: Verify it's NOT a threat.
      const baselineResult = service.processRadarReturns([airlinerReturn]);
      expect(baselineResult.threats.length).toBe(0);
      expect(baselineResult.targets[0].velocity.radial).toBeCloseTo(-250, 0);

      // SCENARIO with BIAS: A significant positive bias is added to the frequency shift.
      const miscalibratedFrequencyShift = trueFrequencyShift - 3e6; // Adds ~450 m/s of error
      const biasedReturn = { ...airlinerReturn, frequencyShift: miscalibratedFrequencyShift };

      const biasedResult = service.processRadarReturns([biasedReturn]);
      
      // VERIFICATION: The system, due to the bias, now sees the target's speed as
      // ~700 m/s, exceeding the THREAT_SPEED_THRESHOLD (300 m/s).
      expect(biasedResult.targets[0].velocity.radial).toBeCloseTo(-700, 0);
      expect(biasedResult.threats.length).toBe(1);
      expect(biasedResult.threats[0].id).toBe(biasedResult.targets[0].id);
      console.log('Doppler bias test successful: Civilian target was misclassified as a threat.');
    });
  });
});
```