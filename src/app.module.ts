import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import app_configuration from '@/config/app/configuration';
import db_configuration from '@/config/database/configuration';
import { CommonModule } from '@/common/common.module';

import { CountryModule } from '@/models/country/country.module';
import { NiTypeModule } from '@/models/ni_type/ni_type.module';
import { OperationTypeModule } from '@/models/operation_type/operation_type.module';
import { INOperationTypeModule } from '@/models/in_operation_type/in_operation_type.module';
import { AccountTypeModule } from '@/models/account_type/account_type.module';
import { AssetTypeModule } from '@/models/asset_type/asset_type.module';
import { INRegistryModule } from '@/models/in_registry/in_registry.module';
import { InstitutionTypeModule } from '@/models/institution_type/institution_type.module';
import { TaxTypeModule } from '@/models/tax_type/tax_type.module';
import { AssetsModule } from '@/models/assets/assets.module';
import { InstitutionModule } from '@/models/institution/institution.module';
import { UserModule } from '@/models/user/user.module';
import { ValuesModule } from '@/models/values/values.module';
import { AccountModule } from '@/models/account/account.module';
import { OperationsModule } from '@/models/operations/operations.module';
import { TaxesModule } from '@/models/taxes/taxes.module';
import { OperationAssetsModule } from '@/models/operation_assets/operation_assets.module';
import { OperationProfitLossModule } from '@/models/operation_profit_loss/operation_profit_loss.module';
import { BalanceModule } from '@/models/balance/balance.module';
import { PtaxModule } from '@/models/ptax/ptax.module';
import { AssetPriceModule } from '@/models/asset_price/asset_price.module';
import { TransferModule } from './models/transfers/transfers.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [app_configuration, db_configuration],
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('database.host'),
        port: configService.get('database.port'),
        username: configService.get('database.username'),
        password: configService.get('database.password'),
        database: configService.get('database.name'),
        synchronize: false,
        autoLoadEntities: true,
      }),
    }),
    AccountModule,
    AccountTypeModule,
    AssetTypeModule,
    AssetPriceModule,
    AssetsModule,
    BalanceModule,
    CommonModule,
    CountryModule,
    INOperationTypeModule,
    INRegistryModule,
    InstitutionModule,
    InstitutionTypeModule,
    NiTypeModule,
    OperationsModule,
    OperationAssetsModule,
    OperationProfitLossModule,
    OperationTypeModule,
    PtaxModule,
    TaxTypeModule,
    TaxesModule,
    TransferModule,
    UserModule,
    ValuesModule,
  ],
})
export class AppModule {}
