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

import { IRadarTarget, IRadarConfiguration, ITrackingResult } from './interfaces';
export class RadarTrackingService {
  private static readonly THREAT_SPEED_THRESHOLD = 300; // m/s (Mach 0.9)

  private static readonly THREAT_RCS_THRESHOLD = 0.1; // m² for small missiles

  private static readonly MAX_TRACKING_TARGETS = 64; // System capacity limit

  private static readonly INTERFERENCE_THRESHOLD = 0.7; // 70% interference level

  private configuration: IRadarConfiguration;
  private activeTargets: Map<string, IRadarTarget> = new Map();
  private trackingHistory: Map<string, IRadarTarget[]> = new Map();

  constructor(config: IRadarConfiguration) {
    if (stryMutAct_9fa48("146")) {
      {}
    } else {
      stryCov_9fa48("146");
      this.configuration = config;
    }
  }
  /**
   * Primary radar tracking function - processes raw radar returns
   * Critical for air defense and threat detection
   * @param rawReturns Raw radar echo data from antenna array
   * @returns Processed tracking data with threat assessment
   */


  public processRadarReturns(rawReturns: any[]): ITrackingResult {
    if (stryMutAct_9fa48("147")) {
      {}
    } else {
      stryCov_9fa48("147");

      try {
        if (stryMutAct_9fa48("148")) {
          {}
        } else {
          stryCov_9fa48("148");
          // Detect interference and jamming attempts
          const interferenceLevel = this.detectInterference(rawReturns);

          if (stryMutAct_9fa48("152") ? interferenceLevel <= RadarTrackingService.INTERFERENCE_THRESHOLD : stryMutAct_9fa48("151") ? interferenceLevel >= RadarTrackingService.INTERFERENCE_THRESHOLD : stryMutAct_9fa48("150") ? false : stryMutAct_9fa48("149") ? true : (stryCov_9fa48("149", "150", "151", "152"), interferenceLevel > RadarTrackingService.INTERFERENCE_THRESHOLD)) {
            if (stryMutAct_9fa48("153")) {
              {}
            } else {
              stryCov_9fa48("153");
              console.warn(stryMutAct_9fa48("154") ? "" : (stryCov_9fa48("154"), 'High interference detected - possible electronic countermeasures'));
              return this.executeAntiJammingProtocol(rawReturns, interferenceLevel);
            }
          } // Process radar returns into target detections


          const detectedTargets = this.extractTargetsFromReturns(rawReturns); // Update tracking for existing targets

          this.updateTargetTracks(detectedTargets); // Classify threats based on behavior and signature

          const threats = this.identifyThreats(Array.from(this.activeTargets.values())); // Check system capacity and prioritize targets

          this.prioritizeTargets();
          return stryMutAct_9fa48("155") ? {} : (stryCov_9fa48("155"), {
            targets: Array.from(this.activeTargets.values()),
            threats,
            systemStatus: this.determineSystemStatus(interferenceLevel),
            interferenceLevel,
            coverage: this.calculateCoverage()
          });
        }
      } catch (error) {
        if (stryMutAct_9fa48("156")) {
          {}
        } else {
          stryCov_9fa48("156");
          console.error(stryMutAct_9fa48("157") ? "" : (stryCov_9fa48("157"), 'CRITICAL: Radar processing failure'), error);
          return this.executeRadarFailsafe();
        }
      }
    }
  }
  /**
   * Detects electronic warfare interference and jamming
   * Critical for maintaining radar effectiveness in contested environments
   */


