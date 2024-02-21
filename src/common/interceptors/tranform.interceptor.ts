import { classToPlain } from '@nestjs/class-transformer';
import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response<T> {
  data: T;
}

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, Record<string, any>> {
  intercept(context: ExecutionContext, next: CallHandler<T>): Observable<Record<string, any>> {
    return next.handle().pipe(
      map((data) => {
        return classToPlain(data);
      }),
    );
  }
}
