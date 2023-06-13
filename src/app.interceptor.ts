import {
  CallHandler,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable()
export class AppInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    return next.handle().pipe(
      catchError((err) => {
        const errResponse = {
          statusCode: err.status || HttpStatus.INTERNAL_SERVER_ERROR,
          message: err.response || 'Internal server error',
          details: err.message,
          stack: err.stack,
        };

        console.log(err);

        return throwError(
          () => new HttpException(errResponse, errResponse.statusCode),
        );
      }),
    );
  }
}
