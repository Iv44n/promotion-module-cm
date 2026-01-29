import { Controller, Get, Inject, Post } from '@nestjs/common';
import { get } from 'http';
import { ActionsRepository } from 'src/actions/actions.repository';
import { PromotionsRepository } from 'src/promotions/promotions.repository';

@Controller('actions')
export class ActionsController {
  constructor(private readonly actionsRepository: ActionsRepository) {}

  @Get()
  async getAllActions() {
    const actions = await this.actionsRepository.getActionTypes();

    return actions;
  }
}
