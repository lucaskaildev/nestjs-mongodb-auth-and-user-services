import { HttpException, HttpStatus } from '@nestjs/common';

export class UserNotVerifiedException extends HttpException {
  constructor(message: string = 'User e-mail or phone number is not verified.') {
    super(message, HttpStatus.BAD_REQUEST);
  }
}