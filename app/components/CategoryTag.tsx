import type { Category } from "@/app/lib/mockData";

interface Props {
  category: Category;
  size?: "sm" | "md";
}

export default function CategoryTag({ category, size = "sm" }: Props) {
  const base = size === "md"
    ? "inline-flex items-center font-semibold font-sans px-3 py-1 rounded-full text-sm"
    : "inline-flex items-center font-semibold font-sans px-2 py-0.5 rounded-full text-xs";

  const styles: Record<Category, string> = {
    Business:     `${base} bg-amber-100 text-amber-800`,
    Service:      `${base} bg-blue-100 text-blue-800`,
    Organization: `${base} bg-green-100 text-green-800`,
  };

  return <span className={styles[category]}>{category}</span>;
}
