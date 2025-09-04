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

import dotenv from 'dotenv';
import Joi from 'joi';
import { EEnvironment } from '../enums';
import { IConfigParam, IEnvironmentParam } from './interfaces';
dotenv.config();
export class AppConfig {
  private config: IConfigParam | undefined;
  private readonly DEFAULT_PORT = 3000;

  constructor() {
    if (stryMutAct_9fa48("10")) {
      {}
    } else {
      stryCov_9fa48("10");

      this._setUp();
    }
  }

  public getConfig(): IConfigParam {
    if (stryMutAct_9fa48("11")) {
      {}
    } else {
      stryCov_9fa48("11");

      if (stryMutAct_9fa48("14") ? false : stryMutAct_9fa48("13") ? true : stryMutAct_9fa48("12") ? this.config : (stryCov_9fa48("12", "13", "14"), !this.config)) {
        if (stryMutAct_9fa48("15")) {
          {}
        } else {
          stryCov_9fa48("15");
          throw new Error();
        }
      }

      return this.config;
    }
  }

  private _setUp(): void {
    if (stryMutAct_9fa48("16")) {
      {}
    } else {
      stryCov_9fa48("16");
      const appConfig = Joi.object<IEnvironmentParam>(stryMutAct_9fa48("17") ? {} : (stryCov_9fa48("17"), {
        ENVIRONMENT: Joi.string().valid(...Object.values(EEnvironment)).required(),
        PORT: Joi.number().default(this.DEFAULT_PORT)
      }));
      const {
        value,
        error
      } = appConfig.validate(process.env, stryMutAct_9fa48("18") ? {} : (stryCov_9fa48("18"), {
        allowUnknown: stryMutAct_9fa48("19") ? false : (stryCov_9fa48("19"), true)
      }));

      if (stryMutAct_9fa48("21") ? false : stryMutAct_9fa48("20") ? true : (stryCov_9fa48("20", "21"), error)) {
        if (stryMutAct_9fa48("22")) {
          {}
        } else {
          stryCov_9fa48("22");
          throw Error();
        }
      }

      this.config = ({
        environment: value.ENVIRONMENT,
        port: value.PORT
      } as IConfigParam);
    }
  }

}