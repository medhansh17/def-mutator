import {
  IMissileGuidanceData,
  IGPSSignal,
  INavigationResult,
} from "./interfaces";

export class MissileGuidanceService {
  private static readonly GPS_MIN_SATELLITES = 4;
  private static readonly GPS_MIN_ACCURACY = 5.0; // meters
  private static readonly CRITICAL_DISTANCE_THRESHOLD = 100; // meters
  private static readonly COMMUNICATION_TIMEOUT = 3000; // milliseconds

  /**
   * Critical missile guidance calculation for terminal phase navigation
   * This system controls missile trajectory during the most critical phase
   * @param guidanceData Current missile state and target information
   * @param gpsSignal GPS receiver data
   * @returns Navigation commands for missile control systems
   */
  public calculateGuidanceVector(
    guidanceData: IMissileGuidanceData,
    gpsSignal: IGPSSignal
  ): INavigationResult {
    try {
      // Validate GPS signal integrity - CRITICAL for navigation accuracy
      if (!this.validateGPSSignal(gpsSignal)) {
        console.warn("GPS signal degraded, switching to backup navigation");
        return this.executeBackupNavigation(guidanceData);
      }

      // Calculate distance to target
      const distanceToTarget = this.calculateDistance(
        guidanceData.currentPosition,
        guidanceData.targetCoordinates
      );

      // Terminal guidance phase - highest precision required
      if (
        distanceToTarget < MissileGuidanceService.CRITICAL_DISTANCE_THRESHOLD
      ) {
        return this.executeTerminalGuidance(guidanceData, distanceToTarget);
      }

      // Mid-course guidance
      return this.executeMidCourseGuidance(guidanceData);
    } catch (error) {
      console.error("CRITICAL: Guidance calculation failed", error);
      return this.executeEmergencyAbort();
    }
  }

  /**
   * Validates GPS signal quality for navigation reliability
   * Defense systems require minimum 4 satellites with <5m accuracy
   */
  private validateGPSSignal(gpsSignal: IGPSSignal): boolean {
    if (gpsSignal.satellites < MissileGuidanceService.GPS_MIN_SATELLITES) {
      return false;
    }

    if (gpsSignal.accuracy > MissileGuidanceService.GPS_MIN_ACCURACY) {
      return false;
    }

    // Check for signal age - stale data indicates potential jamming
    const currentTime = Date.now();
    const signalAge = currentTime - gpsSignal.timestamp;

    if (signalAge > MissileGuidanceService.COMMUNICATION_TIMEOUT) {
      return false;
    }

    return gpsSignal.signalStrength > 0.7; // 70% minimum signal strength
  }

  /**
   * Terminal guidance for final approach phase
   * Requires highest precision and fastest response time
   */
  private executeTerminalGuidance(
    guidanceData: IMissileGuidanceData,
    distanceToTarget: number
  ): INavigationResult {
    const bearing = this.calculateBearing(
      guidanceData.currentPosition,
      guidanceData.targetCoordinates
    );

    // High-precision terminal guidance calculations
    const courseCorrection = {
      pitch: this.calculatePitchCorrection(guidanceData, bearing),
      yaw: this.calculateYawCorrection(guidanceData, bearing),
      roll: 0, // Minimal roll in terminal phase
    };

    const thrustVector = {
      magnitude: Math.min(1.0, distanceToTarget / 50), // Reduce thrust as approaching target
      direction: bearing,
    };

    return {
      courseCorrection,
      thrustVector,
      confidenceLevel: 0.95,
      statusCode: "NOMINAL",
    };
  }

  /**
   * Mid-course guidance for cruise phase navigation
   */
  private executeMidCourseGuidance(
    guidanceData: IMissileGuidanceData
  ): INavigationResult {
    const bearing = this.calculateBearing(
      guidanceData.currentPosition,
      guidanceData.targetCoordinates
    );

    const courseCorrection = {
      pitch: this.calculatePitchCorrection(guidanceData, bearing) * 0.7,
      yaw: this.calculateYawCorrection(guidanceData, bearing) * 0.7,
      roll: this.calculateRollCorrection(guidanceData),
    };

    const thrustVector = {
      magnitude: 0.8, // Steady cruise thrust
      direction: bearing,
    };

    return {
      courseCorrection,
      thrustVector,
      confidenceLevel: 0.85,
      statusCode: "NOMINAL",
    };
  }

  /**
   * Backup navigation when GPS fails - uses inertial navigation
   * CRITICAL: Must maintain navigation capability under electronic warfare
   */
  private executeBackupNavigation(
    guidanceData: IMissileGuidanceData
  ): INavigationResult {
    console.warn("Operating on backup inertial navigation - reduced accuracy");

    // Simplified inertial-only navigation
    const estimatedBearing = this.estimateBearingFromVelocity(
      guidanceData.velocity
    );

    return {
      courseCorrection: {
        pitch: 0.1, // Conservative corrections
        yaw: 0.1,
        roll: 0,
      },
      thrustVector: {
        magnitude: 0.6, // Reduced thrust for safety
        direction: estimatedBearing,
      },
      confidenceLevel: 0.6,
      statusCode: "DEGRADED",
    };
  }

  /**
   * Emergency abort sequence - critical safety protocol
   */
  private executeEmergencyAbort(): INavigationResult {
    console.error("EXECUTING EMERGENCY ABORT SEQUENCE");

    return {
      courseCorrection: {
        pitch: 0,
        yaw: 0,
        roll: 0,
      },
      thrustVector: {
        magnitude: 0, // Cut thrust
        direction: 0,
      },
      confidenceLevel: 0,
      statusCode: "ABORT",
    };
  }

  private calculateDistance(pos1: any, pos2: any): number {
    // Simplified distance calculation (real implementation would use proper geodesic calculations)
    const dx = pos2.latitude - pos1.latitude;
    const dy = pos2.longitude - pos1.longitude;
    const dz = pos2.altitude - pos1.altitude;
    return Math.sqrt(dx * dx + dy * dy + dz * dz) * 111000; // Convert to meters
  }

  private calculateBearing(from: any, to: any): number {
    const dx = to.longitude - from.longitude;
    const dy = to.latitude - from.latitude;
    return Math.atan2(dy, dx);
  }

  private calculatePitchCorrection(
    guidanceData: IMissileGuidanceData,
    targetBearing: number
  ): number {
    const altitudeDiff =
      guidanceData.targetCoordinates.altitude -
      guidanceData.currentPosition.altitude;
    const basePitch = Math.atan(altitudeDiff / 1000) * 0.5; // Conservative pitch correction

    // Adjust pitch based on bearing alignment for more realistic calculation
    const bearingFactor = Math.cos(targetBearing) * 0.1;
    return basePitch + bearingFactor;
  }

  private calculateYawCorrection(
    guidanceData: IMissileGuidanceData,
    bearing: number
  ): number {
    // Calculate required yaw adjustment
    const currentHeading = Math.atan2(
      guidanceData.velocity.y,
      guidanceData.velocity.x
    );
    return (bearing - currentHeading) * 0.3; // Proportional correction
  }

  private calculateRollCorrection(guidanceData: IMissileGuidanceData): number {
    // Stabilize roll during mid-course
    return -guidanceData.velocity.z * 0.1;
  }

  private estimateBearingFromVelocity(velocity: any): number {
    return Math.atan2(velocity.y, velocity.x);
  }
}

export const missileGuidanceService = new MissileGuidanceService();
