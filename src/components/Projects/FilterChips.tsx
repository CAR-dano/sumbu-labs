"use client";

interface Category {
  id: string;
  label: string;
}

interface FilterChipsProps {
  categories: Category[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

export default function FilterChips({
  categories,
  selectedCategory,
  onCategoryChange,
}: FilterChipsProps) {
  return (
    <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-10 sm:mb-12 px-2 animate-slide-in-up">
      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => onCategoryChange(category.id)}
          className={`
            px-4 sm:px-6 py-2 sm:py-3 rounded-full font-roboto font-light text-xs sm:text-sm
            transition-all duration-300 ease-out
            ${
              selectedCategory === category.id
                ? "bg-[#6750A4] text-white shadow-lg shadow-[#6750A4]/50 scale-105"
                : "bg-[#0A1320] text-gray-300 border border-gray-700 hover:border-[#6750A4] hover:text-white hover:scale-105"
            }
          `}
        >
          {category.label}
        </button>
      ))}
    </div>
  );
}
