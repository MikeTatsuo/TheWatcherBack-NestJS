import { Exclude } from '@nestjs/class-transformer';
import { IsDate, IsInt, Min } from '@nestjs/class-validator';
import {
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';

export class AbstractEntity {
  @PrimaryGeneratedColumn()
  @IsInt()
  @Min(1)
  id: number;

  @CreateDateColumn({ type: 'timestamp' })
  @IsDate()
  @Exclude()
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  @IsDate()
  @Exclude()
  updated_at: Date;

  @DeleteDateColumn({ type: 'timestamp' })
  @IsDate()
  @Exclude()
  deleted_at: Date;
}
