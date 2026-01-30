import { Controller, Get } from "@nestjs/common";
import type { Banner, GlobalConfig, RecommendationRule, TierRule } from "@shared/types";
import { ContentstackService } from "../services/contentstack.service";

@Controller()
export class ConfigController {
  constructor(private readonly contentstack: ContentstackService) {}

  @Get("config")
  getGlobalConfig(): Promise<GlobalConfig> {
    return this.contentstack.getGlobalConfig();
  }

  @Get("banners")
  getBanners(): Promise<Banner[]> {
    return this.contentstack.getBanners();
  }

  @Get("tiers")
  getTiers(): Promise<TierRule[]> {
    return this.contentstack.getTierRules();
  }

  @Get("recommendations")
  getRecommendations(): Promise<RecommendationRule[]> {
    return this.contentstack.getRecommendations();
  }
}

