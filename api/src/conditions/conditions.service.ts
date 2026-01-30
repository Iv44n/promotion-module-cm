import { Injectable } from '@nestjs/common';
import { ConditionsRepository } from './conditions.repository';

@Injectable()
export class ConditionsService {
  constructor(private readonly conditionsRepository: ConditionsRepository) {}

  getAllConditions() {
    return this.conditionsRepository.getAllConditions();
  }
}
