import { PublicUser } from "./user";

export type MatchFilters = {
  latitude?: number;
  longitude?: number;
  max_distance_km?: number;
  min_age?: number;
  max_age?: number;
  min_fame?: number;
  tags?: string[];
}

export type MatchScore = {
  location_score: number;
  tag_score: number;
  fame_score: number;
  total: number;
}

export type MatchResult = {
  user: PublicUser;
  score: MatchScore;
}