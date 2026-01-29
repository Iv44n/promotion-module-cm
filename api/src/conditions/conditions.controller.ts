import { ConditionsService } from './conditions.service';
import { Controller, Get } from '@nestjs/common';
import { ConditionsRepository } from './conditions.repository';

@Controller('conditions')
export class ConditionsController {
  constructor(private readonly conditionsRepository: ConditionsRepository) {}

  @Get()
  async getAllConditions() {
    const conditions = this.conditionsRepository.getAllConditions();

    return conditions;
  }
}
