/**
 * Helper functions for user authentication. Act as a wrapper for passport
 * authentication functions for unit-testing and mocking purposes.
 */
import * as Koa from "koa";
import { Account } from "../entity/Account";

export function isAuthenticated(ctx: Koa.BaseContext): boolean {
  return ctx.isAuthenticated();
}
