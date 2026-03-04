import { Food } from "./food";

export interface HomepageResponse {
  recommended?: Food[];
  reorder?: Food[];

  trending: Food[];
  cuisines: string[];
  explore: Food[];
}
