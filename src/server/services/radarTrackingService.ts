import { IRadarTarget, IRadarConfiguration, ITrackingResult } from './interfaces';

export class RadarTrackingService {
    private static readonly THREAT_SPEED_THRESHOLD = 300; // m/s (Mach 0.9)
    private static readonly THREAT_RCS_THRESHOLD = 0.1;   // m² for small missiles
    private static readonly MAX_TRACKING_TARGETS = 64;    // System capacity limit
    private static readonly INTERFERENCE_THRESHOLD = 0.7;  // 70% interference level

    private configuration: IRadarConfiguration;
    private activeTargets: Map<string, IRadarTarget> = new Map();
    private trackingHistory: Map<string, IRadarTarget[]> = new Map();

    constructor(config: IRadarConfiguration) {
        this.configuration = config;
    }

    /**
     * Primary radar tracking function - processes raw radar returns
     * Critical for air defense and threat detection
     * @param rawReturns Raw radar echo data from antenna array
     * @returns Processed tracking data with threat assessment
     */
    public processRadarReturns(rawReturns: any[]): ITrackingResult {
        try {
            // Detect interference and jamming attempts
            const interferenceLevel = this.detectInterference(rawReturns);
            
            if (interferenceLevel > RadarTrackingService.INTERFERENCE_THRESHOLD) {
                console.warn('High interference detected - possible electronic countermeasures');
                return this.executeAntiJammingProtocol(rawReturns, interferenceLevel);
            }

            // Process radar returns into target detections
            const detectedTargets = this.extractTargetsFromReturns(rawReturns);
            
            // Update tracking for existing targets
            this.updateTargetTracks(detectedTargets);
            
            // Classify threats based on behavior and signature
            const threats = this.identifyThreats(Array.from(this.activeTargets.values()));
            
            // Check system capacity and prioritize targets
            this.prioritizeTargets();

            return {
                targets: Array.from(this.activeTargets.values()),
                threats,
                systemStatus: this.determineSystemStatus(interferenceLevel),
                interferenceLevel,
                coverage: this.calculateCoverage()
            };

        } catch (error) {
            console.error('CRITICAL: Radar processing failure', error);
            return this.executeRadarFailsafe();
        }
    }

    /**
     * Detects electronic warfare interference and jamming
     * Critical for maintaining radar effectiveness in contested environments
     */
    private detectInterference(rawReturns: any[]): number {
        if (!rawReturns || rawReturns.length === 0) {
            return 1.0; // Complete signal loss
        }

        let noiseSum = 0;
        let signalSum = 0;

        for (const returnData of rawReturns) {
            const signalPower = returnData.amplitude || 0;
            const noisePower = returnData.noise || 0;
            
            signalSum += signalPower;
            noiseSum += noisePower;
        }

        // Calculate signal-to-noise ratio
        const snr = signalSum / (noiseSum + 0.01); // Avoid division by zero
        
        // Convert SNR to interference level (inverse relationship)
        const interferenceLevel = Math.max(0, Math.min(1, 1 - (snr / 10)));
        
        return interferenceLevel;
    }

    /**
     * Anti-jamming protocol - frequency hopping and adaptive filtering
     * Maintains tracking capability under electronic attack
     */
    private executeAntiJammingProtocol(rawReturns: any[], interferenceLevel: number): ITrackingResult {
        console.warn('Executing anti-jamming protocol');
        
        // Implement frequency hopping (simplified simulation)
        const hopFrequency = this.configuration.frequency * (1 + Math.random() * 0.1);
        this.configuration.frequency = hopFrequency;
        
        // Reduce detection threshold to maintain some capability
        const degradedTargets = this.extractTargetsFromReturns(rawReturns, true);
        
        // Filter targets with high confidence only
        const filteredTargets = degradedTargets.filter(target => target.confidence > 0.8);
        
        return {
            targets: filteredTargets,
            threats: this.identifyThreats(filteredTargets),
            systemStatus: 'DEGRADED',
            interferenceLevel,
            coverage: {
                azimuthScan: this.configuration.frequency > 0 ? 180 : 90, // Reduced coverage
                elevationScan: this.configuration.frequency > 0 ? 45 : 20
            }
        };
    }

