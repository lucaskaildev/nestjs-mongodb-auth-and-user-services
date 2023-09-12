import { HttpException, HttpStatus } from '@nestjs/common';

export class InvalidTokenException extends HttpException {
  constructor(message: string = 'The provided token is invalid or has already expired.') {
    super(message, HttpStatus.BAD_REQUEST);
  }
}