import { Injectable } from '@nestjs/common';
import { ActionsRepository } from './actions.repository';

@Injectable()
export class ActionsService {
  constructor(private readonly actionsRepository: ActionsRepository) {}

  getActionTypes() {
    return this.actionsRepository.getActionTypes();
  }
}
