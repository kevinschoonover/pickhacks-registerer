import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, ManyToMany, OneToMany, JoinTable } from "typeorm";

import { Participation } from "./Participation";

@Entity()
export class Event extends BaseEntity {
  @PrimaryGeneratedColumn()
  public id: string;

  @Column({
      length: 50
  })
  public name: string;

  @OneToMany(type => Participation, participation => participation.event)
  public participations: Participation[];
}
