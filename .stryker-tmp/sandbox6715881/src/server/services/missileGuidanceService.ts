// @ts-nocheck
function stryNS_9fa48() {
  var g = new Function("return this")();
  var ns = g.__stryker__ || (g.__stryker__ = {});

  if (ns.activeMutant === undefined && g.process && g.process.env && g.process.env.__STRYKER_ACTIVE_MUTANT__) {
    ns.activeMutant = g.process.env.__STRYKER_ACTIVE_MUTANT__;
  }

  function retrieveNS() {
    return ns;
  }

  stryNS_9fa48 = retrieveNS;
  return retrieveNS();
}

stryNS_9fa48();

function stryCov_9fa48() {
  var ns = stryNS_9fa48();
  var cov = ns.mutantCoverage || (ns.mutantCoverage = {
    static: {},
    perTest: {}
  });

  function cover() {
    var c = cov.static;

    if (ns.currentTestId) {
      c = cov.perTest[ns.currentTestId] = cov.perTest[ns.currentTestId] || {};
    }

    var a = arguments;

    for (var i = 0; i < a.length; i++) {
      c[a[i]] = (c[a[i]] || 0) + 1;
    }
  }

  stryCov_9fa48 = cover;
  cover.apply(null, arguments);
}

function stryMutAct_9fa48(id) {
  var ns = stryNS_9fa48();

  function isActive(id) {
    if (ns.activeMutant === id) {
      if (ns.hitCount !== void 0 && ++ns.hitCount > ns.hitLimit) {
        throw new Error('Stryker: Hit count limit reached (' + ns.hitCount + ')');
      }

      return true;
    }

    return false;
  }

  stryMutAct_9fa48 = isActive;
  return isActive(id);
}

