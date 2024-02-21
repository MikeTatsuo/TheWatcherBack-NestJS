import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AccountTypeEntity } from '@/models/account_type/entities/account_type.entity';
import { AccountTypeController } from '@/models/account_type/account_type.controller';
import { AccountTypeService } from '@/models/account_type/account_type.service';

@Module({
  imports: [TypeOrmModule.forFeature([AccountTypeEntity])],
  controllers: [AccountTypeController],
  providers: [AccountTypeService],
  exports: [TypeOrmModule],
})
export class AccountTypeModule {}
