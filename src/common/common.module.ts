import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';

import { TransformInterceptor } from '@/common/interceptors/tranform.interceptor';
@Module({
  providers: [{ provide: APP_INTERCEPTOR, useClass: TransformInterceptor }],
})
export class CommonModule {}
