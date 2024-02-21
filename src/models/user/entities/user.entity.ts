import { IsString } from '@nestjs/class-validator';
import { Entity, Column } from 'typeorm';
import { Exclude } from '@nestjs/class-transformer';

import { AbstractEntity } from '@/models/abstract/entities/abstract.entity';

@Entity('users')
export class UserEntity extends AbstractEntity {
  @Column()
  @IsString()
  username: string;

  @Column()
  @IsString()
  @Exclude()
  password: string;

  @Column()
  @IsString()
  @Exclude()
  token: string;
}
