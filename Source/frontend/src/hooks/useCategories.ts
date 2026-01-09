import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Category } from "@/types/products";

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    api.get("/categories").then((res) => {
      setCategories(res.data);
    });
  }, []);

  return categories;
}
