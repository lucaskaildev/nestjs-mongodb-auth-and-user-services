import { HttpException, HttpStatus } from '@nestjs/common';

export class InvalidAuthCodeException extends HttpException {
  constructor(message: string = 'The authentication code is invalid or has already expired.') {
    super(message, HttpStatus.BAD_REQUEST);
  }
}