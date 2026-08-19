import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus, Logger } from '@nestjs/common';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    const status = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

    // Structured Error Logging for Crash/Error Monitoring (Sentry/Datadog ready)
    const errorResponse = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      message: exception instanceof HttpException ? exception.message : 'Internal server error',
    };

    if (status === HttpStatus.INTERNAL_SERVER_ERROR) {
      this.logger.error(`[CRITICAL] ${request.method} ${request.url}`, exception instanceof Error ? exception.stack : exception);
    } else {
      this.logger.warn(`[WARN] ${request.method} ${request.url} - ${errorResponse.message}`);
    }

    response.status(status).json(errorResponse);
  }
}
