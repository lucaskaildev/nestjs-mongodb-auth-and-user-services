import { HttpException, HttpStatus } from '@nestjs/common';

export class UserNotActiveException extends HttpException {
  constructor(message: string = 'User account has been deactivated. Please check your e-mail for a reactivation link.') {
    super(message, HttpStatus.FORBIDDEN);
  }
}