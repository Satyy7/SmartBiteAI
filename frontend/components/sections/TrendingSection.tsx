import FoodCard from "@/components/food/FoodCard";
import { Food } from "@/types/food";

interface Props {
  foods: Food[];
}

export default function TrendingSection({ foods }: Props) {
  return (
    <section className="px-6 md:px-12 lg:px-20 py-16">
      <div className="flex items-center justify-between mb-10">
        <h2 className="text-2xl md:text-3xl font-bold">
          🔥 Trending Now
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {foods.map((food) => (
          <FoodCard key={food.id} food={food} />
        ))}
      </div>
    </section>
  );
}