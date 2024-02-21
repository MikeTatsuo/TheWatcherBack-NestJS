import { IsInt, IsString, Min } from '@nestjs/class-validator';
import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Exclude } from '@nestjs/class-transformer';

import { AbstractEntity } from '@/models/abstract/entities/abstract.entity';
import { InstitutionTypeEntity } from '@/models/institution_type/entities/institution_type.entity';
import { CountryEntity } from '@/models/country/entities/country.entity';

@Entity('institution')
export class InstitutionEntity extends AbstractEntity {
  @Column()
  @IsString()
  institution: string;

  @Column()
  @IsString()
  url: string;

  @ManyToOne(() => InstitutionTypeEntity, (institution_type) => institution_type.id)
  @JoinColumn([{ name: 'institution_type_id', referencedColumnName: 'id' }])
  institution_type: InstitutionTypeEntity;

  @Column()
  @IsInt()
  @Min(1)
  @Exclude()
  institution_type_id: number;

  @ManyToOne(() => CountryEntity, (country) => country.id)
  @JoinColumn([{ name: 'country_id', referencedColumnName: 'id' }])
  country: CountryEntity;

  @Column()
  @IsInt()
  @Min(1)
  @Exclude()
  country_id: number;
}
