import FoodCard from "@/components/food/FoodCard";
import { Food } from "@/types/food";

interface Props {
  foods: Food[];
}

export default function RecommendedSection({ foods }: Props) {
  return (
    <section className="px-6 md:px-12 lg:px-20 py-16 bg-linear-to-b from-transparent to-(--secondary)/5">
      
      <div className="flex items-center justify-between mb-10">
        <h2 className="text-2xl md:text-3xl font-bold gradient-text">
          Recommended For You
        </h2>
      </div>

      {/* Desktop Grid */}
      <div className="hidden md:grid grid-cols-2 lg:grid-cols-4 gap-6">
        {foods.map((food) => (
          <FoodCard key={food.id} food={food} />
        ))}
      </div>

      {/* Mobile Horizontal Scroll */}
      <div className="md:hidden flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
        {foods.map((food) => (
          <div key={food.id} className="min-w-65">
            <FoodCard food={food} />
          </div>
        ))}
      </div>
    </section>
  );
}