  private detectInterference(rawReturns: any[]): number {
    if (stryMutAct_9fa48("158")) {
      {}
    } else {
      stryCov_9fa48("158");

      if (stryMutAct_9fa48("161") ? !rawReturns && rawReturns.length === 0 : stryMutAct_9fa48("160") ? false : stryMutAct_9fa48("159") ? true : (stryCov_9fa48("159", "160", "161"), (stryMutAct_9fa48("162") ? rawReturns : (stryCov_9fa48("162"), !rawReturns)) || (stryMutAct_9fa48("164") ? rawReturns.length !== 0 : stryMutAct_9fa48("163") ? false : (stryCov_9fa48("163", "164"), rawReturns.length === 0)))) {
        if (stryMutAct_9fa48("165")) {
          {}
        } else {
          stryCov_9fa48("165");
          return 1.0; // Complete signal loss
        }
      }

      let noiseSum = 0;
      let signalSum = 0;

      for (const returnData of rawReturns) {
        if (stryMutAct_9fa48("166")) {
          {}
        } else {
          stryCov_9fa48("166");
          const signalPower = stryMutAct_9fa48("169") ? returnData.amplitude && 0 : stryMutAct_9fa48("168") ? false : stryMutAct_9fa48("167") ? true : (stryCov_9fa48("167", "168", "169"), returnData.amplitude || 0);
          const noisePower = stryMutAct_9fa48("172") ? returnData.noise && 0 : stryMutAct_9fa48("171") ? false : stryMutAct_9fa48("170") ? true : (stryCov_9fa48("170", "171", "172"), returnData.noise || 0);
          stryMutAct_9fa48("173") ? signalSum -= signalPower : (stryCov_9fa48("173"), signalSum += signalPower);
          stryMutAct_9fa48("174") ? noiseSum -= noisePower : (stryCov_9fa48("174"), noiseSum += noisePower);
        }
      } // Calculate signal-to-noise ratio


      const snr = stryMutAct_9fa48("175") ? signalSum * (noiseSum + 0.01) : (stryCov_9fa48("175"), signalSum / (stryMutAct_9fa48("176") ? noiseSum - 0.01 : (stryCov_9fa48("176"), noiseSum + 0.01))); // Avoid division by zero
      // Convert SNR to interference level (inverse relationship)

      const interferenceLevel = Math.max(0, Math.min(1, stryMutAct_9fa48("177") ? 1 + snr / 10 : (stryCov_9fa48("177"), 1 - (stryMutAct_9fa48("178") ? snr * 10 : (stryCov_9fa48("178"), snr / 10)))));
      return interferenceLevel;
    }
  }
  /**
   * Anti-jamming protocol - frequency hopping and adaptive filtering
   * Maintains tracking capability under electronic attack
   */


  private executeAntiJammingProtocol(rawReturns: any[], interferenceLevel: number): ITrackingResult {
    if (stryMutAct_9fa48("179")) {
      {}
    } else {
      stryCov_9fa48("179");
      console.warn(stryMutAct_9fa48("180") ? "" : (stryCov_9fa48("180"), 'Executing anti-jamming protocol')); // Implement frequency hopping (simplified simulation)

      const hopFrequency = stryMutAct_9fa48("181") ? this.configuration.frequency / (1 + (stryMutAct_9fa48("183") ? Math.random() / 0.1 : (stryCov_9fa48("183"), Math.random() * 0.1))) : (stryCov_9fa48("181"), this.configuration.frequency * (stryMutAct_9fa48("182") ? 1 - Math.random() * 0.1 : (stryCov_9fa48("182"), 1 + (stryMutAct_9fa48("183") ? Math.random() / 0.1 : (stryCov_9fa48("183"), Math.random() * 0.1)))));
      this.configuration.frequency = hopFrequency; // Reduce detection threshold to maintain some capability

      const degradedTargets = this.extractTargetsFromReturns(rawReturns, stryMutAct_9fa48("184") ? false : (stryCov_9fa48("184"), true)); // Filter targets with high confidence only

      const filteredTargets = degradedTargets.filter(stryMutAct_9fa48("185") ? () => undefined : (stryCov_9fa48("185"), target => stryMutAct_9fa48("189") ? target.confidence <= 0.8 : stryMutAct_9fa48("188") ? target.confidence >= 0.8 : stryMutAct_9fa48("187") ? false : stryMutAct_9fa48("186") ? true : (stryCov_9fa48("186", "187", "188", "189"), target.confidence > 0.8)));
      return stryMutAct_9fa48("190") ? {} : (stryCov_9fa48("190"), {
        targets: filteredTargets,
        threats: this.identifyThreats(filteredTargets),
        systemStatus: stryMutAct_9fa48("191") ? "" : (stryCov_9fa48("191"), 'DEGRADED'),
        interferenceLevel,
        coverage: stryMutAct_9fa48("192") ? {} : (stryCov_9fa48("192"), {
          azimuthScan: (stryMutAct_9fa48("196") ? this.configuration.frequency <= 0 : stryMutAct_9fa48("195") ? this.configuration.frequency >= 0 : stryMutAct_9fa48("194") ? false : stryMutAct_9fa48("193") ? true : (stryCov_9fa48("193", "194", "195", "196"), this.configuration.frequency > 0)) ? 180 : 90,
          // Reduced coverage
          elevationScan: (stryMutAct_9fa48("200") ? this.configuration.frequency <= 0 : stryMutAct_9fa48("199") ? this.configuration.frequency >= 0 : stryMutAct_9fa48("198") ? false : stryMutAct_9fa48("197") ? true : (stryCov_9fa48("197", "198", "199", "200"), this.configuration.frequency > 0)) ? 45 : 20
        })
      });
    }
  }
  /**
   * Extracts target information from raw radar returns
   * Includes Doppler processing and range-gate analysis
   */


