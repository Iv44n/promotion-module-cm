import { Controller, Get } from '@nestjs/common';
import { MetadataService } from './metadata.service';

@Controller('api/promotions/metadata')
export class MetadataController {
  constructor(private readonly metadataService: MetadataService) {}

  @Get('actions')
  getActions() {
    return this.metadataService.getAllActions();
  }

  @Get('conditions')
  getConditions() {
    return this.metadataService.getAllConditions();
  }
}
