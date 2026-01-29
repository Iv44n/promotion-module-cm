import { Controller, Get } from '@nestjs/common';
import { ConditionsRepository } from './conditions.repository';

@Controller('conditions')
export class ConditionsController {
  constructor(private readonly conditionsRepository: ConditionsRepository) {}

  @Get()
  getAllConditions() {
    return this.conditionsRepository.getAllConditions();
  }
}
