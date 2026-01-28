import { Injectable } from "@nestjs/common";
import { PromotionRepository } from "src/repositories/PromotionRepository";

@Injectable()
export class PromotionsService {
    constructor(
        private readonly promotionRepository: PromotionRepository,
    ) {}
}