  private extractTargetsFromReturns(rawReturns: any[], degradedMode: boolean = stryMutAct_9fa48("201") ? true : (stryCov_9fa48("201"), false)): IRadarTarget[] {
    if (stryMutAct_9fa48("202")) {
      {}
    } else {
      stryCov_9fa48("202");
      const targets: IRadarTarget[] = stryMutAct_9fa48("203") ? ["Stryker was here"] : (stryCov_9fa48("203"), []);
      const detectionThreshold = degradedMode ? 0.8 : 0.6;

      for (let i = 0; stryMutAct_9fa48("206") ? i >= rawReturns.length : stryMutAct_9fa48("205") ? i <= rawReturns.length : stryMutAct_9fa48("204") ? false : (stryCov_9fa48("204", "205", "206"), i < rawReturns.length); stryMutAct_9fa48("207") ? i-- : (stryCov_9fa48("207"), i++)) {
        if (stryMutAct_9fa48("208")) {
          {}
        } else {
          stryCov_9fa48("208");
          const returnData = rawReturns[i];

          if (stryMutAct_9fa48("211") ? !returnData && returnData.amplitude < detectionThreshold : stryMutAct_9fa48("210") ? false : stryMutAct_9fa48("209") ? true : (stryCov_9fa48("209", "210", "211"), (stryMutAct_9fa48("212") ? returnData : (stryCov_9fa48("212"), !returnData)) || (stryMutAct_9fa48("215") ? returnData.amplitude >= detectionThreshold : stryMutAct_9fa48("214") ? returnData.amplitude <= detectionThreshold : stryMutAct_9fa48("213") ? false : (stryCov_9fa48("213", "214", "215"), returnData.amplitude < detectionThreshold)))) {
            if (stryMutAct_9fa48("216")) {
              {}
            } else {
              stryCov_9fa48("216");
              continue;
            }
          } // Calculate target parameters


          const range = this.calculateRange(returnData.timeDelay);
          const azimuth = this.calculateAzimuth(returnData.antennaPosition);
          const elevation = this.calculateElevation(returnData.antennaPosition);
          const dopplerVelocity = this.calculateDopplerVelocity(returnData.frequencyShift); // Estimate radar cross section

          const rcs = this.estimateRCS(returnData.amplitude, range);
          const target: IRadarTarget = stryMutAct_9fa48("217") ? {} : (stryCov_9fa48("217"), {
            id: stryMutAct_9fa48("218") ? `` : (stryCov_9fa48("218"), `target_${Date.now()}_${i}`),
            position: stryMutAct_9fa48("219") ? {} : (stryCov_9fa48("219"), {
              range,
              azimuth,
              elevation
            }),
            velocity: stryMutAct_9fa48("220") ? {} : (stryCov_9fa48("220"), {
              radial: dopplerVelocity,
              tangential: this.estimateTangentialVelocity(returnData)
            }),
            signature: stryMutAct_9fa48("221") ? {} : (stryCov_9fa48("221"), {
              rcs,
              classification: this.classifyTarget(rcs, dopplerVelocity)
            }),
            timestamp: Date.now(),
            confidence: Math.min(1.0, returnData.amplitude)
          });
          targets.push(target);
        }
      }

      return targets;
    }
  }
  /**
   * Identifies potential threats based on target behavior and characteristics
   * Critical for early warning and defense coordination
   */


