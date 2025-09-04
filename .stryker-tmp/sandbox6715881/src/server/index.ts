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

import cors from '@koa/cors';
import { Server } from 'http';
import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import KoaLogger from 'koa-logger';
import Router from 'koa-router';
import { IConfigParam } from '../config/interfaces';
import { ErrorHandler } from './middlewares';
import { AppRouter } from './routes';
export class AppServer {
  private app: Koa | undefined;
  private server: Server | undefined;

  constructor(private config: IConfigParam) {
    if (stryMutAct_9fa48("25")) {
      {}
    } else {
      stryCov_9fa48("25");

      this._setUp();
    }
  }

  public start(): void {
    if (stryMutAct_9fa48("26")) {
      {}
    } else {
      stryCov_9fa48("26");

      if (stryMutAct_9fa48("29") ? false : stryMutAct_9fa48("28") ? true : stryMutAct_9fa48("27") ? this.app : (stryCov_9fa48("27", "28", "29"), !this.app)) {
        if (stryMutAct_9fa48("30")) {
          {}
        } else {
          stryCov_9fa48("30");
          throw new Error();
        }
      }

      this.server = this.app.listen(this.config.port, () => {
        if (stryMutAct_9fa48("31")) {
          {}
        } else {
          stryCov_9fa48("31");
          console.log(stryMutAct_9fa48("32") ? `` : (stryCov_9fa48("32"), `Server in ${this.config.environment} - Started on port ${this.config.port}`));
        }
      });
    }
  }

  public close(): void {
    if (stryMutAct_9fa48("33")) {
      {}
    } else {
      stryCov_9fa48("33");

      if (stryMutAct_9fa48("36") ? false : stryMutAct_9fa48("35") ? true : stryMutAct_9fa48("34") ? this.server : (stryCov_9fa48("34", "35", "36"), !this.server)) {
        if (stryMutAct_9fa48("37")) {
          {}
        } else {
          stryCov_9fa48("37");
          throw new Error();
        }
      }

      this.server.close();
      console.log(stryMutAct_9fa48("38") ? "" : (stryCov_9fa48("38"), 'SERVER CLOSED'));
    }
  }

  private _setUp(): void {
    if (stryMutAct_9fa48("39")) {
      {}
    } else {
      stryCov_9fa48("39");
      this.app = new Koa();
      const appRouter = new AppRouter();
      const router = appRouter.loadRoutes(new Router());
      const errorHandler = new ErrorHandler();
      this.app.use(errorHandler.handle).use(cors()).use(bodyParser()).use(KoaLogger()).use(router.routes()).use(router.allowedMethods());
    }
  }

}