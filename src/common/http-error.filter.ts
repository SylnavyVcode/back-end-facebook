import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

@Catch(HttpException)
export class HttpErrorFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    const status =
      exception.getStatus() || HttpStatus.INTERNAL_SERVER_ERROR;
console.log({
  request:request,
  exception:exception,
});

    const errorResponse = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      message:
        exception.message || 'Une erreur interne est survenue',
    };

    console.error('Erreur capturée :', errorResponse);

    response.status(status).json(errorResponse);
  }
}