  private identifyThreats(targets: IRadarTarget[]): IRadarTarget[] {
    if (stryMutAct_9fa48("222")) {
      {}
    } else {
      stryCov_9fa48("222");
      return targets.filter(target => {
        if (stryMutAct_9fa48("223")) {
          {}
        } else {
          stryCov_9fa48("223");

          // High-speed targets (potential missiles)
          if (stryMutAct_9fa48("227") ? Math.abs(target.velocity.radial) <= RadarTrackingService.THREAT_SPEED_THRESHOLD : stryMutAct_9fa48("226") ? Math.abs(target.velocity.radial) >= RadarTrackingService.THREAT_SPEED_THRESHOLD : stryMutAct_9fa48("225") ? false : stryMutAct_9fa48("224") ? true : (stryCov_9fa48("224", "225", "226", "227"), Math.abs(target.velocity.radial) > RadarTrackingService.THREAT_SPEED_THRESHOLD)) {
            if (stryMutAct_9fa48("228")) {
              {}
            } else {
              stryCov_9fa48("228");
              return stryMutAct_9fa48("229") ? false : (stryCov_9fa48("229"), true);
            }
          } // Small RCS targets (stealth aircraft, cruise missiles)


          if (stryMutAct_9fa48("233") ? target.signature.rcs >= RadarTrackingService.THREAT_RCS_THRESHOLD : stryMutAct_9fa48("232") ? target.signature.rcs <= RadarTrackingService.THREAT_RCS_THRESHOLD : stryMutAct_9fa48("231") ? false : stryMutAct_9fa48("230") ? true : (stryCov_9fa48("230", "231", "232", "233"), target.signature.rcs < RadarTrackingService.THREAT_RCS_THRESHOLD)) {
            if (stryMutAct_9fa48("234")) {
              {}
            } else {
              stryCov_9fa48("234");
              return stryMutAct_9fa48("235") ? false : (stryCov_9fa48("235"), true);
            }
          } // Classified military targets


          if (stryMutAct_9fa48("237") ? false : stryMutAct_9fa48("236") ? true : (stryCov_9fa48("236", "237"), (stryMutAct_9fa48("238") ? [] : (stryCov_9fa48("238"), [stryMutAct_9fa48("239") ? "" : (stryCov_9fa48("239"), 'missile'), stryMutAct_9fa48("240") ? "" : (stryCov_9fa48("240"), 'drone')])).includes(target.signature.classification))) {
            if (stryMutAct_9fa48("241")) {
              {}
            } else {
              stryCov_9fa48("241");
              return stryMutAct_9fa48("242") ? false : (stryCov_9fa48("242"), true);
            }
          } // Targets with unusual flight patterns (check tracking history)


          const history = this.trackingHistory.get(target.id);

          if (stryMutAct_9fa48("245") ? history || this.hasUnusualFlightPattern(history) : stryMutAct_9fa48("244") ? false : stryMutAct_9fa48("243") ? true : (stryCov_9fa48("243", "244", "245"), history && this.hasUnusualFlightPattern(history))) {
            if (stryMutAct_9fa48("246")) {
              {}
            } else {
              stryCov_9fa48("246");
              return stryMutAct_9fa48("247") ? false : (stryCov_9fa48("247"), true);
            }
          }

          return stryMutAct_9fa48("248") ? true : (stryCov_9fa48("248"), false);
        }
      });
    }
  }
  /**
   * Updates target tracking with motion prediction and correlation
   */


  private updateTargetTracks(newTargets: IRadarTarget[]): void {
    if (stryMutAct_9fa48("249")) {
      {}
    } else {
      stryCov_9fa48("249");
      // Clear old targets (simulate track loss after timeout)
      const currentTime = Date.now();

      for (const [id, target] of this.activeTargets.entries()) {
        if (stryMutAct_9fa48("250")) {
          {}
        } else {
          stryCov_9fa48("250");

          if (stryMutAct_9fa48("254") ? currentTime - target.timestamp <= 10000 : stryMutAct_9fa48("253") ? currentTime - target.timestamp >= 10000 : stryMutAct_9fa48("252") ? false : stryMutAct_9fa48("251") ? true : (stryCov_9fa48("251", "252", "253", "254"), (stryMutAct_9fa48("255") ? currentTime + target.timestamp : (stryCov_9fa48("255"), currentTime - target.timestamp)) > 10000)) {
            if (stryMutAct_9fa48("256")) {
              {}
            } else {
              stryCov_9fa48("256");
              // 10 second timeout
              this.activeTargets.delete(id);
              this.trackingHistory.delete(id);
            }
          }
        }
      } // Update or add new targets


      for (const target of newTargets) {
        if (stryMutAct_9fa48("257")) {
          {}
        } else {
          stryCov_9fa48("257");
          const existingTarget = this.findCorrelatedTarget(target);

          if (stryMutAct_9fa48("259") ? false : stryMutAct_9fa48("258") ? true : (stryCov_9fa48("258", "259"), existingTarget)) {
            if (stryMutAct_9fa48("260")) {
              {}
            } else {
              stryCov_9fa48("260");
              // Update existing track
              this.updateTrackHistory(existingTarget.id, target);
              this.activeTargets.set(existingTarget.id, target);
            }
          } else {
            if (stryMutAct_9fa48("261")) {
              {}
            } else {
              stryCov_9fa48("261");
              // New target track
              this.activeTargets.set(target.id, target);
              this.trackingHistory.set(target.id, stryMutAct_9fa48("262") ? [] : (stryCov_9fa48("262"), [target]));
            }
          }
        }
      }
    }
  }

