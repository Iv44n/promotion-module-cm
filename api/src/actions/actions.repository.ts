import { Inject, Injectable } from '@nestjs/common';
import { NeonHttpDatabase } from 'drizzle-orm/neon-http';
import * as schema from '../database/drizzle.schema';
import { DRIZZLE_TOKEN } from 'src/database/drizzle.provider';
import { ShowActionsResponseDto } from 'src/dto/response/ShowActionsResponse';
import { eq } from 'drizzle-orm';
import { promotionActions } from '../database/drizzle.schema';

@Injectable()
export class ActionsRepository {
  constructor(
    @Inject(DRIZZLE_TOKEN)
    private readonly db: NeonHttpDatabase<typeof schema>,
  ) {}

  async getActionTypes(): Promise<ShowActionsResponseDto[]> {
    const actions = await this.db
      .select({
        actionType: schema.promotionActions.action_type,
      })
      .from(schema.promotionActions);

    return actions;
  }

  async getActionById(id: string) {
    return await this.db.query.promotionActions.findFirst({
      where: eq(schema.promotionActions.id, Number(id)),
    });
  }
}