    /**
     * Extracts target information from raw radar returns
     * Includes Doppler processing and range-gate analysis
     */
    private extractTargetsFromReturns(rawReturns: any[], degradedMode: boolean = false): IRadarTarget[] {
        const targets: IRadarTarget[] = [];
        const detectionThreshold = degradedMode ? 0.8 : 0.6;

        for (let i = 0; i < rawReturns.length; i++) {
            const returnData = rawReturns[i];
            
            if (!returnData || returnData.amplitude < detectionThreshold) {
                continue;
            }

            // Calculate target parameters
            const range = this.calculateRange(returnData.timeDelay);
            const azimuth = this.calculateAzimuth(returnData.antennaPosition);
            const elevation = this.calculateElevation(returnData.antennaPosition);
            const dopplerVelocity = this.calculateDopplerVelocity(returnData.frequencyShift);
            
            // Estimate radar cross section
            const rcs = this.estimateRCS(returnData.amplitude, range);
            
            const target: IRadarTarget = {
                id: `target_${Date.now()}_${i}`,
                position: {
                    range,
                    azimuth,
                    elevation
                },
                velocity: {
                    radial: dopplerVelocity,
                    tangential: this.estimateTangentialVelocity(returnData)
                },
                signature: {
                    rcs,
                    classification: this.classifyTarget(rcs, dopplerVelocity)
                },
                timestamp: Date.now(),
                confidence: Math.min(1.0, returnData.amplitude)
            };

            targets.push(target);
        }

        return targets;
    }

    /**
     * Identifies potential threats based on target behavior and characteristics
     * Critical for early warning and defense coordination
     */
    private identifyThreats(targets: IRadarTarget[]): IRadarTarget[] {
        return targets.filter(target => {
            // High-speed targets (potential missiles)
            if (Math.abs(target.velocity.radial) > RadarTrackingService.THREAT_SPEED_THRESHOLD) {
                return true;
            }

            // Small RCS targets (stealth aircraft, cruise missiles)
            if (target.signature.rcs < RadarTrackingService.THREAT_RCS_THRESHOLD) {
                return true;
            }

            // Classified military targets
            if (['missile', 'drone'].includes(target.signature.classification)) {
                return true;
            }

            // Targets with unusual flight patterns (check tracking history)
            const history = this.trackingHistory.get(target.id);
            if (history && this.hasUnusualFlightPattern(history)) {
                return true;
            }

            return false;
        });
    }

    /**
     * Updates target tracking with motion prediction and correlation
     */
    private updateTargetTracks(newTargets: IRadarTarget[]): void {
        // Clear old targets (simulate track loss after timeout)
        const currentTime = Date.now();
        for (const [id, target] of this.activeTargets.entries()) {
            if (currentTime - target.timestamp > 10000) { // 10 second timeout
                this.activeTargets.delete(id);
                this.trackingHistory.delete(id);
            }
        }

        // Update or add new targets
        for (const target of newTargets) {
            const existingTarget = this.findCorrelatedTarget(target);
            
            if (existingTarget) {
                // Update existing track
                this.updateTrackHistory(existingTarget.id, target);
                this.activeTargets.set(existingTarget.id, target);
            } else {
                // New target track
                this.activeTargets.set(target.id, target);
                this.trackingHistory.set(target.id, [target]);
            }
        }
    }

    private prioritizeTargets(): void {
        if (this.activeTargets.size <= RadarTrackingService.MAX_TRACKING_TARGETS) {
            return;
        }

        // Convert to array and sort by threat level
        const targetArray = Array.from(this.activeTargets.values());
        targetArray.sort((a, b) => {
            const aThreat = this.calculateThreatScore(a);
            const bThreat = this.calculateThreatScore(b);
            return bThreat - aThreat; // Higher threat first
        });

        // Keep only top priority targets
        this.activeTargets.clear();
        for (let i = 0; i < RadarTrackingService.MAX_TRACKING_TARGETS; i++) {
            const target = targetArray[i];
            this.activeTargets.set(target.id, target);
        }
    }