  private prioritizeTargets(): void {
    if (stryMutAct_9fa48("263")) {
      {}
    } else {
      stryCov_9fa48("263");

      if (stryMutAct_9fa48("267") ? this.activeTargets.size > RadarTrackingService.MAX_TRACKING_TARGETS : stryMutAct_9fa48("266") ? this.activeTargets.size < RadarTrackingService.MAX_TRACKING_TARGETS : stryMutAct_9fa48("265") ? false : stryMutAct_9fa48("264") ? true : (stryCov_9fa48("264", "265", "266", "267"), this.activeTargets.size <= RadarTrackingService.MAX_TRACKING_TARGETS)) {
        if (stryMutAct_9fa48("268")) {
          {}
        } else {
          stryCov_9fa48("268");
          return;
        }
      } // Convert to array and sort by threat level


      const targetArray = Array.from(this.activeTargets.values());
      targetArray.sort((a, b) => {
        if (stryMutAct_9fa48("269")) {
          {}
        } else {
          stryCov_9fa48("269");
          const aThreat = this.calculateThreatScore(a);
          const bThreat = this.calculateThreatScore(b);
          return stryMutAct_9fa48("270") ? bThreat + aThreat : (stryCov_9fa48("270"), bThreat - aThreat); // Higher threat first
        }
      }); // Keep only top priority targets

      this.activeTargets.clear();

      for (let i = 0; stryMutAct_9fa48("273") ? i >= RadarTrackingService.MAX_TRACKING_TARGETS : stryMutAct_9fa48("272") ? i <= RadarTrackingService.MAX_TRACKING_TARGETS : stryMutAct_9fa48("271") ? false : (stryCov_9fa48("271", "272", "273"), i < RadarTrackingService.MAX_TRACKING_TARGETS); stryMutAct_9fa48("274") ? i-- : (stryCov_9fa48("274"), i++)) {
        if (stryMutAct_9fa48("275")) {
          {}
        } else {
          stryCov_9fa48("275");
          const target = targetArray[i];
          this.activeTargets.set(target.id, target);
        }
      }
    }
  }

  private calculateThreatScore(target: IRadarTarget): number {
    if (stryMutAct_9fa48("276")) {
      {}
    } else {
      stryCov_9fa48("276");
      let score = 0; // Speed factor

      stryMutAct_9fa48("277") ? score -= Math.abs(target.velocity.radial) / 100 : (stryCov_9fa48("277"), score += stryMutAct_9fa48("278") ? Math.abs(target.velocity.radial) * 100 : (stryCov_9fa48("278"), Math.abs(target.velocity.radial) / 100)); // RCS factor (smaller = more threatening)

      stryMutAct_9fa48("279") ? score -= (stryMutAct_9fa48("281") ? 1 * target.signature.rcs : (stryCov_9fa48("281"), 1 / target.signature.rcs)) * 0.1 : (stryCov_9fa48("279"), score += stryMutAct_9fa48("280") ? 1 / target.signature.rcs / 0.1 : (stryCov_9fa48("280"), (stryMutAct_9fa48("281") ? 1 * target.signature.rcs : (stryCov_9fa48("281"), 1 / target.signature.rcs)) * 0.1)); // Classification factor

      if (stryMutAct_9fa48("284") ? target.signature.classification !== 'missile' : stryMutAct_9fa48("283") ? false : stryMutAct_9fa48("282") ? true : (stryCov_9fa48("282", "283", "284"), target.signature.classification === (stryMutAct_9fa48("285") ? "" : (stryCov_9fa48("285"), 'missile')))) stryMutAct_9fa48("286") ? score -= 10 : (stryCov_9fa48("286"), score += 10);
      if (stryMutAct_9fa48("289") ? target.signature.classification !== 'drone' : stryMutAct_9fa48("288") ? false : stryMutAct_9fa48("287") ? true : (stryCov_9fa48("287", "288", "289"), target.signature.classification === (stryMutAct_9fa48("290") ? "" : (stryCov_9fa48("290"), 'drone')))) stryMutAct_9fa48("291") ? score -= 5 : (stryCov_9fa48("291"), score += 5); // Range factor (closer = more threatening)

      stryMutAct_9fa48("292") ? score -= (stryMutAct_9fa48("294") ? 1000000 * target.position.range : (stryCov_9fa48("294"), 1000000 / target.position.range)) * 0.001 : (stryCov_9fa48("292"), score += stryMutAct_9fa48("293") ? 1000000 / target.position.range / 0.001 : (stryCov_9fa48("293"), (stryMutAct_9fa48("294") ? 1000000 * target.position.range : (stryCov_9fa48("294"), 1000000 / target.position.range)) * 0.001));
      return score;
    }
  } // Helper methods for calculations


