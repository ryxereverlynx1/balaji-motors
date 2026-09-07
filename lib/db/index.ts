import fs from "fs";
import path from "path";
import os from "os";
import crypto from "crypto";
import {
  CategoryRecord,
  ProductRecord,
  SpecificationItem,
  AdminUserRecord,
  ActivityRecord,
  ProductFilter,
} from "./types";
import { initialCategories, initialProducts, createDefaultAdmin } from "./seed";
import { getAllLeads } from "../leads";

interface DatabaseState {
  categories: Map<string, CategoryRecord>;
  products: Map<string, ProductRecord>;
  admins: Map<string, AdminUserRecord>;
  activities: ActivityRecord[];
  isInitialized: boolean;
}

const state: DatabaseState = {
  categories: new Map(),
  products: new Map(),
  admins: new Map(),
  activities: [],
  isInitialized: false,
};

function getStorageDir(): string {
  if (process.env.VERCEL) {
    const tmpDir = path.join("/tmp", "balaji_db");
    if (!fs.existsSync(tmpDir)) {
      try {
        fs.mkdirSync(tmpDir, { recursive: true });
      } catch {}
    }
    return tmpDir;
  }
  const localDir = path.join(process.cwd(), "data", "db");
  if (!fs.existsSync(localDir)) {
    try {
      fs.mkdirSync(localDir, { recursive: true });
    } catch {
      const fallback = path.join(process.env.TEMP || process.env.TMP || os.tmpdir(), "balaji_db");
      if (!fs.existsSync(fallback)) {
        fs.mkdirSync(fallback, { recursive: true });
      }
      return fallback;
    }
  }
  return localDir;
}

function readJsonFile<T>(filename: string, fallback: T): T {
  const dir = getStorageDir();
  const filePath = path.join(dir, filename);
  try {
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, "utf8");
      return JSON.parse(content) as T;
    }
  } catch {}
  return fallback;
}

function writeJsonFile<T>(filename: string, data: T) {
  const dir = getStorageDir();
  const filePath = path.join(dir, filename);
  const content = JSON.stringify(data, null, 2);
  try {
    fs.writeFileSync(filePath, content, "utf8");
  } catch {
    try {
      const altDir = path.join(process.env.TEMP || process.env.TMP || os.tmpdir(), "balaji_db");
      if (!fs.existsSync(altDir)) {
        fs.mkdirSync(altDir, { recursive: true });
      }
      fs.writeFileSync(path.join(altDir, filename), content, "utf8");
    } catch {}
  }
}

export async function ensureDatabaseInitialized() {
  if (state.isInitialized) return;

  const storedCategories = readJsonFile<CategoryRecord[]>("categories.json", []);
  if (storedCategories.length > 0) {
    for (const cat of storedCategories) {
      state.categories.set(cat.id, cat);
    }
  } else {
    for (const cat of initialCategories) {
      state.categories.set(cat.id, cat);
    }
    writeJsonFile("categories.json", Array.from(state.categories.values()));
  }

  const storedProducts = readJsonFile<ProductRecord[]>("products.json", []);
  if (storedProducts.length > 0) {
    for (const prod of storedProducts) {
      state.products.set(prod.id, prod);
    }
  } else {
    for (const prod of initialProducts) {
      state.products.set(prod.id, prod);
    }
    writeJsonFile("products.json", Array.from(state.products.values()));
  }

  const storedAdmins = readJsonFile<AdminUserRecord[]>("admins.json", []);
  if (storedAdmins.length > 0) {
    for (const admin of storedAdmins) {
      state.admins.set(admin.email.toLowerCase(), admin);
    }
  } else {
    const defaultAdmin = await createDefaultAdmin();
    state.admins.set(defaultAdmin.email.toLowerCase(), defaultAdmin);
    writeJsonFile("admins.json", Array.from(state.admins.values()));
  }

  const storedActivities = readJsonFile<ActivityRecord[]>("activities.json", []);
  state.activities = storedActivities;

  state.isInitialized = true;
}

export async function getCategories(): Promise<CategoryRecord[]> {
  await ensureDatabaseInitialized();
  const list = Array.from(state.categories.values());
  list.sort((a, b) => a.displayOrder - b.displayOrder);
  return list;
}

export async function getCategoryById(id: string): Promise<CategoryRecord | null> {
  await ensureDatabaseInitialized();
  return state.categories.get(id) || null;
}

export async function getCategoryBySlug(slug: string): Promise<CategoryRecord | null> {
  await ensureDatabaseInitialized();
  const normalized = slug.trim().toLowerCase();
  for (const cat of Array.from(state.categories.values())) {
    if (cat.slug.toLowerCase() === normalized) {
      return cat;
    }
  }
  return null;
}

