import { BaseException } from './base.exception';

export class NotFoundException extends BaseException {
  constructor(message = 'Resource not found') {
    super(404, message);
  }
}
