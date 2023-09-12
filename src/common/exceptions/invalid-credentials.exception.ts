import { HttpException, HttpStatus } from '@nestjs/common';

export class InvalidCredentialsException extends HttpException {
  constructor(message: string = 'Invalid credentials') {
    super(message, HttpStatus.BAD_REQUEST);
  }
}