export async function saveCategory(categoryData: Partial<CategoryRecord> & { name: string }): Promise<CategoryRecord> {
  await ensureDatabaseInitialized();
  const id = categoryData.id || `cat_${Date.now()}_${crypto.randomBytes(3).toString("hex")}`;
  const now = new Date().toISOString();
  const existing = state.categories.get(id);

  const slug = categoryData.slug
    ? categoryData.slug.trim().toLowerCase().replace(/[^a-z0-9-]/g, "-")
    : categoryData.name.trim().toLowerCase().replace(/[^a-z0-9-]/g, "-");

  const record: CategoryRecord = {
    id,
    name: categoryData.name.trim(),
    nameHi: categoryData.nameHi?.trim(),
    slug,
    description: categoryData.description?.trim(),
    displayOrder: typeof categoryData.displayOrder === "number" ? categoryData.displayOrder : state.categories.size + 1,
    enabled: categoryData.enabled !== undefined ? categoryData.enabled : true,
    createdAt: existing ? existing.createdAt : now,
    updatedAt: now,
  };

  state.categories.set(id, record);
  writeJsonFile("categories.json", Array.from(state.categories.values()));
  return record;
}

export async function deleteCategory(id: string): Promise<boolean> {
  await ensureDatabaseInitialized();
  if (state.categories.has(id)) {
    state.categories.delete(id);
    writeJsonFile("categories.json", Array.from(state.categories.values()));
    return true;
  }
  return false;
}

