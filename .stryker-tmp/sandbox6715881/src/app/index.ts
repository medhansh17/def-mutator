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

import { AppConfig } from "../config";
import { ENodeErrorType, ENodeSignal } from "../enums";
import { AppServer } from "../server";
export class App {
  public async start(): Promise<void> {
    if (stryMutAct_9fa48("0")) {
      {}
    } else {
      stryCov_9fa48("0");
      const appConfig = new AppConfig();
      const server = new AppServer(appConfig.getConfig());
      server.start();

      this._handleNodeSignals(server);

      this._handleNodeErrorTypes(server);
    }
  }

  private _handleNodeSignals(server: AppServer): void {
    if (stryMutAct_9fa48("1")) {
      {}
    } else {
      stryCov_9fa48("1");
      const signals: ENodeSignal[] = Object.values(ENodeSignal);
      signals.forEach((signal: ENodeSignal) => {
        if (stryMutAct_9fa48("2")) {
          {}
        } else {
          stryCov_9fa48("2");
          process.on(signal, async () => {
            if (stryMutAct_9fa48("3")) {
              {}
            } else {
              stryCov_9fa48("3");
              server.close();
            }
          });
        }
      });
    }
  }

  private _handleNodeErrorTypes(server: AppServer): void {
    if (stryMutAct_9fa48("4")) {
      {}
    } else {
      stryCov_9fa48("4");
      const errorTypes: ENodeErrorType[] = Object.values(ENodeErrorType);
      errorTypes.map(type => {
        if (stryMutAct_9fa48("5")) {
          {}
        } else {
          stryCov_9fa48("5");
          process.on(type, async e => {
            if (stryMutAct_9fa48("6")) {
              {}
            } else {
              stryCov_9fa48("6");

              try {
                if (stryMutAct_9fa48("7")) {
                  {}
                } else {
                  stryCov_9fa48("7");
                  console.log(stryMutAct_9fa48("8") ? `` : (stryCov_9fa48("8"), `Error in process.on ${type}`));
                  console.error(e);
                  server.close();
                  process.exit(0);
                }
              } catch (_) {
                if (stryMutAct_9fa48("9")) {
                  {}
                } else {
                  stryCov_9fa48("9");
                  process.exit(1);
                }
              }
            }
          });
        }
      });
    }
  }

}