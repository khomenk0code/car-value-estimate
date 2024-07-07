import { CallHandler, ExecutionContext, NestInterceptor, UseInterceptors } from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { plainToInstance } from 'class-transformer';

interface ClassConstructor {
  new (...args: any[]): {} // = any class in js
}

export function Serialize(dto: ClassConstructor) {
  return UseInterceptors(new SerializeInterceptor(dto))
}

export class SerializeInterceptor implements NestInterceptor{

    constructor(private dto: any) {}

    intercept(context: ExecutionContext, handler: CallHandler<any>): Observable<any> | Promise<Observable<any>> {

        //Code from here run before a request is handled by the request handler

      return handler.handle().pipe(
        map((data: unknown) => {
          //Run before the response is sent out
          return plainToInstance(this.dto, data,{
            excludeExtraneousValues: true
          })
        })
      );
    }
}