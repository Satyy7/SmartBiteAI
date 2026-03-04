export interface Food {
  id: number;
  name: string;
  description?: string;
  cuisine?: string;

  price: number;
  spice_level: number;

  calories: number;
  protein_grams: number;
  fat_grams: number;
  carbs_grams: number;
  fiber_grams: number;

  is_veg: boolean;
  is_vegan?: boolean;

  popularity_score: number;
  image_url?: string | null;
}