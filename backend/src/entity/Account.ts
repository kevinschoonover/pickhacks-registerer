import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryColumn, PrimaryGeneratedColumn, ManyToMany, OneToMany, JoinTable } from "typeorm";

import { Participation } from "./Participation";

@Entity()
export class Account extends BaseEntity {
  @PrimaryColumn()
  public id: number;

  @OneToMany(type => Participation , participation => participation.participant)
  public participations: Participation[];
}