import { IMissileGuidanceData, IGPSSignal, INavigationResult } from './interfaces';
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

  public calculateGuidanceVector(guidanceData: IMissileGuidanceData, gpsSignal: IGPSSignal): INavigationResult {
    if (stryMutAct_9fa48("57")) {
      {}
    } else {
      stryCov_9fa48("57");

      try {
        if (stryMutAct_9fa48("58")) {
          {}
        } else {
          stryCov_9fa48("58");

          // Validate GPS signal integrity - CRITICAL for navigation accuracy
          if (stryMutAct_9fa48("61") ? false : stryMutAct_9fa48("60") ? true : stryMutAct_9fa48("59") ? this.validateGPSSignal(gpsSignal) : (stryCov_9fa48("59", "60", "61"), !this.validateGPSSignal(gpsSignal))) {
            if (stryMutAct_9fa48("62")) {
              {}
            } else {
              stryCov_9fa48("62");
              console.warn(stryMutAct_9fa48("63") ? "" : (stryCov_9fa48("63"), 'GPS signal degraded, switching to backup navigation'));
              return this.executeBackupNavigation(guidanceData);
            }
          } // Calculate distance to target


          const distanceToTarget = this.calculateDistance(guidanceData.currentPosition, guidanceData.targetCoordinates); // Terminal guidance phase - highest precision required

          if (stryMutAct_9fa48("67") ? distanceToTarget >= MissileGuidanceService.CRITICAL_DISTANCE_THRESHOLD : stryMutAct_9fa48("66") ? distanceToTarget <= MissileGuidanceService.CRITICAL_DISTANCE_THRESHOLD : stryMutAct_9fa48("65") ? false : stryMutAct_9fa48("64") ? true : (stryCov_9fa48("64", "65", "66", "67"), distanceToTarget < MissileGuidanceService.CRITICAL_DISTANCE_THRESHOLD)) {
            if (stryMutAct_9fa48("68")) {
              {}
            } else {
              stryCov_9fa48("68");
              return this.executeTerminalGuidance(guidanceData, distanceToTarget);
            }
          } // Mid-course guidance


          return this.executeMidCourseGuidance(guidanceData);
        }
      } catch (error) {
        if (stryMutAct_9fa48("69")) {
          {}
        } else {
          stryCov_9fa48("69");
          console.error(stryMutAct_9fa48("70") ? "" : (stryCov_9fa48("70"), 'CRITICAL: Guidance calculation failed'), error);
          return this.executeEmergencyAbort();
        }
      }
    }
  }
  /**
   * Validates GPS signal quality for navigation reliability
   * Defense systems require minimum 4 satellites with <5m accuracy
   */


  private validateGPSSignal(gpsSignal: IGPSSignal): boolean {
    if (stryMutAct_9fa48("71")) {
      {}
    } else {
      stryCov_9fa48("71");

      if (stryMutAct_9fa48("75") ? gpsSignal.satellites >= MissileGuidanceService.GPS_MIN_SATELLITES : stryMutAct_9fa48("74") ? gpsSignal.satellites <= MissileGuidanceService.GPS_MIN_SATELLITES : stryMutAct_9fa48("73") ? false : stryMutAct_9fa48("72") ? true : (stryCov_9fa48("72", "73", "74", "75"), gpsSignal.satellites < MissileGuidanceService.GPS_MIN_SATELLITES)) {
        if (stryMutAct_9fa48("76")) {
          {}
        } else {
          stryCov_9fa48("76");
          return stryMutAct_9fa48("77") ? true : (stryCov_9fa48("77"), false);
        }
      }

      if (stryMutAct_9fa48("81") ? gpsSignal.accuracy <= MissileGuidanceService.GPS_MIN_ACCURACY : stryMutAct_9fa48("80") ? gpsSignal.accuracy >= MissileGuidanceService.GPS_MIN_ACCURACY : stryMutAct_9fa48("79") ? false : stryMutAct_9fa48("78") ? true : (stryCov_9fa48("78", "79", "80", "81"), gpsSignal.accuracy > MissileGuidanceService.GPS_MIN_ACCURACY)) {
        if (stryMutAct_9fa48("82")) {
          {}
        } else {
          stryCov_9fa48("82");
          return stryMutAct_9fa48("83") ? true : (stryCov_9fa48("83"), false);
        }
      } // Check for signal age - stale data indicates potential jamming


      const currentTime = Date.now();
      const signalAge = stryMutAct_9fa48("84") ? currentTime + gpsSignal.timestamp : (stryCov_9fa48("84"), currentTime - gpsSignal.timestamp);

      if (stryMutAct_9fa48("88") ? signalAge <= MissileGuidanceService.COMMUNICATION_TIMEOUT : stryMutAct_9fa48("87") ? signalAge >= MissileGuidanceService.COMMUNICATION_TIMEOUT : stryMutAct_9fa48("86") ? false : stryMutAct_9fa48("85") ? true : (stryCov_9fa48("85", "86", "87", "88"), signalAge > MissileGuidanceService.COMMUNICATION_TIMEOUT)) {
        if (stryMutAct_9fa48("89")) {
          {}
        } else {
          stryCov_9fa48("89");
          return stryMutAct_9fa48("90") ? true : (stryCov_9fa48("90"), false);
        }
      }

      return stryMutAct_9fa48("94") ? gpsSignal.signalStrength <= 0.7 : stryMutAct_9fa48("93") ? gpsSignal.signalStrength >= 0.7 : stryMutAct_9fa48("92") ? false : stryMutAct_9fa48("91") ? true : (stryCov_9fa48("91", "92", "93", "94"), gpsSignal.signalStrength > 0.7); // 70% minimum signal strength
    }
  }
  /**
   * Terminal guidance for final approach phase
   * Requires highest precision and fastest response time
   */


  private executeTerminalGuidance(guidanceData: IMissileGuidanceData, distanceToTarget: number): INavigationResult {
    if (stryMutAct_9fa48("95")) {
      {}
    } else {
      stryCov_9fa48("95");
      const bearing = this.calculateBearing(guidanceData.currentPosition, guidanceData.targetCoordinates); // High-precision terminal guidance calculations

      const courseCorrection = stryMutAct_9fa48("96") ? {} : (stryCov_9fa48("96"), {
        pitch: this.calculatePitchCorrection(guidanceData, bearing),
        yaw: this.calculateYawCorrection(guidanceData, bearing),
        roll: 0 // Minimal roll in terminal phase

      });
      const thrustVector = stryMutAct_9fa48("97") ? {} : (stryCov_9fa48("97"), {
        magnitude: Math.min(1.0, stryMutAct_9fa48("98") ? distanceToTarget * 50 : (stryCov_9fa48("98"), distanceToTarget / 50)),
        // Reduce thrust as approaching target
        direction: bearing
      });
      return stryMutAct_9fa48("99") ? {} : (stryCov_9fa48("99"), {
        courseCorrection,
        thrustVector,
        confidenceLevel: 0.95,
        statusCode: stryMutAct_9fa48("100") ? "" : (stryCov_9fa48("100"), 'NOMINAL')
      });
    }
  }
  /**
   * Mid-course guidance for cruise phase navigation
   */


  private executeMidCourseGuidance(guidanceData: IMissileGuidanceData): INavigationResult {
    if (stryMutAct_9fa48("101")) {
      {}
    } else {
      stryCov_9fa48("101");
      const bearing = this.calculateBearing(guidanceData.currentPosition, guidanceData.targetCoordinates);
      const courseCorrection = stryMutAct_9fa48("102") ? {} : (stryCov_9fa48("102"), {
        pitch: stryMutAct_9fa48("103") ? this.calculatePitchCorrection(guidanceData, bearing) / 0.7 : (stryCov_9fa48("103"), this.calculatePitchCorrection(guidanceData, bearing) * 0.7),
        yaw: stryMutAct_9fa48("104") ? this.calculateYawCorrection(guidanceData, bearing) / 0.7 : (stryCov_9fa48("104"), this.calculateYawCorrection(guidanceData, bearing) * 0.7),
        roll: this.calculateRollCorrection(guidanceData)
      });
      const thrustVector = stryMutAct_9fa48("105") ? {} : (stryCov_9fa48("105"), {
        magnitude: 0.8,
        // Steady cruise thrust
        direction: bearing
      });
      return stryMutAct_9fa48("106") ? {} : (stryCov_9fa48("106"), {
        courseCorrection,
        thrustVector,
        confidenceLevel: 0.85,
        statusCode: stryMutAct_9fa48("107") ? "" : (stryCov_9fa48("107"), 'NOMINAL')
      });
    }
  }
  /**
   * Backup navigation when GPS fails - uses inertial navigation
   * CRITICAL: Must maintain navigation capability under electronic warfare
   */


  private executeBackupNavigation(guidanceData: IMissileGuidanceData): INavigationResult {
    if (stryMutAct_9fa48("108")) {
      {}
    } else {
      stryCov_9fa48("108");
      console.warn(stryMutAct_9fa48("109") ? "" : (stryCov_9fa48("109"), 'Operating on backup inertial navigation - reduced accuracy')); // Simplified inertial-only navigation

      const estimatedBearing = this.estimateBearingFromVelocity(guidanceData.velocity);
      return stryMutAct_9fa48("110") ? {} : (stryCov_9fa48("110"), {
        courseCorrection: stryMutAct_9fa48("111") ? {} : (stryCov_9fa48("111"), {
          pitch: 0.1,
          // Conservative corrections
          yaw: 0.1,
          roll: 0
        }),
        thrustVector: stryMutAct_9fa48("112") ? {} : (stryCov_9fa48("112"), {
          magnitude: 0.6,
          // Reduced thrust for safety
          direction: estimatedBearing
        }),
        confidenceLevel: 0.6,
        statusCode: stryMutAct_9fa48("113") ? "" : (stryCov_9fa48("113"), 'DEGRADED')
      });
    }
  }
  /**
   * Emergency abort sequence - critical safety protocol
   */


  private executeEmergencyAbort(): INavigationResult {
    if (stryMutAct_9fa48("114")) {
      {}
    } else {
      stryCov_9fa48("114");
      console.error(stryMutAct_9fa48("115") ? "" : (stryCov_9fa48("115"), 'EXECUTING EMERGENCY ABORT SEQUENCE'));
      return stryMutAct_9fa48("116") ? {} : (stryCov_9fa48("116"), {
        courseCorrection: stryMutAct_9fa48("117") ? {} : (stryCov_9fa48("117"), {
          pitch: 0,
          yaw: 0,
          roll: 0
        }),
        thrustVector: stryMutAct_9fa48("118") ? {} : (stryCov_9fa48("118"), {
          magnitude: 0,
          // Cut thrust
          direction: 0
        }),
        confidenceLevel: 0,
        statusCode: stryMutAct_9fa48("119") ? "" : (stryCov_9fa48("119"), 'ABORT')
      });
    }
  }

  private calculateDistance(pos1: any, pos2: any): number {
    if (stryMutAct_9fa48("120")) {
      {}
    } else {
      stryCov_9fa48("120");
      // Simplified distance calculation (real implementation would use proper geodesic calculations)
      const dx = stryMutAct_9fa48("121") ? pos2.latitude + pos1.latitude : (stryCov_9fa48("121"), pos2.latitude - pos1.latitude);
      const dy = stryMutAct_9fa48("122") ? pos2.longitude + pos1.longitude : (stryCov_9fa48("122"), pos2.longitude - pos1.longitude);
      const dz = stryMutAct_9fa48("123") ? pos2.altitude + pos1.altitude : (stryCov_9fa48("123"), pos2.altitude - pos1.altitude);
      return stryMutAct_9fa48("124") ? Math.sqrt(stryMutAct_9fa48("125") ? (stryMutAct_9fa48("127") ? dx / dx : (stryCov_9fa48("127"), dx * dx)) + (stryMutAct_9fa48("128") ? dy / dy : (stryCov_9fa48("128"), dy * dy)) - dz * dz : (stryCov_9fa48("125"), (stryMutAct_9fa48("126") ? dx * dx - dy * dy : (stryCov_9fa48("126"), (stryMutAct_9fa48("127") ? dx / dx : (stryCov_9fa48("127"), dx * dx)) + (stryMutAct_9fa48("128") ? dy / dy : (stryCov_9fa48("128"), dy * dy)))) + (stryMutAct_9fa48("129") ? dz / dz : (stryCov_9fa48("129"), dz * dz)))) / 111000 : (stryCov_9fa48("124"), Math.sqrt(stryMutAct_9fa48("125") ? (stryMutAct_9fa48("127") ? dx / dx : (stryCov_9fa48("127"), dx * dx)) + (stryMutAct_9fa48("128") ? dy / dy : (stryCov_9fa48("128"), dy * dy)) - dz * dz : (stryCov_9fa48("125"), (stryMutAct_9fa48("126") ? dx * dx - dy * dy : (stryCov_9fa48("126"), (stryMutAct_9fa48("127") ? dx / dx : (stryCov_9fa48("127"), dx * dx)) + (stryMutAct_9fa48("128") ? dy / dy : (stryCov_9fa48("128"), dy * dy)))) + (stryMutAct_9fa48("129") ? dz / dz : (stryCov_9fa48("129"), dz * dz)))) * 111000); // Convert to meters
    }
  }

  private calculateBearing(from: any, to: any): number {
    if (stryMutAct_9fa48("130")) {
      {}
    } else {
      stryCov_9fa48("130");
      const dx = stryMutAct_9fa48("131") ? to.longitude + from.longitude : (stryCov_9fa48("131"), to.longitude - from.longitude);
      const dy = stryMutAct_9fa48("132") ? to.latitude + from.latitude : (stryCov_9fa48("132"), to.latitude - from.latitude);
      return Math.atan2(dy, dx);
    }
  }

  private calculatePitchCorrection(guidanceData: IMissileGuidanceData, targetBearing: number): number {
    if (stryMutAct_9fa48("133")) {
      {}
    } else {
      stryCov_9fa48("133");
      const altitudeDiff = stryMutAct_9fa48("134") ? guidanceData.targetCoordinates.altitude + guidanceData.currentPosition.altitude : (stryCov_9fa48("134"), guidanceData.targetCoordinates.altitude - guidanceData.currentPosition.altitude);
      const basePitch = stryMutAct_9fa48("135") ? Math.atan(stryMutAct_9fa48("136") ? altitudeDiff * 1000 : (stryCov_9fa48("136"), altitudeDiff / 1000)) / 0.5 : (stryCov_9fa48("135"), Math.atan(stryMutAct_9fa48("136") ? altitudeDiff * 1000 : (stryCov_9fa48("136"), altitudeDiff / 1000)) * 0.5); // Conservative pitch correction
      // Adjust pitch based on bearing alignment for more realistic calculation

      const bearingFactor = stryMutAct_9fa48("137") ? Math.cos(targetBearing) / 0.1 : (stryCov_9fa48("137"), Math.cos(targetBearing) * 0.1);
      return stryMutAct_9fa48("138") ? basePitch - bearingFactor : (stryCov_9fa48("138"), basePitch + bearingFactor);
    }
  }

  private calculateYawCorrection(guidanceData: IMissileGuidanceData, bearing: number): number {
    if (stryMutAct_9fa48("139")) {
      {}
    } else {
      stryCov_9fa48("139");
      // Calculate required yaw adjustment
      const currentHeading = Math.atan2(guidanceData.velocity.y, guidanceData.velocity.x);
      return stryMutAct_9fa48("140") ? (bearing - currentHeading) / 0.3 : (stryCov_9fa48("140"), (stryMutAct_9fa48("141") ? bearing + currentHeading : (stryCov_9fa48("141"), bearing - currentHeading)) * 0.3); // Proportional correction
    }
  }

  private calculateRollCorrection(guidanceData: IMissileGuidanceData): number {
    if (stryMutAct_9fa48("142")) {
      {}
    } else {
      stryCov_9fa48("142");
      // Stabilize roll during mid-course
      return stryMutAct_9fa48("143") ? -guidanceData.velocity.z / 0.1 : (stryCov_9fa48("143"), (stryMutAct_9fa48("144") ? +guidanceData.velocity.z : (stryCov_9fa48("144"), -guidanceData.velocity.z)) * 0.1);
    }
  }

  private estimateBearingFromVelocity(velocity: any): number {
    if (stryMutAct_9fa48("145")) {
      {}
    } else {
      stryCov_9fa48("145");
      return Math.atan2(velocity.y, velocity.x);
    }
  }

}