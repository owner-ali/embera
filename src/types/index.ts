export interface CarouselDish {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  rating: number;
  ratingCount: number;
  category: string;
  isSpicy?: boolean;
  isVegetarian?: boolean;
}

export interface NavLink {
  label: string;
  href: string;
}

export interface CartLine {
  id: string;
  dishId: string;
  slug: string;
  name: string;
  imageUrl: string;
  unitPrice: number;
  quantity: number;
  spicyLevel?: string;
  extraCheese?: boolean;
  extraSauce?: boolean;
  sideDish?: string;
  notes?: string;
}
