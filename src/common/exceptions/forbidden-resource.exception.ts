import { HttpException, HttpStatus } from '@nestjs/common';

export class ForbiddenResourceException extends HttpException {
  constructor(message: string = 'Forbidden resource') {
    super(message, HttpStatus.FORBIDDEN);
  }
}