export async function getProducts(filter?: ProductFilter): Promise<ProductRecord[]> {
  await ensureDatabaseInitialized();
  let list = Array.from(state.products.values());

  if (filter) {
    if (filter.status && filter.status !== "all") {
      list = list.filter((p) => p.status === filter.status);
    }
    if (filter.featuredOnly) {
      list = list.filter((p) => p.featured);
    }
    if (filter.categorySlug) {
      const cat = await getCategoryBySlug(filter.categorySlug);
      if (cat) {
        list = list.filter((p) => p.categoryId === cat.id);
      }
    }
    if (filter.search) {
      const q = filter.search.toLowerCase().trim();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          (p.nameHi && p.nameHi.toLowerCase().includes(q)) ||
          p.shortDescription.toLowerCase().includes(q) ||
          p.slug.toLowerCase().includes(q)
      );
    }
  }

  for (const prod of list) {
    if (!prod.categoryName) {
      const cat = state.categories.get(prod.categoryId);
      if (cat) prod.categoryName = cat.name;
    }
  }

  list.sort((a, b) => {
    if (a.displayOrder !== b.displayOrder) {
      return a.displayOrder - b.displayOrder;
    }
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  return list;
}

export async function getProductById(id: string): Promise<ProductRecord | null> {
  await ensureDatabaseInitialized();
  const prod = state.products.get(id);
  if (!prod) return null;
  if (!prod.categoryName) {
    const cat = state.categories.get(prod.categoryId);
    if (cat) prod.categoryName = cat.name;
  }
  return prod;
}

export async function getProductBySlug(slug: string, allowDraft = false): Promise<ProductRecord | null> {
  await ensureDatabaseInitialized();
  const normalized = slug.trim().toLowerCase();
  for (const prod of Array.from(state.products.values())) {
    if (prod.slug.toLowerCase() === normalized) {
      if (!allowDraft && prod.status !== "published") {
        return null;
      }
      if (!prod.categoryName) {
        const cat = state.categories.get(prod.categoryId);
        if (cat) prod.categoryName = cat.name;
      }
      return prod;
    }
  }
  return null;
}

export async function saveProduct(productData: Partial<ProductRecord> & { name: string; categoryId: string }): Promise<ProductRecord> {
  await ensureDatabaseInitialized();
  const id = productData.id || `prod_${Date.now()}_${crypto.randomBytes(3).toString("hex")}`;
  const now = new Date().toISOString();
  const existing = state.products.get(id);

  let rawSlug = productData.slug
    ? productData.slug.trim().toLowerCase().replace(/[^a-z0-9-]/g, "-").replace(/-+/g, "-")
    : productData.name.trim().toLowerCase().replace(/[^a-z0-9-]/g, "-").replace(/-+/g, "-");

  if (!rawSlug) rawSlug = `vehicle-${Date.now()}`;

  let finalSlug = rawSlug;
  let counter = 1;
  while (true) {
    let collision = false;
    for (const [existingId, prod] of Array.from(state.products.entries())) {
      if (existingId !== id && prod.slug.toLowerCase() === finalSlug.toLowerCase()) {
        collision = true;
        break;
      }
    }
    if (!collision) break;
    finalSlug = `${rawSlug}-${counter++}`;
  }

  const category = state.categories.get(productData.categoryId);
  const categoryName = category ? category.name : "Passenger Vehicle";

  const specs: SpecificationItem[] = Array.isArray(productData.specifications)
    ? productData.specifications.map((s, idx) => ({
        id: s.id || `spec_${id}_${idx + 1}`,
        productId: id,
        label: s.label.trim(),
        labelHi: s.labelHi?.trim(),
        value: s.value.trim(),
        valueHi: s.valueHi?.trim(),
        icon: s.icon || "layers",
        displayOrder: typeof s.displayOrder === "number" ? s.displayOrder : idx + 1,
      }))
    : existing?.specifications || [];

  const record: ProductRecord = {
    id,
    name: productData.name.trim(),
    nameHi: productData.nameHi?.trim(),
    slug: finalSlug,
    categoryId: productData.categoryId,
    categoryName,
    shortDescription: productData.shortDescription?.trim() || "",
    shortDescriptionHi: productData.shortDescriptionHi?.trim(),
    fullDescription: productData.fullDescription?.trim() || "",
    fullDescriptionHi: productData.fullDescriptionHi?.trim(),
    mainImage: productData.mainImage?.trim() || "/images/rickshaw-red.webp",
    galleryImages: Array.isArray(productData.galleryImages) ? productData.galleryImages : [productData.mainImage || "/images/rickshaw-red.webp"],
    priceMode: productData.priceMode === "fixed_price" ? "fixed_price" : "on_enquiry",
    price: productData.priceMode === "fixed_price" && typeof productData.price === "number" ? productData.price : null,
    currency: productData.currency || "INR",
    featured: Boolean(productData.featured),
    status: productData.status || "draft",
    displayOrder: typeof productData.displayOrder === "number" ? productData.displayOrder : state.products.size + 1,
    model3dUrl: productData.model3dUrl !== undefined ? productData.model3dUrl : null,
    specifications: specs,
    createdAt: existing ? existing.createdAt : now,
    updatedAt: now,
  };

  state.products.set(id, record);
  writeJsonFile("products.json", Array.from(state.products.values()));
  return record;
}

export async function duplicateProduct(id: string): Promise<ProductRecord | null> {
  await ensureDatabaseInitialized();
  const source = state.products.get(id);
  if (!source) return null;

  const newId = `prod_${Date.now()}_${crypto.randomBytes(3).toString("hex")}`;
  const now = new Date().toISOString();

  const newSpecs = source.specifications.map((s, idx) => ({
    ...s,
    id: `spec_${newId}_${idx + 1}`,
    productId: newId,
  }));

  const copyRecord: ProductRecord = {
    ...source,
    id: newId,
    name: `${source.name} (Copy)`,
    nameHi: source.nameHi ? `${source.nameHi} (प्रतिलिपि)` : undefined,
    slug: `${source.slug}-copy-${Date.now().toString().slice(-4)}`,
    status: "draft",
    featured: false,
    specifications: newSpecs,
    createdAt: now,
    updatedAt: now,
  };

  state.products.set(newId, copyRecord);
  writeJsonFile("products.json", Array.from(state.products.values()));
  return copyRecord;
}

export async function deleteProduct(id: string): Promise<boolean> {
  await ensureDatabaseInitialized();
  if (state.products.has(id)) {
    state.products.delete(id);
    writeJsonFile("products.json", Array.from(state.products.values()));
    return true;
  }
  return false;
}

export async function getAdminByEmail(email: string): Promise<AdminUserRecord | null> {
  await ensureDatabaseInitialized();
  return state.admins.get(email.toLowerCase().trim()) || null;
}

export async function saveAdminUser(admin: AdminUserRecord): Promise<AdminUserRecord> {
  await ensureDatabaseInitialized();
  state.admins.set(admin.email.toLowerCase().trim(), admin);
  writeJsonFile("admins.json", Array.from(state.admins.values()));
  return admin;
}

export async function logActivity(entry: Omit<ActivityRecord, "id" | "createdAt">): Promise<ActivityRecord> {
  await ensureDatabaseInitialized();
  const record: ActivityRecord = {
    id: `act_${Date.now()}_${crypto.randomBytes(3).toString("hex")}`,
    adminEmail: entry.adminEmail,
    action: entry.action,
    entityType: entry.entityType,
    entityId: entry.entityId,
    details: entry.details,
    createdAt: new Date().toISOString(),
  };

  state.activities.unshift(record);
  if (state.activities.length > 200) {
    state.activities = state.activities.slice(0, 200);
  }
  writeJsonFile("activities.json", state.activities);
  return record;
}

export async function getActivities(limit = 50): Promise<ActivityRecord[]> {
  await ensureDatabaseInitialized();
  return state.activities.slice(0, limit);
}

export async function getDashboardStats() {
  await ensureDatabaseInitialized();
  const products = Array.from(state.products.values());
  const categories = Array.from(state.categories.values());
  const enquiries = getAllLeads();

  const totalProducts = products.length;
  const publishedProducts = products.filter((p) => p.status === "published").length;
  const draftProducts = products.filter((p) => p.status === "draft").length;
  const archivedProducts = products.filter((p) => p.status === "archived").length;
  const totalCategories = categories.filter((c) => c.enabled).length;
  const totalEnquiries = enquiries.length;
  const newEnquiries = enquiries.filter((e) => e.status === "new").length;

  return {
    totalProducts,
    publishedProducts,
    draftProducts,
    archivedProducts,
    totalCategories,
    totalEnquiries,
    newEnquiries,
  };
}