  private calculateRange(timeDelay: number): number {
    if (stryMutAct_9fa48("295")) {
      {}
    } else {
      stryCov_9fa48("295");
      const speedOfLight = 299792458; // m/s

      return stryMutAct_9fa48("296") ? timeDelay * speedOfLight * 2 : (stryCov_9fa48("296"), (stryMutAct_9fa48("297") ? timeDelay / speedOfLight : (stryCov_9fa48("297"), timeDelay * speedOfLight)) / 2);
    }
  }

  private calculateAzimuth(antennaPosition: any): number {
    if (stryMutAct_9fa48("298")) {
      {}
    } else {
      stryCov_9fa48("298");
      return stryMutAct_9fa48("301") ? antennaPosition?.azimuth && 0 : stryMutAct_9fa48("300") ? false : stryMutAct_9fa48("299") ? true : (stryCov_9fa48("299", "300", "301"), (stryMutAct_9fa48("302") ? antennaPosition.azimuth : (stryCov_9fa48("302"), antennaPosition?.azimuth)) || 0);
    }
  }

  private calculateElevation(antennaPosition: any): number {
    if (stryMutAct_9fa48("303")) {
      {}
    } else {
      stryCov_9fa48("303");
      return stryMutAct_9fa48("306") ? antennaPosition?.elevation && 0 : stryMutAct_9fa48("305") ? false : stryMutAct_9fa48("304") ? true : (stryCov_9fa48("304", "305", "306"), (stryMutAct_9fa48("307") ? antennaPosition.elevation : (stryCov_9fa48("307"), antennaPosition?.elevation)) || 0);
    }
  }

  private calculateDopplerVelocity(frequencyShift: number): number {
    if (stryMutAct_9fa48("308")) {
      {}
    } else {
      stryCov_9fa48("308");
      const speedOfLight = 299792458;
      return stryMutAct_9fa48("309") ? frequencyShift * speedOfLight * (2 * this.configuration.frequency) : (stryCov_9fa48("309"), (stryMutAct_9fa48("310") ? frequencyShift / speedOfLight : (stryCov_9fa48("310"), frequencyShift * speedOfLight)) / (stryMutAct_9fa48("311") ? 2 / this.configuration.frequency : (stryCov_9fa48("311"), 2 * this.configuration.frequency)));
    }
  }

  private estimateRCS(amplitude: number, range: number): number {
    if (stryMutAct_9fa48("312")) {
      {}
    } else {
      stryCov_9fa48("312");
      // Simplified RCS estimation
      return stryMutAct_9fa48("313") ? amplitude * Math.pow(range, 4) * this.configuration.power : (stryCov_9fa48("313"), (stryMutAct_9fa48("314") ? amplitude / Math.pow(range, 4) : (stryCov_9fa48("314"), amplitude * Math.pow(range, 4))) / this.configuration.power);
    }
  }

  private estimateTangentialVelocity(returnData: any): number {
    if (stryMutAct_9fa48("315")) {
      {}
    } else {
      stryCov_9fa48("315");
      return stryMutAct_9fa48("318") ? returnData.tangentialVelocity && 0 : stryMutAct_9fa48("317") ? false : stryMutAct_9fa48("316") ? true : (stryCov_9fa48("316", "317", "318"), returnData.tangentialVelocity || 0);
    }
  }

