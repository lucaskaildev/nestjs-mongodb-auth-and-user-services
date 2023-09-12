import {
    ArgumentsHost,
    Catch,
    ExceptionFilter,
    HttpException,
    HttpStatus
  } from '@nestjs/common';
  import { Response, Request } from 'express';
  
  import * as fs from 'fs';
  
  import {
    HttpExceptionResponse, HttpExceptionResponseExtended,
  } from '../common/interfaces/http-exception-response'
  
  @Catch()
  export class AllExceptionsFilter implements ExceptionFilter {
    catch(exception: unknown, host: ArgumentsHost) {
      const ctx = host.switchToHttp();
      const response = ctx.getResponse<Response>();
      const request = ctx.getRequest<Request>();
  
      let status: HttpStatus;
      let clientErrorMessage: string;
      if (exception instanceof HttpException) {
        status = exception.getStatus();
        const errorResponse = exception.getResponse();
        clientErrorMessage =
          (errorResponse as HttpExceptionResponse).error || exception.message;
      } else {
        status = HttpStatus.INTERNAL_SERVER_ERROR;
        clientErrorMessage = 'Critical internal server error occurred!';
      }
      const errorResponse = this.getErrorResponse(status, clientErrorMessage, request);
      const errorLog = this.getErrorLog(errorResponse, request, exception);
      this.writeErrorLogToFile(errorLog);
      response.status(status).json(errorResponse);
    }
  
    private getErrorResponse = (
      status: HttpStatus,
      errorMessage: string,
      request: Request,
    ): HttpExceptionResponseExtended => ({
      statusCode: status,
      error: errorMessage,
      path: request.url,
      method: request.method,
      timeStamp: new Date(),
    });
  
    private getErrorLog = (
      errorResponse: HttpExceptionResponseExtended,
      request: Request,
      exception: unknown,
    ): string => {
      const { statusCode, error } = errorResponse;
      const { method, url } = request;
      const errorLog = `Response Code: ${statusCode} - Method: ${method} - URL: ${url}\n\n
      ${JSON.stringify(errorResponse)}\n\n
      User: ${JSON.stringify(request.user ?? 'Not signed in')}\n\n
      ${exception instanceof HttpException ? exception.stack : error}\n\n
      Exception: ${exception}`;
      console.error(errorLog)
      return errorLog;
    };
  
    private writeErrorLogToFile = (errorLog: string): void => {
      fs.appendFile('app-error.log', errorLog, 'utf8', (err) => {
        if (err) throw err;
      });
    };
  }