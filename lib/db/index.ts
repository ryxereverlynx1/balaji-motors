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
  CustomerStoryRecord,
  CustomerFilter,
} from "./types";
import { initialCategories, initialProducts, createDefaultAdmin, initialCustomers } from "./seed";
import { getAllLeads } from "../leads";
import { getMongoDb } from "./mongodb";

interface DatabaseState {
  categories: Map<string, CategoryRecord>;
  products: Map<string, ProductRecord>;
  admins: Map<string, AdminUserRecord>;
  customers: Map<string, CustomerStoryRecord>;
  activities: ActivityRecord[];
  isInitialized: boolean;
}

const state: DatabaseState = {
  categories: new Map(),
  products: new Map(),
  admins: new Map(),
  customers: new Map(),
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
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf8");
  } catch {}
}

export async function ensureDatabaseInitialized() {
  if (state.isInitialized) return;

  const mongo = await getMongoDb();
  if (mongo) {
    try {
      const prodCount = await mongo.collection("products").countDocuments();
      if (prodCount === 0) {
        const cloned = initialProducts.map((p) => ({ ...p }));
        await mongo.collection("products").insertMany(cloned);
      }

      const catCount = await mongo.collection("categories").countDocuments();
      if (catCount === 0) {
        const cloned = initialCategories.map((c) => ({ ...c }));
        await mongo.collection("categories").insertMany(cloned);
      }

      const adminCount = await mongo.collection("admins").countDocuments();
      if (adminCount === 0) {
        const defaultAdmin = await createDefaultAdmin();
        await mongo.collection("admins").insertOne({ ...defaultAdmin });
      }

      const custCount = await mongo.collection("customers").countDocuments();
      if (custCount === 0) {
        const cloned = initialCustomers.map((c) => ({ ...c }));
        await mongo.collection("customers").insertMany(cloned);
      }

      const dbProds = await mongo
        .collection<ProductRecord>("products")
        .find({}, { projection: { _id: 0 } })
        .toArray();
      const dbCats = await mongo
        .collection<CategoryRecord>("categories")
        .find({}, { projection: { _id: 0 } })
        .toArray();
      const dbAdmins = await mongo
        .collection<AdminUserRecord>("admins")
        .find({}, { projection: { _id: 0 } })
        .toArray();
      const dbCusts = await mongo
        .collection<CustomerStoryRecord>("customers")
        .find({}, { projection: { _id: 0 } })
        .sort({ displayOrder: 1, createdAt: -1 })
        .toArray();
      const dbActs = await mongo
        .collection<ActivityRecord>("activities")
        .find({}, { projection: { _id: 0 } })
        .sort({ createdAt: -1 })
        .limit(100)
        .toArray();

      state.products.clear();
      for (const p of dbProds) state.products.set(p.id, p);

      state.categories.clear();
      for (const c of dbCats) state.categories.set(c.id, c);

      state.admins.clear();
      for (const a of dbAdmins) state.admins.set(a.email.toLowerCase(), a);

      state.customers.clear();
      for (const cu of dbCusts) state.customers.set(cu.id, cu);

      state.activities = dbActs;
      state.isInitialized = true;
      return;
    } catch {}
  }

  const storedCategories = readJsonFile<CategoryRecord[]>("categories.json", []);
  if (storedCategories.length > 0) {
    for (const cat of storedCategories) {
      state.categories.set(cat.id, cat);
    }
  } else {
    for (const cat of initialCategories) {
      state.categories.set(cat.id, cat);
    }
    writeJsonFile("categories.json", initialCategories);
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
    writeJsonFile("products.json", initialProducts);
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

  const storedCustomers = readJsonFile<CustomerStoryRecord[]>("customers.json", []);
  if (storedCustomers.length > 0) {
    for (const cust of storedCustomers) {
      state.customers.set(cust.id, cust);
    }
  } else {
    for (const cust of initialCustomers) {
      state.customers.set(cust.id, cust);
    }
    writeJsonFile("customers.json", initialCustomers);
  }

  state.activities = readJsonFile<ActivityRecord[]>("activities.json", []);
  state.isInitialized = true;
}

export async function getProducts(filter?: ProductFilter): Promise<ProductRecord[]> {
  await ensureDatabaseInitialized();

  const mongo = await getMongoDb();
  if (mongo) {
    try {
      const query: Record<string, any> = {};
      if (filter?.status) {
        query.status = filter.status;
      }
      if (filter?.categoryId && filter.categoryId !== "all") {
        query.categoryId = filter.categoryId;
      }
      if (filter?.featuredOnly) {
        query.featured = true;
      }
      if (filter?.search) {
        const term = filter.search.trim();
        query.$or = [
          { name: { $regex: term, $options: "i" } },
          { nameHi: { $regex: term, $options: "i" } },
          { slug: { $regex: term, $options: "i" } },
          { shortDescription: { $regex: term, $options: "i" } },
        ];
      }
      const list = await mongo
        .collection<ProductRecord>("products")
        .find(query, { projection: { _id: 0 } })
        .sort({ displayOrder: 1, createdAt: -1 })
        .toArray();
      return list;
    } catch {}
  }

  let results = Array.from(state.products.values());

  if (filter?.status) {
    results = results.filter((p) => p.status === filter.status);
  }

  if (filter?.categoryId && filter.categoryId !== "all") {
    results = results.filter((p) => p.categoryId === filter.categoryId);
  }

  if (filter?.featuredOnly) {
    results = results.filter((p) => p.featured === true);
  }

  if (filter?.search) {
    const q = filter.search.toLowerCase().trim();
    results = results.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        (p.nameHi && p.nameHi.includes(q)) ||
        p.slug.toLowerCase().includes(q) ||
        p.shortDescription.toLowerCase().includes(q)
    );
  }

  results.sort((a, b) => {
    if (a.displayOrder !== b.displayOrder) {
      return a.displayOrder - b.displayOrder;
    }
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  return results;
}

export async function getProductById(id: string): Promise<ProductRecord | null> {
  await ensureDatabaseInitialized();

  const mongo = await getMongoDb();
  if (mongo) {
    try {
      const item = await mongo
        .collection<ProductRecord>("products")
        .findOne({ id }, { projection: { _id: 0 } });
      if (item) return item;
    } catch {}
  }

  return state.products.get(id) || null;
}

export async function getProductBySlug(
  slug: string,
  allowDraft = false
): Promise<ProductRecord | null> {
  await ensureDatabaseInitialized();

  const mongo = await getMongoDb();
  if (mongo) {
    try {
      const query: Record<string, any> = { slug };
      if (!allowDraft) {
        query.status = "published";
      }
      const item = await mongo
        .collection<ProductRecord>("products")
        .findOne(query, { projection: { _id: 0 } });
      if (item) return item;
    } catch {}
  }

  const normalized = slug.toLowerCase().trim();
  for (const product of state.products.values()) {
    if (product.slug.toLowerCase() === normalized) {
      if (!allowDraft && product.status !== "published") {
        return null;
      }
      return product;
    }
  }
  return null;
}

export async function saveProduct(input: Partial<ProductRecord>): Promise<ProductRecord> {
  await ensureDatabaseInitialized();

  const id = input.id || `prod_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
  const now = new Date().toISOString();

  let categoryName = input.categoryName;
  if (!categoryName && input.categoryId) {
    const cat = await getCategoryById(input.categoryId);
    categoryName = cat?.name || "Electric Vehicle";
  }

  const existing = input.id ? await getProductById(input.id) : null;

  const record: ProductRecord = {
    id,
    name: input.name || existing?.name || "Unnamed Vehicle",
    nameHi: input.nameHi !== undefined ? input.nameHi : existing?.nameHi,
    slug: input.slug || existing?.slug || id,
    categoryId: input.categoryId || existing?.categoryId || "cat_passenger",
    categoryName: categoryName || existing?.categoryName || "Passenger Vehicle",
    shortDescription: input.shortDescription || existing?.shortDescription || "",
    shortDescriptionHi:
      input.shortDescriptionHi !== undefined ? input.shortDescriptionHi : existing?.shortDescriptionHi,
    fullDescription: input.fullDescription || existing?.fullDescription || "",
    fullDescriptionHi:
      input.fullDescriptionHi !== undefined ? input.fullDescriptionHi : existing?.fullDescriptionHi,
    mainImage: input.mainImage || existing?.mainImage || "/images/rickshaw-red.webp",
    galleryImages:
      input.galleryImages ||
      existing?.galleryImages ||
      (input.mainImage ? [input.mainImage] : ["/images/rickshaw-red.webp"]),
    priceMode: input.priceMode || existing?.priceMode || "on_enquiry",
    price: input.price !== undefined ? input.price : (existing?.price ?? null),
    currency: input.currency || existing?.currency || "INR",
    featured: input.featured !== undefined ? input.featured : (existing?.featured ?? false),
    status: input.status || existing?.status || "draft",
    displayOrder: input.displayOrder !== undefined ? input.displayOrder : (existing?.displayOrder ?? 1),
    model3dUrl: input.model3dUrl !== undefined ? input.model3dUrl : existing?.model3dUrl,
    specifications: input.specifications || existing?.specifications || [],
    createdAt: existing?.createdAt || now,
    updatedAt: now,
  };

  state.products.set(record.id, record);
  writeJsonFile("products.json", Array.from(state.products.values()));

  const mongo = await getMongoDb();
  if (mongo) {
    try {
      await mongo
        .collection("products")
        .replaceOne({ id: record.id }, { ...record }, { upsert: true });
    } catch {}
  }

  return record;
}

export async function deleteProduct(id: string): Promise<boolean> {
  await ensureDatabaseInitialized();

  const deleted = state.products.delete(id);
  if (deleted) {
    writeJsonFile("products.json", Array.from(state.products.values()));
  }

  const mongo = await getMongoDb();
  if (mongo) {
    try {
      await mongo.collection("products").deleteOne({ id });
    } catch {}
  }

  return deleted;
}

export async function duplicateProduct(id: string): Promise<ProductRecord | null> {
  await ensureDatabaseInitialized();
  const original = await getProductById(id);
  if (!original) return null;

  const clone: ProductRecord = {
    ...original,
    id: `prod_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
    name: `${original.name} (Copy)`,
    nameHi: original.nameHi ? `${original.nameHi} (प्रतिलिपि)` : undefined,
    slug: `${original.slug}-copy-${Date.now().toString().slice(-4)}`,
    status: "draft",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  return saveProduct(clone);
}

export async function getCategories(): Promise<CategoryRecord[]> {
  await ensureDatabaseInitialized();

  const mongo = await getMongoDb();
  if (mongo) {
    try {
      const list = await mongo
        .collection<CategoryRecord>("categories")
        .find({}, { projection: { _id: 0 } })
        .sort({ displayOrder: 1 })
        .toArray();
      return list;
    } catch {}
  }

  const results = Array.from(state.categories.values());
  results.sort((a, b) => a.displayOrder - b.displayOrder);
  return results;
}

export async function getCategoryById(id: string): Promise<CategoryRecord | null> {
  await ensureDatabaseInitialized();

  const mongo = await getMongoDb();
  if (mongo) {
    try {
      const item = await mongo
        .collection<CategoryRecord>("categories")
        .findOne({ id }, { projection: { _id: 0 } });
      if (item) return item;
    } catch {}
  }

  return state.categories.get(id) || null;
}

export async function getCategoryBySlug(slug: string): Promise<CategoryRecord | null> {
  await ensureDatabaseInitialized();

  const mongo = await getMongoDb();
  if (mongo) {
    try {
      const item = await mongo
        .collection<CategoryRecord>("categories")
        .findOne({ slug }, { projection: { _id: 0 } });
      if (item) return item;
    } catch {}
  }

  const normalized = slug.toLowerCase().trim();
  for (const cat of state.categories.values()) {
    if (cat.slug.toLowerCase() === normalized) {
      return cat;
    }
  }
  return null;
}

export async function saveCategory(input: Partial<CategoryRecord>): Promise<CategoryRecord> {
  await ensureDatabaseInitialized();

  const id = input.id || `cat_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
  const now = new Date().toISOString();
  const existing = input.id ? await getCategoryById(input.id) : null;

  const record: CategoryRecord = {
    id,
    name: input.name || existing?.name || "Unnamed Category",
    nameHi: input.nameHi !== undefined ? input.nameHi : existing?.nameHi,
    slug: input.slug || existing?.slug || id,
    description: input.description !== undefined ? input.description : existing?.description,
    descriptionHi: input.descriptionHi !== undefined ? input.descriptionHi : existing?.descriptionHi,
    displayOrder: input.displayOrder !== undefined ? input.displayOrder : (existing?.displayOrder ?? 1),
    enabled: input.enabled !== undefined ? input.enabled : (existing?.enabled ?? true),
    createdAt: existing?.createdAt || now,
    updatedAt: now,
  };

  state.categories.set(record.id, record);
  writeJsonFile("categories.json", Array.from(state.categories.values()));

  const mongo = await getMongoDb();
  if (mongo) {
    try {
      await mongo
        .collection("categories")
        .replaceOne({ id: record.id }, { ...record }, { upsert: true });
    } catch {}
  }

  return record;
}

export async function deleteCategory(id: string): Promise<boolean> {
  await ensureDatabaseInitialized();

  const deleted = state.categories.delete(id);
  if (deleted) {
    writeJsonFile("categories.json", Array.from(state.categories.values()));
  }

  const mongo = await getMongoDb();
  if (mongo) {
    try {
      await mongo.collection("categories").deleteOne({ id });
    } catch {}
  }

  return deleted;
}

export async function getAdminByEmail(email: string): Promise<AdminUserRecord | null> {
  await ensureDatabaseInitialized();

  const normalized = email.toLowerCase().trim();
  const mongo = await getMongoDb();
  if (mongo) {
    try {
      const item = await mongo
        .collection<AdminUserRecord>("admins")
        .findOne({ email: normalized }, { projection: { _id: 0 } });
      if (item) return item;
    } catch {}
  }

  return state.admins.get(normalized) || null;
}

export async function saveAdminUser(admin: AdminUserRecord): Promise<AdminUserRecord> {
  await ensureDatabaseInitialized();

  state.admins.set(admin.email.toLowerCase().trim(), admin);
  writeJsonFile("admins.json", Array.from(state.admins.values()));

  const mongo = await getMongoDb();
  if (mongo) {
    try {
      await mongo
        .collection("admins")
        .replaceOne({ email: admin.email.toLowerCase().trim() }, { ...admin }, { upsert: true });
    } catch {}
  }

  return admin;
}

export async function logActivity(entry: Omit<ActivityRecord, "id" | "createdAt">): Promise<ActivityRecord> {
  const record: ActivityRecord = {
    id: `act_${Date.now()}_${crypto.randomBytes(4).toString("hex")}`,
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

  const mongo = await getMongoDb();
  if (mongo) {
    try {
      await mongo.collection("activities").insertOne({ ...record });
    } catch {}
  }

  return record;
}

export async function getActivities(limit = 50): Promise<ActivityRecord[]> {
  await ensureDatabaseInitialized();

  const mongo = await getMongoDb();
  if (mongo) {
    try {
      const list = await mongo
        .collection<ActivityRecord>("activities")
        .find({}, { projection: { _id: 0 } })
        .sort({ createdAt: -1 })
        .limit(limit)
        .toArray();
      return list;
    } catch {}
  }

  return state.activities.slice(0, limit);
}

export async function getDashboardStats() {
  await ensureDatabaseInitialized();

  const mongo = await getMongoDb();
  if (mongo) {
    try {
      const totalProducts = await mongo.collection("products").countDocuments();
      const publishedProducts = await mongo.collection("products").countDocuments({ status: "published" });
      const draftProducts = await mongo.collection("products").countDocuments({ status: "draft" });
      const archivedProducts = await mongo.collection("products").countDocuments({ status: "archived" });
      const totalCategories = await mongo.collection("categories").countDocuments({ enabled: true });
      const totalEnquiries = await mongo.collection("leads").countDocuments();
      const newEnquiries = await mongo.collection("leads").countDocuments({ status: "new" });
      const totalCustomers = await mongo.collection("customers").countDocuments();

      return {
        totalProducts,
        publishedProducts,
        draftProducts,
        archivedProducts,
        totalCategories,
        totalEnquiries,
        newEnquiries,
        totalCustomers,
      };
    } catch {}
  }

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
  const totalCustomers = state.customers.size;

  return {
    totalProducts,
    publishedProducts,
    draftProducts,
    archivedProducts,
    totalCategories,
    totalEnquiries,
    newEnquiries,
    totalCustomers,
  };
}

export async function getCustomers(filter?: CustomerFilter): Promise<CustomerStoryRecord[]> {
  await ensureDatabaseInitialized();

  const mongo = await getMongoDb();
  if (mongo) {
    try {
      const query: Record<string, any> = {};
      if (filter?.featuredOnly) {
        query.featured = true;
      }
      if (filter?.search) {
        const term = filter.search.trim();
        query.$or = [
          { name: { $regex: term, $options: "i" } },
          { nameHi: { $regex: term, $options: "i" } },
          { location: { $regex: term, $options: "i" } },
          { vehicleName: { $regex: term, $options: "i" } },
          { quote: { $regex: term, $options: "i" } },
        ];
      }
      const list = await mongo
        .collection<CustomerStoryRecord>("customers")
        .find(query, { projection: { _id: 0 } })
        .sort({ displayOrder: 1, createdAt: -1 })
        .toArray();
      return list;
    } catch {}
  }

  let list = Array.from(state.customers.values());
  if (filter?.featuredOnly) {
    list = list.filter((c) => c.featured);
  }
  if (filter?.search) {
    const term = filter.search.toLowerCase().trim();
    list = list.filter(
      (c) =>
        c.name.toLowerCase().includes(term) ||
        (c.nameHi && c.nameHi.toLowerCase().includes(term)) ||
        c.location.toLowerCase().includes(term) ||
        c.vehicleName.toLowerCase().includes(term) ||
        c.quote.toLowerCase().includes(term)
    );
  }

  return list.sort((a, b) => a.displayOrder - b.displayOrder);
}

export async function getCustomerById(id: string): Promise<CustomerStoryRecord | null> {
  await ensureDatabaseInitialized();

  const mongo = await getMongoDb();
  if (mongo) {
    try {
      const cust = await mongo
        .collection<CustomerStoryRecord>("customers")
        .findOne({ id }, { projection: { _id: 0 } });
      if (cust) return cust;
    } catch {}
  }

  return state.customers.get(id) || null;
}

export async function createCustomer(
  data: Omit<CustomerStoryRecord, "id" | "createdAt" | "updatedAt">,
  adminEmail: string
): Promise<CustomerStoryRecord> {
  await ensureDatabaseInitialized();

  const now = new Date().toISOString();
  const id = `cust_${Date.now()}_${crypto.randomBytes(3).toString("hex")}`;
  const record: CustomerStoryRecord = {
    ...data,
    id,
    createdAt: now,
    updatedAt: now,
  };

  state.customers.set(id, record);
  writeJsonFile("customers.json", Array.from(state.customers.values()));

  const mongo = await getMongoDb();
  if (mongo) {
    try {
      await mongo.collection("customers").insertOne({ ...record });
    } catch {}
  }

  await logActivity({
    adminEmail,
    action: "create",
    entityType: "customer",
    entityId: id,
    details: `Added customer delivery story: ${record.name} (${record.vehicleName})`,
  });

  return record;
}

export async function updateCustomer(
  id: string,
  data: Partial<CustomerStoryRecord>,
  adminEmail: string
): Promise<CustomerStoryRecord | null> {
  await ensureDatabaseInitialized();

  const existing = await getCustomerById(id);
  if (!existing) return null;

  const now = new Date().toISOString();
  const updated: CustomerStoryRecord = {
    ...existing,
    ...data,
    id,
    updatedAt: now,
  };

  state.customers.set(id, updated);
  writeJsonFile("customers.json", Array.from(state.customers.values()));

  const mongo = await getMongoDb();
  if (mongo) {
    try {
      await mongo.collection("customers").updateOne({ id }, { $set: updated });
    } catch {}
  }

  await logActivity({
    adminEmail,
    action: "update",
    entityType: "customer",
    entityId: id,
    details: `Updated customer delivery story: ${updated.name}`,
  });

  return updated;
}

export async function deleteCustomer(id: string, adminEmail: string): Promise<boolean> {
  await ensureDatabaseInitialized();

  const existing = await getCustomerById(id);
  if (!existing) return false;

  state.customers.delete(id);
  writeJsonFile("customers.json", Array.from(state.customers.values()));

  const mongo = await getMongoDb();
  if (mongo) {
    try {
      await mongo.collection("customers").deleteOne({ id });
    } catch {}
  }

  await logActivity({
    adminEmail,
    action: "delete",
    entityType: "customer",
    entityId: id,
    details: `Deleted customer delivery story: ${existing.name}`,
  });

  return true;
}