  private classifyTarget(rcs: number, velocity: number): 'aircraft' | 'missile' | 'drone' | 'decoy' | 'unknown' {
    if (stryMutAct_9fa48("319")) {
      {}
    } else {
      stryCov_9fa48("319");
      if (stryMutAct_9fa48("323") ? Math.abs(velocity) <= 500 : stryMutAct_9fa48("322") ? Math.abs(velocity) >= 500 : stryMutAct_9fa48("321") ? false : stryMutAct_9fa48("320") ? true : (stryCov_9fa48("320", "321", "322", "323"), Math.abs(velocity) > 500)) return stryMutAct_9fa48("324") ? "" : (stryCov_9fa48("324"), 'missile');
      if (stryMutAct_9fa48("328") ? rcs >= 0.1 : stryMutAct_9fa48("327") ? rcs <= 0.1 : stryMutAct_9fa48("326") ? false : stryMutAct_9fa48("325") ? true : (stryCov_9fa48("325", "326", "327", "328"), rcs < 0.1)) return stryMutAct_9fa48("329") ? "" : (stryCov_9fa48("329"), 'drone');
      if (stryMutAct_9fa48("333") ? rcs <= 100 : stryMutAct_9fa48("332") ? rcs >= 100 : stryMutAct_9fa48("331") ? false : stryMutAct_9fa48("330") ? true : (stryCov_9fa48("330", "331", "332", "333"), rcs > 100)) return stryMutAct_9fa48("334") ? "" : (stryCov_9fa48("334"), 'aircraft');
      if (stryMutAct_9fa48("338") ? rcs >= 0.01 : stryMutAct_9fa48("337") ? rcs <= 0.01 : stryMutAct_9fa48("336") ? false : stryMutAct_9fa48("335") ? true : (stryCov_9fa48("335", "336", "337", "338"), rcs < 0.01)) return stryMutAct_9fa48("339") ? "" : (stryCov_9fa48("339"), 'decoy');
      return stryMutAct_9fa48("340") ? "" : (stryCov_9fa48("340"), 'unknown');
    }
  }

  private findCorrelatedTarget(newTarget: IRadarTarget): IRadarTarget | null {
    if (stryMutAct_9fa48("341")) {
      {}
    } else {
      stryCov_9fa48("341");

      for (const target of this.activeTargets.values()) {
        if (stryMutAct_9fa48("342")) {
          {}
        } else {
          stryCov_9fa48("342");
          const rangeDiff = Math.abs(stryMutAct_9fa48("343") ? target.position.range + newTarget.position.range : (stryCov_9fa48("343"), target.position.range - newTarget.position.range));
          const azimuthDiff = Math.abs(stryMutAct_9fa48("344") ? target.position.azimuth + newTarget.position.azimuth : (stryCov_9fa48("344"), target.position.azimuth - newTarget.position.azimuth));

          if (stryMutAct_9fa48("347") ? rangeDiff < 100 || azimuthDiff < 0.1 : stryMutAct_9fa48("346") ? false : stryMutAct_9fa48("345") ? true : (stryCov_9fa48("345", "346", "347"), (stryMutAct_9fa48("350") ? rangeDiff >= 100 : stryMutAct_9fa48("349") ? rangeDiff <= 100 : stryMutAct_9fa48("348") ? true : (stryCov_9fa48("348", "349", "350"), rangeDiff < 100)) && (stryMutAct_9fa48("353") ? azimuthDiff >= 0.1 : stryMutAct_9fa48("352") ? azimuthDiff <= 0.1 : stryMutAct_9fa48("351") ? true : (stryCov_9fa48("351", "352", "353"), azimuthDiff < 0.1)))) {
            if (stryMutAct_9fa48("354")) {
              {}
            } else {
              stryCov_9fa48("354");
              // 100m range and 0.1 rad azimuth tolerance
              return target;
            }
          }
        }
      }

      return null;
    }
  }

  private updateTrackHistory(targetId: string, newTarget: IRadarTarget): void {
    if (stryMutAct_9fa48("355")) {
      {}
    } else {
      stryCov_9fa48("355");
      const history = stryMutAct_9fa48("358") ? this.trackingHistory.get(targetId) && [] : stryMutAct_9fa48("357") ? false : stryMutAct_9fa48("356") ? true : (stryCov_9fa48("356", "357", "358"), this.trackingHistory.get(targetId) || (stryMutAct_9fa48("359") ? ["Stryker was here"] : (stryCov_9fa48("359"), [])));
      history.push(newTarget); // Keep only last 10 positions

      if (stryMutAct_9fa48("363") ? history.length <= 10 : stryMutAct_9fa48("362") ? history.length >= 10 : stryMutAct_9fa48("361") ? false : stryMutAct_9fa48("360") ? true : (stryCov_9fa48("360", "361", "362", "363"), history.length > 10)) {
        if (stryMutAct_9fa48("364")) {
          {}
        } else {
          stryCov_9fa48("364");
          history.shift();
        }
      }

      this.trackingHistory.set(targetId, history);
    }
  }

