import { Body, CurrentUser, Delete, Get, JsonController, OnUndefined, Param, Patch, Post, UnauthorizedError } from "routing-controllers";
import { EntityFromBody } from "typeorm-routing-controllers-extensions";

import { Account } from "../entity/Account";
import { Event } from "../entity/Event";
import { Participation } from "../entity/Participation";

@JsonController()
export class EventController {

  @Get("/events/")
  public async getAll(user: Event) {
  return Event.find({relations: ["participations", "participations.participant"]});
  }

  @Post("/events/")
  public save(@EntityFromBody() event: Event) {
    return event.save();
  }

  @Get("/events/:id/")
  public async get(@Param("id") id: string) {
    return Event.findOne({ id }, {relations: ["participants", ]});
  }

  @Patch("/events/:id/")
  public async patch(@Param("id") id: string, @Body() event: object) {
    await Event.update(id, event);
    return Event.findOne({ id });
  }

  @Post("/events/:id/accounts/")
  public async addAccount(@Param("id") id: string, @EntityFromBody() account: Account) {
    let event = await Event.findOne({ id });
    let participation = new Participation();
    participation.participant = account;
    participation.event = event;
    return participation.save();
  }
}
