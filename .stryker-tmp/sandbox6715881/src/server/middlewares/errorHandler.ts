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

import { Middleware, Next, ParameterizedContext } from "koa";
import { EHttpStatus } from "../../enums";
export class ErrorHandler {
  handle: Middleware = async (ctx: ParameterizedContext, next: Next) => {
    if (stryMutAct_9fa48("40")) {
      {}
    } else {
      stryCov_9fa48("40");

      try {
        if (stryMutAct_9fa48("41")) {
          {}
        } else {
          stryCov_9fa48("41");
          await next();
        }
      } catch (error) {
        if (stryMutAct_9fa48("42")) {
          {}
        } else {
          stryCov_9fa48("42");
          const {
            statusCode,
            message
          } = (error as any);
          ctx.status = statusCode ? statusCode : EHttpStatus.INTERNAL_SERVER_ERROR;
          ctx.body = stryMutAct_9fa48("43") ? {} : (stryCov_9fa48("43"), {
            statusCode: ctx.status,
            message: stryMutAct_9fa48("46") ? message && 'INTERNAL_SERVER_ERROR' : stryMutAct_9fa48("45") ? false : stryMutAct_9fa48("44") ? true : (stryCov_9fa48("44", "45", "46"), message || (stryMutAct_9fa48("47") ? "" : (stryCov_9fa48("47"), 'INTERNAL_SERVER_ERROR'))),
            error: error ? JSON.stringify(error) : {}
          });
        }
      }
    }
  };
}