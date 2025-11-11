import { RadarTrackingService } from './radarTrackingService';
import { IRadarConfiguration, IRadarTarget } from './interfaces/IRadarTracking';

describe('RadarTrackingService - Failure Scenarios', () => {
    let radarService: RadarTrackingService;
    const baseConfig: IRadarConfiguration = {
        frequency: 10e9, // 10 GHz
        power: 50000, // 50 kW
        beamWidth: 0.5,
        pulseRepetitionRate: 2000,
        range: { min: 1000, max: 250000 },
    };

    beforeEach(() => {
        radarService = new RadarTrackingService(baseConfig);
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    test('[Critical Risk] should misclassify a high-speed missile threat due to flawed identification logic', () => {
        // SCENARIO: The core threat identification logic fails, ignoring targets that meet threat criteria.
        // We simulate this by mocking the private 'identifyThreats' method to return an empty array.
        const identifyThreatsSpy = jest.spyOn(radarService as any, 'identifyThreats').mockImplementation(() => []);

        // Mock raw data for a high-speed incoming missile (velocity > 300 m/s)
        const mockMissileReturn = [{
            timeDelay: 0.000333, // Approx 50km range
            frequencyShift: 200000, // Corresponds to ~3000 m/s radial velocity
            amplitude: 0.9,
            noise: 0.1,
            antennaPosition: { azimuth: 1.57, elevation: 0.2 },
        }];

        const result = radarService.processRadarReturns(mockMissileReturn);

        // VERIFY: The target was detected and is in the main tracking list.
        expect(result.targets).toHaveLength(1);
        const detectedTarget = result.targets[0];
        expect(detectedTarget.velocity.radial).toBeGreaterThan(300);
        expect(detectedTarget.signature.classification).toBe('missile');

        // VERIFY FAILURE: Despite being a clear threat, the threats list is empty due to the simulated logic failure.
        expect(result.threats).toHaveLength(0);
        expect(identifyThreatsSpy).toHaveBeenCalled();
    });

    test('[High Risk] should create duplicate ghost tracks for a single target due to track correlation failure', () => {
        // SCENARIO: The logic to correlate a new detection with an existing track is too strict and fails,
        // treating a subsequent detection of the same target as a new, separate "ghost" target.
        const findCorrelatedTargetSpy = jest.spyOn(radarService as any, 'findCorrelatedTarget').mockImplementation(() => null);

        // First radar sweep detects the target
        const firstSweepReturns = [{
            timeDelay: 0.0006, // 90km
            amplitude: 0.85,
            noise: 0.15,
            frequencyShift: 30000, // ~450 m/s
            antennaPosition: { azimuth: 2.1, elevation: 0.3 },
        }];
        const firstResult = radarService.processRadarReturns(firstSweepReturns);
        expect(firstResult.targets).toHaveLength(1);
        const originalTargetId = firstResult.targets[0].id;

        // Second radar sweep detects the same target with slight variations
        const secondSweepReturns = [{
            timeDelay: 0.00059, // 88.5km (moved closer)
            amplitude: 0.86,
            noise: 0.14,
            frequencyShift: 30000,
            antennaPosition: { azimuth: 2.11, elevation: 0.3 },
        }];
        const secondResult = radarService.processRadarReturns(secondSweepReturns);

        // VERIFY FAILURE: The system now tracks two targets instead of updating the original one.
        expect(secondResult.targets).toHaveLength(2);
        expect(secondResult.targets.some(t => t.id === originalTargetId)).toBe(true);
        expect(findCorrelatedTargetSpy).toHaveBeenCalledTimes(2); // Called for first and second sweep
    });
    
    test('[Critical Risk] should fail to activate anti-jamming protocols due to a desensitized interference detector', () => {
        // SCENARIO: The interference detection mechanism is faulty (desensitized) and reports a low
        // interference level even when the signal-to-noise ratio is extremely poor, preventing
        // the activation of critical anti-jamming countermeasures.
        const detectInterferenceSpy = jest.spyOn(radarService as any, 'detectInterference').mockReturnValue(0.1); // Reports only 10% interference
        const antiJammingSpy = jest.spyOn(radarService as any, 'executeAntiJammingProtocol');
        
        // Mock raw data representing heavy jamming: lots of noise, very little valid signal
        const jammedReturns = Array.from({ length: 50 }, () => ({
            amplitude: Math.random() * 0.2, // Weak signal
            noise: 0.9 + Math.random() * 0.1, // Very high noise floor
        }));

        const result = radarService.processRadarReturns(jammedReturns);

        // VERIFY FAILURE:
        // 1. The system incorrectly reports a low interference level and remains 'OPERATIONAL'. The actual
        //    interference level should have been high enough (>0.7) to trigger a 'DEGRADED' state.
        expect(detectInterferenceSpy).toHaveBeenCalled();
        expect(result.interferenceLevel).toBe(0.1);
        expect(result.systemStatus).toBe('OPERATIONAL');

        // 2. The crucial anti-jamming protocol was never executed.
        expect(antiJammingSpy).not.toHaveBeenCalled();
    });
});