import { Body, CurrentUser, Delete, Get, JsonController, OnUndefined, Param, Patch, Post, UnauthorizedError } from "routing-controllers";
import { EntityFromBody } from "typeorm-routing-controllers-extensions";

import { Account } from "../entity/Account";

@JsonController()
export class AccountController {

  @Get("/accounts/")
  public async getAll(user: Account) {
  return Account.find({relations: ["participations", ]});
  }

  @Post("/accounts/")
  public save(@EntityFromBody() account: Account) {
    console.log(account);
    return account.save();
  }

  @Get("/accounts/:id/")
  public async get(@Param("id") id: number) {
    return Account.findOne({ id }, {relations: ["participations", ]});
  }

  @Patch("/accounts/:id/")
  public async patch(user: Account, @Param("id") id: number, @Body() account: object) {
    await Account.update(id, account);
    return Account.findOne({ id });
  }
}
