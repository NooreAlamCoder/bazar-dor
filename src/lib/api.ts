import type { Category, Product } from "@/types/product";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://api.api-store.workers.dev/api/bazardor";

export async function getProducts(): Promise<Product[]> {
  const response = await fetch(`${API_URL}/products`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("পণ্যের তথ্য লোড করা যায়নি");
  }

  return response.json();
}

export async function getProductsByCategory(
  category: string
): Promise<Product[]> {
  const response = await fetch(
    `${API_URL}/products?category=${category}`
  );

  if (!response.ok) {
    throw new Error("ক্যাটাগরির পণ্য লোড করা যায়নি");
  }

  return response.json();
}

export async function getProduct(
  id: number | string
): Promise<Product> {
  const response = await fetch(`${API_URL}/products/${id}`);

  if (!response.ok) {
    throw new Error("পণ্যটি পাওয়া যায়নি");
  }

  return response.json();
}

export async function getCategories(): Promise<Category[]> {
  const response = await fetch(`${API_URL}/categories`);

  if (!response.ok) {
    throw new Error("ক্যাটাগরির তথ্য লোড করা যায়নি");
  }

  return response.json();
}

export async function getCategory(
  slug: string
): Promise<Category> {
  const response = await fetch(`${API_URL}/categories/${slug}`);

  if (!response.ok) {
    throw new Error("ক্যাটাগরিটি পাওয়া যায়নি");
  }

  return response.json();
}