    private calculateThreatScore(target: IRadarTarget): number {
        let score = 0;
        
        // Speed factor
        score += Math.abs(target.velocity.radial) / 100;
        
        // RCS factor (smaller = more threatening)
        score += (1 / target.signature.rcs) * 0.1;
        
        // Classification factor
        if (target.signature.classification === 'missile') score += 10;
        if (target.signature.classification === 'drone') score += 5;
        
        // Range factor (closer = more threatening)
        score += (1000000 / target.position.range) * 0.001;
        
        return score;
    }

    // Helper methods for calculations
    private calculateRange(timeDelay: number): number {
        const speedOfLight = 299792458; // m/s
        return (timeDelay * speedOfLight) / 2;
    }

    private calculateAzimuth(antennaPosition: any): number {
        return antennaPosition?.azimuth || 0;
    }

    private calculateElevation(antennaPosition: any): number {
        return antennaPosition?.elevation || 0;
    }

    private calculateDopplerVelocity(frequencyShift: number): number {
        const speedOfLight = 299792458;
        return (frequencyShift * speedOfLight) / (2 * this.configuration.frequency);
    }

    private estimateRCS(amplitude: number, range: number): number {
        // Simplified RCS estimation
        return (amplitude * Math.pow(range, 4)) / this.configuration.power;
    }

    private estimateTangentialVelocity(returnData: any): number {
        return returnData.tangentialVelocity || 0;
    }

    private classifyTarget(rcs: number, velocity: number): 'aircraft' | 'missile' | 'drone' | 'decoy' | 'unknown' {
        if (Math.abs(velocity) > 500) return 'missile';
        if (rcs < 0.1) return 'drone';
        if (rcs > 100) return 'aircraft';
        if (rcs < 0.01) return 'decoy';
        return 'unknown';
    }

    private findCorrelatedTarget(newTarget: IRadarTarget): IRadarTarget | null {
        for (const target of this.activeTargets.values()) {
            const rangeDiff = Math.abs(target.position.range - newTarget.position.range);
            const azimuthDiff = Math.abs(target.position.azimuth - newTarget.position.azimuth);
            
            if (rangeDiff < 100 && azimuthDiff < 0.1) { // 100m range and 0.1 rad azimuth tolerance
                return target;
            }
        }
        return null;
    }

    private updateTrackHistory(targetId: string, newTarget: IRadarTarget): void {
        const history = this.trackingHistory.get(targetId) || [];
        history.push(newTarget);
        
        // Keep only last 10 positions
        if (history.length > 10) {
            history.shift();
        }
        
        this.trackingHistory.set(targetId, history);
    }

    private hasUnusualFlightPattern(history: IRadarTarget[]): boolean {
        if (history.length < 3) return false;
        
        // Check for erratic speed changes
        for (let i = 1; i < history.length; i++) {
            const speedChange = Math.abs(history[i].velocity.radial - history[i-1].velocity.radial);
            if (speedChange > 100) { // 100 m/s speed change
                return true;
            }
        }
        
        return false;
    }

    private determineSystemStatus(interferenceLevel: number): 'OPERATIONAL' | 'DEGRADED' | 'OFFLINE' | 'MAINTENANCE' {
        if (interferenceLevel > 0.9) return 'OFFLINE';
        if (interferenceLevel > 0.7) return 'DEGRADED';
        return 'OPERATIONAL';
    }

    private calculateCoverage(): { azimuthScan: number; elevationScan: number } {
        return {
            azimuthScan: 360, // Full 360-degree coverage
            elevationScan: 90  // 90-degree elevation coverage
        };
    }

    private executeRadarFailsafe(): ITrackingResult {
        console.error('RADAR SYSTEM FAILSAFE ACTIVATED');
        return {
            targets: [],
            threats: [],
            systemStatus: 'OFFLINE',
            interferenceLevel: 1.0,
            coverage: { azimuthScan: 0, elevationScan: 0 }
        };
    }
}