  private hasUnusualFlightPattern(history: IRadarTarget[]): boolean {
    if (stryMutAct_9fa48("365")) {
      {}
    } else {
      stryCov_9fa48("365");
      if (stryMutAct_9fa48("369") ? history.length >= 3 : stryMutAct_9fa48("368") ? history.length <= 3 : stryMutAct_9fa48("367") ? false : stryMutAct_9fa48("366") ? true : (stryCov_9fa48("366", "367", "368", "369"), history.length < 3)) return stryMutAct_9fa48("370") ? true : (stryCov_9fa48("370"), false); // Check for erratic speed changes

      for (let i = 1; stryMutAct_9fa48("373") ? i >= history.length : stryMutAct_9fa48("372") ? i <= history.length : stryMutAct_9fa48("371") ? false : (stryCov_9fa48("371", "372", "373"), i < history.length); stryMutAct_9fa48("374") ? i-- : (stryCov_9fa48("374"), i++)) {
        if (stryMutAct_9fa48("375")) {
          {}
        } else {
          stryCov_9fa48("375");
          const speedChange = Math.abs(stryMutAct_9fa48("376") ? history[i].velocity.radial + history[stryMutAct_9fa48("377") ? i + 1 : (stryCov_9fa48("377"), i - 1)].velocity.radial : (stryCov_9fa48("376"), history[i].velocity.radial - history[stryMutAct_9fa48("377") ? i + 1 : (stryCov_9fa48("377"), i - 1)].velocity.radial));

          if (stryMutAct_9fa48("381") ? speedChange <= 100 : stryMutAct_9fa48("380") ? speedChange >= 100 : stryMutAct_9fa48("379") ? false : stryMutAct_9fa48("378") ? true : (stryCov_9fa48("378", "379", "380", "381"), speedChange > 100)) {
            if (stryMutAct_9fa48("382")) {
              {}
            } else {
              stryCov_9fa48("382");
              // 100 m/s speed change
              return stryMutAct_9fa48("383") ? false : (stryCov_9fa48("383"), true);
            }
          }
        }
      }

      return stryMutAct_9fa48("384") ? true : (stryCov_9fa48("384"), false);
    }
  }

  private determineSystemStatus(interferenceLevel: number): 'OPERATIONAL' | 'DEGRADED' | 'OFFLINE' | 'MAINTENANCE' {
    if (stryMutAct_9fa48("385")) {
      {}
    } else {
      stryCov_9fa48("385");
      if (stryMutAct_9fa48("389") ? interferenceLevel <= 0.9 : stryMutAct_9fa48("388") ? interferenceLevel >= 0.9 : stryMutAct_9fa48("387") ? false : stryMutAct_9fa48("386") ? true : (stryCov_9fa48("386", "387", "388", "389"), interferenceLevel > 0.9)) return stryMutAct_9fa48("390") ? "" : (stryCov_9fa48("390"), 'OFFLINE');
      if (stryMutAct_9fa48("394") ? interferenceLevel <= 0.7 : stryMutAct_9fa48("393") ? interferenceLevel >= 0.7 : stryMutAct_9fa48("392") ? false : stryMutAct_9fa48("391") ? true : (stryCov_9fa48("391", "392", "393", "394"), interferenceLevel > 0.7)) return stryMutAct_9fa48("395") ? "" : (stryCov_9fa48("395"), 'DEGRADED');
      return stryMutAct_9fa48("396") ? "" : (stryCov_9fa48("396"), 'OPERATIONAL');
    }
  }

  private calculateCoverage(): {
    azimuthScan: number;
    elevationScan: number;
  } {
    if (stryMutAct_9fa48("397")) {
      {}
    } else {
      stryCov_9fa48("397");
      return stryMutAct_9fa48("398") ? {} : (stryCov_9fa48("398"), {
        azimuthScan: 360,
        // Full 360-degree coverage
        elevationScan: 90 // 90-degree elevation coverage

      });
    }
  }

  private executeRadarFailsafe(): ITrackingResult {
    if (stryMutAct_9fa48("399")) {
      {}
    } else {
      stryCov_9fa48("399");
      console.error(stryMutAct_9fa48("400") ? "" : (stryCov_9fa48("400"), 'RADAR SYSTEM FAILSAFE ACTIVATED'));
      return stryMutAct_9fa48("401") ? {} : (stryCov_9fa48("401"), {
        targets: stryMutAct_9fa48("402") ? ["Stryker was here"] : (stryCov_9fa48("402"), []),
        threats: stryMutAct_9fa48("403") ? ["Stryker was here"] : (stryCov_9fa48("403"), []),
        systemStatus: stryMutAct_9fa48("404") ? "" : (stryCov_9fa48("404"), 'OFFLINE'),
        interferenceLevel: 1.0,
        coverage: stryMutAct_9fa48("405") ? {} : (stryCov_9fa48("405"), {
          azimuthScan: 0,
          elevationScan: 0
        })
      });
    }
  }

}