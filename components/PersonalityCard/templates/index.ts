import { default as PremiumTemplate } from "./PremiumTemplate";
import { default as MinimalistTemplate } from "./MinimalistTemplate";
import { default as VibrantTemplate } from "./VibrantTemplate";
import { default as ModernTemplate } from "./ModernTemplate";
import { default as ChallengeCard, challengeData, generateChallengeCard } from "./ChallengeCard";

export const templates = {
  premium: PremiumTemplate,
  minimalist: MinimalistTemplate,
  vibrant: VibrantTemplate,
  modern: ModernTemplate,
};

export { ChallengeCard, challengeData, generateChallengeCard };
