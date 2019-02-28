import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, ManyToMany, ManyToOne, JoinTable } from "typeorm";

import { Account } from "./Account";
import { Event } from "./Event";

@Entity()
export class Participation extends BaseEntity {
  @PrimaryGeneratedColumn()
  public id: string;

  @CreateDateColumn()
  public date: Date

  @ManyToOne(type => Account, account => account.participations)
  public participant: Account;

  @ManyToOne(type => Event, event => event.participations)
  public event: Event;
}
