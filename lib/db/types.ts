export type PriceMode = "on_enquiry" | "fixed_price";
export type ProductStatus = "draft" | "published" | "archived";

export interface CategoryRecord {
  id: string;
  name: string;
  nameHi?: string;
  slug: string;
  description?: string;
  descriptionHi?: string;
  displayOrder: number;
  enabled: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SpecificationItem {
  id: string;
  productId: string;
  label: string;
  labelHi?: string;
  value: string;
  valueHi?: string;
  icon?: string;
  category?: string;
  unit?: string;
  displayOrder: number;
}

export interface ProductRecord {
  id: string;
  name: string;
  nameHi?: string;
  slug: string;
  categoryId: string;
  categoryName?: string;
  shortDescription: string;
  shortDescriptionHi?: string;
  fullDescription: string;
  fullDescriptionHi?: string;
  mainImage: string;
  galleryImages: string[];
  priceMode: PriceMode;
  price: number | null;
  currency: string;
  featured: boolean;
  status: ProductStatus;
  displayOrder: number;
  model3dUrl?: string | null;
  specifications: SpecificationItem[];
  createdAt: string;
  updatedAt: string;
}

export interface AdminUserRecord {
  id: string;
  email: string;
  passwordHash: string;
  name: string;
  role: "admin";
  createdAt: string;
  updatedAt: string;
}

export interface ActivityRecord {
  id: string;
  adminEmail: string;
  action: string;
  entityType: "product" | "category" | "enquiry" | "customer" | "auth" | "settings";
  entityId?: string;
  details: string;
  createdAt: string;
}

export interface ProductFilter {
  categorySlug?: string;
  categoryId?: string;
  status?: ProductStatus | "all";
  featuredOnly?: boolean;
  search?: string;
}

export interface CustomerStoryRecord {
  id: string;
  name: string;
  nameHi?: string;
  location: string;
  locationHi?: string;
  vehicleName: string;
  vehicleNameHi?: string;
  deliveryDate: string;
  deliveryDateHi?: string;
  rating: number;
  quote: string;
  quoteHi?: string;
  image: string;
  featured: boolean;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface CustomerFilter {
  featuredOnly?: boolean;
  search?: string;
}