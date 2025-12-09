import { BaseException } from './base.exception';

export class UnauthorizedException extends BaseException {
  constructor(message = 'Unauthorized') {
    super(401, message);
  }
}
