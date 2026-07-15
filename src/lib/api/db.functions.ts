import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

// Zod schemas for validation
const profileInput = z.object({
  id: z.string().min(1),
  email: z.string().nullable().optional(),
  display_name: z.string().nullable().optional(),
  avatar_url: z.string().nullable().optional(),
});

const adminRoleInput = z.object({
  userId: z.string().min(1),
});

const addRoleInput = z.object({
  targetUserIdOrEmail: z.string().min(1),
  role: z.enum(["admin", "super_admin"]),
});

const removeRoleInput = z.object({
  roleId: z.string().min(1),
});

// Zod schemas for Store/Toko
const productInput = z.object({
  name: z.string().min(1),
  price: z.number().int().min(0),
  coin: z.number().int().min(0).default(0),
  description: z.string().nullable().optional(),
  admin_id: z.string().nullable().optional(),
  image_url: z.string().nullable().optional(),
});

const updateProductInput = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  price: z.number().int().min(0),
  coin: z.number().int().min(0).default(0),
  description: z.string().nullable().optional(),
  admin_id: z.string().nullable().optional(),
  image_url: z.string().nullable().optional(),
});

const buyProductInput = z.object({
  userId: z.string().min(1),
  productId: z.string().min(1),
});

// Zod schemas for User Plants
const userPlantsInput = z.object({
  userId: z.string().min(1),
});

const addPlantInput = z.object({
  userId: z.string().min(1),
  name: z.string().min(1),
  status: z.string().default("Sehat"),
  days: z.number().int().min(1).default(1),
  imageUrl: z.string().nullable().optional(),
  plantedAt: z.string().min(1),
});

const deletePlantInput = z.object({
  id: z.string().min(1),
  userId: z.string().min(1),
});

// Zod schemas for Tasks/Schedules
const userTasksInput = z.object({
  userId: z.string().min(1),
});

const toggleTaskInput = z.object({
  taskId: z.string().min(1),
  userId: z.string().min(1),
  isDone: z.boolean(),
});

// Zod schemas for AI Scan
const scanInput = z.object({
  userId: z.string().min(1),
  disease: z.string().min(1),
  confidence: z.number(),
  summary: z.string(),
  steps: z.array(z.string()),
  plantId: z.string().nullable().optional(),
});

const analyzeLeafInput = z.object({
  userId: z.string().min(1),
  image: z.string().min(1),
  plantId: z.string().nullable().optional(),
});

const addPlantSuggestionInput = z.object({
  userId: z.string().min(1),
  suggestedPlant: z.string().min(1),
  suggestionText: z.string().nullable().optional(),
});

const deletePlantSuggestionInput = z.object({
  id: z.string().min(1),
});

// ==========================================
// 1. PROFILES & ROLES FUNCTIONS
// ==========================================

export const getOrCreateProfile = createServerFn({ method: "POST" })
  .inputValidator(profileInput)
  .handler(async ({ data }) => {
    const { getDbPool } = await import("../db.server");
    const pool = getDbPool();

    // Check if profile exists
    const [rows] = await pool.execute(
      "SELECT id, display_name, email, avatar_url, coins, streak, level, xp, password_hash, created_at, updated_at, shop_description, shop_address, shop_whatsapp, shop_latitude, shop_longitude, shop_active, shop_desa, shop_kecamatan, shop_kabupaten, user_desa, user_kecamatan, user_kabupaten, user_latitude, user_longitude FROM profiles WHERE id = ?",
      [data.id],
    );

    const profiles = rows as any[];
    if (profiles.length > 0) {
      return profiles[0];
    }

    // If ID doesn't exist, check if email exists (registered locally)
    if (data.email) {
      const [emailRows] = await pool.execute(
        "SELECT id, display_name, email, avatar_url, coins, streak, level, xp, password_hash, created_at, shop_active FROM profiles WHERE email = ?",
        [data.email],
      );
      const emailProfiles = emailRows as any[];
      if (emailProfiles.length > 0) {
        const oldId = emailProfiles[0].id;
        const newId = data.id;

        // Cascade update the user ID in all tables using SET FOREIGN_KEY_CHECKS = 0
        await pool.execute("SET FOREIGN_KEY_CHECKS = 0");
        await pool.execute("UPDATE profiles SET id = ? WHERE id = ?", [newId, oldId]);
        await pool.execute("UPDATE user_plants SET user_id = ? WHERE user_id = ?", [newId, oldId]);
        await pool.execute("UPDATE user_tasks SET user_id = ? WHERE user_id = ?", [newId, oldId]);
        await pool.execute("UPDATE scan_history SET user_id = ? WHERE user_id = ?", [newId, oldId]);
        await pool.execute("UPDATE user_roles SET user_id = ? WHERE user_id = ?", [newId, oldId]);
        await pool.execute("SET FOREIGN_KEY_CHECKS = 1");

        // Keep local data, but update with any new profile details from Google if available
        const displayName =
          emailProfiles[0].display_name || data.display_name || data.email.split("@")[0];
        const avatarUrl = data.avatar_url || emailProfiles[0].avatar_url;
        await pool.execute("UPDATE profiles SET display_name = ?, avatar_url = ? WHERE id = ?", [
          displayName,
          avatarUrl,
          newId,
        ]);

        const [updatedRows] = await pool.execute(
          "SELECT id, display_name, email, avatar_url, coins, streak, level, xp, password_hash, created_at, updated_at, shop_description, shop_address, shop_whatsapp, shop_latitude, shop_longitude, shop_active, shop_desa, shop_kecamatan, shop_kabupaten, user_desa, user_kecamatan, user_kabupaten, user_latitude, user_longitude FROM profiles WHERE id = ?",
          [newId],
        );
        return (updatedRows as any[])[0];
      }
    }

    // Insert new profile (coins: 120, streak: 3, level: 1 as per default design)
    const displayName = data.display_name || data.email?.split("@")[0] || "Petani Urban";
    const avatarUrl = data.avatar_url || null;

    await pool.execute(
      "INSERT INTO profiles (id, display_name, email, avatar_url, coins, streak, level, xp) VALUES (?, ?, ?, ?, 0, 0, 1, 0)",
      [data.id, displayName, data.email || null, avatarUrl],
    );

    // Insert default 'user' role
    await pool.execute("INSERT INTO user_roles (id, user_id, role) VALUES (UUID(), ?, 'user')", [
      data.id,
    ]);

    return {
      id: data.id,
      display_name: displayName,
      avatar_url: avatarUrl,
      coins: 0,
      streak: 0,
      level: 1,
      xp: 0,
      shop_description: null,
      shop_address: null,
      shop_whatsapp: null,
      shop_latitude: null,
      shop_longitude: null,
      shop_active: 1,
      shop_desa: null,
      shop_kecamatan: null,
      shop_kabupaten: null,
      user_desa: null,
      user_kecamatan: null,
      user_kabupaten: null,
      user_latitude: null,
      user_longitude: null,
      password_hash: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
  });

export const getAdminRoles = createServerFn({ method: "GET" })
  .inputValidator(adminRoleInput)
  .handler(async ({ data }) => {
    const { getDbPool } = await import("../db.server");
    const pool = getDbPool();

    const [rows] = await pool.execute("SELECT role FROM user_roles WHERE user_id = ?", [
      data.userId,
    ]);

    return (rows as any[]).map((r) => r.role);
  });

export const addAdminRole = createServerFn({ method: "POST" })
  .inputValidator(addRoleInput)
  .handler(async ({ data }) => {
    const { getDbPool } = await import("../db.server");
    const { supabaseAdmin } = await import("../../integrations/supabase/client.server");
    const pool = getDbPool();
    const input = data.targetUserIdOrEmail.trim();

    let targetUserId = "";

    if (input.includes("@")) {
      // It's an email!
      // 1. Search in local MySQL profiles
      const [localRows] = await pool.execute("SELECT id FROM profiles WHERE email = ?", [input]);
      const localUsers = localRows as any[];
      if (localUsers.length > 0) {
        targetUserId = localUsers[0].id;
      } else {
        try {
          const {
            data: { users },
            error: authError,
          } = await supabaseAdmin.auth.admin.listUsers();
          if (authError) throw authError;
          const user = users.find((u) => u.email?.toLowerCase() === input.toLowerCase());
          if (!user) {
            throw new Error("Email tidak terdaftar di sistem");
          }
          targetUserId = user.id;

          // Create a profile in local MySQL
          const displayName =
            user.user_metadata?.full_name || user.user_metadata?.name || input.split("@")[0];
          await pool.execute(
            "INSERT INTO profiles (id, display_name, email, avatar_url, coins, streak, level, xp) VALUES (?, ?, ?, NULL, 0, 0, 1, 0)",
            [targetUserId, displayName, input],
          );
        } catch (err: any) {
          throw new Error(err.message || "Gagal mencari pengguna berdasarkan email");
        }
      }
    } else {
      // It's a User ID
      targetUserId = input;
      // Ensure profile exists first (to satisfy Foreign Key or display name joining)
      const [profileRows] = await pool.execute("SELECT id FROM profiles WHERE id = ?", [
        targetUserId,
      ]);
      if ((profileRows as any[]).length === 0) {
        await pool.execute(
          "INSERT INTO profiles (id, display_name, avatar_url, coins, streak, level, xp) VALUES (?, ?, NULL, 0, 0, 1, 0)",
          [targetUserId, `User ${targetUserId.slice(0, 8)}`],
        );
      }
    }

    // Hapus role lama untuk user ini agar tidak terjadi duplikasi role (seperti user, admin, super_admin sekaligus)
    await pool.execute("DELETE FROM user_roles WHERE user_id = ?", [targetUserId]);

    // Insert role baru
    await pool.execute("INSERT INTO user_roles (id, user_id, role) VALUES (UUID(), ?, ?)", [
      targetUserId,
      data.role,
    ]);

    return { success: true };
  });

export const removeAdminRole = createServerFn({ method: "POST" })
  .inputValidator(removeRoleInput)
  .handler(async ({ data }) => {
    const { getDbPool } = await import("../db.server");
    const pool = getDbPool();

    await pool.execute("UPDATE user_roles SET role = 'user' WHERE id = ?", [data.roleId]);

    return { success: true };
  });

export const getAdminStats = createServerFn({ method: "GET" }).handler(async () => {
  const { getDbPool } = await import("../db.server");
  const pool = getDbPool();

  const [profilesRows] = await pool.execute("SELECT coins, streak FROM profiles");
  const [rolesRows] = await pool.execute("SELECT role FROM user_roles");
  const [plantsRows] = await pool.execute("SELECT COUNT(*) as count FROM user_plants");
  const [productsRows] = await pool.execute("SELECT COUNT(*) as count FROM products");

  const profiles = profilesRows as any[];
  const roles = rolesRows as any[];
  const totalPlants = (plantsRows as any[])[0]?.count ?? 0;
  const totalProducts = (productsRows as any[])[0]?.count ?? 0;

  const users = profiles.length;
  const totalCoins = profiles.reduce((sum, p) => sum + (p.coins || 0), 0);
  const totalStreak = profiles.reduce((sum, p) => sum + (p.streak || 0), 0);
  const avgStreak = users ? Math.round((totalStreak / users) * 10) / 10 : 0;

  const admins = roles.filter((r) => r.role === "admin").length;
  const superAdmins = roles.filter((r) => r.role === "super_admin").length;

  return { users, admins, superAdmins, totalCoins, avgStreak, totalPlants, totalProducts };
});

export const getAdminProfiles = createServerFn({ method: "GET" }).handler(async () => {
  const { getDbPool } = await import("../db.server");
  const pool = getDbPool();

  const [rows] = await pool.execute(
    `SELECT p.id, p.display_name, p.email, p.avatar_url, p.coins, p.streak, p.level, p.xp, p.created_at, ur.role 
       FROM profiles p
       LEFT JOIN user_roles ur ON p.id = ur.user_id
       ORDER BY p.created_at DESC`,
  );

  return rows;
});

export const getAdminRolesList = createServerFn({ method: "GET" }).handler(async () => {
  const { getDbPool } = await import("../db.server");
  const pool = getDbPool();

  const [rows] = await pool.execute(
    `SELECT ur.id, ur.user_id, ur.role, ur.created_at, p.display_name 
       FROM user_roles ur 
       LEFT JOIN profiles p ON ur.user_id = p.id 
       WHERE ur.role IN ('admin', 'super_admin') 
       ORDER BY ur.created_at DESC`,
  );

  return rows;
});

// ==========================================
// 2. TOKO / PRODUCTS FUNCTIONS
// ==========================================

export const getProducts = createServerFn({ method: "GET" }).handler(async () => {
  const { getDbPool } = await import("../db.server");
  const pool = getDbPool();

  const [rows] = await pool.execute(
    `SELECT pr.id, pr.name, pr.price, pr.coin, pr.image_url, pr.description, pr.created_at, pr.admin_id, 
              p.display_name AS shop_name, p.shop_description, p.shop_address, p.shop_whatsapp, p.shop_latitude, p.shop_longitude,
              p.shop_active
       FROM products pr
       LEFT JOIN profiles p ON pr.admin_id = p.id
       WHERE p.id IS NULL OR p.shop_active != 0 OR p.shop_active IS NULL
       ORDER BY pr.name ASC`,
  );

  return rows;
});

export const getProductById = createServerFn({ method: "GET" })
  .inputValidator(z.object({ id: z.string().min(1) }))
  .handler(async ({ data }) => {
    const { getDbPool } = await import("../db.server");
    const pool = getDbPool();

    const [rows] = await pool.execute(
      `SELECT pr.id, pr.name, pr.price, pr.coin, pr.image_url, pr.description, pr.created_at, pr.admin_id, 
              p.display_name AS shop_name, p.shop_description, p.shop_address, p.shop_whatsapp, p.shop_latitude, p.shop_longitude,
              p.shop_active
       FROM products pr
       LEFT JOIN profiles p ON pr.admin_id = p.id
       WHERE pr.id = ?`,
      [data.id]
    );

    const products = rows as any[];
    if (products.length === 0) return null;
    return products[0];
  });

export const addProduct = createServerFn({ method: "POST" })
  .inputValidator(productInput)
  .handler(async ({ data }) => {
    const { getDbPool } = await import("../db.server");
    const pool = getDbPool();

    await pool.execute(
      "INSERT INTO products (id, name, price, coin, description, admin_id, image_url) VALUES (UUID(), ?, ?, ?, ?, ?, ?)",
      [data.name, data.price, data.coin, data.description || null, data.admin_id || null, data.image_url || null],
    );

    return { success: true };
  });

export const updateProduct = createServerFn({ method: "POST" })
  .inputValidator(updateProductInput)
  .handler(async ({ data }) => {
    const { getDbPool } = await import("../db.server");
    const pool = getDbPool();

    await pool.execute(
      "UPDATE products SET name = ?, price = ?, coin = ?, description = ?, admin_id = ?, image_url = ? WHERE id = ?",
      [data.name, data.price, data.coin, data.description || null, data.admin_id || null, data.image_url || null, data.id],
    );

    return { success: true };
  });

export const deleteProduct = createServerFn({ method: "POST" })
  .inputValidator(z.object({ id: z.string().min(1) }))
  .handler(async ({ data }) => {
    const { getDbPool } = await import("../db.server");
    const pool = getDbPool();

    await pool.execute("DELETE FROM products WHERE id = ?", [data.id]);

    return { success: true };
  });

export const buyProduct = createServerFn({ method: "POST" })
  .inputValidator(buyProductInput)
  .handler(async ({ data }) => {
    const { getDbPool } = await import("../db.server");
    const pool = getDbPool();

    // Fetch product details
    const [pRows] = await pool.execute("SELECT name, coin FROM products WHERE id = ?", [
      data.productId,
    ]);
    const products = pRows as any[];
    if (products.length === 0) {
      throw new Error("Produk tidak ditemukan");
    }
    const product = products[0];

    return { success: true, updatedCoins: 0, productName: product.name, addedCoins: 0 };
  });

// ==========================================
// 3. USER PLANTS FUNCTIONS
// ==========================================

export const getUserPlants = createServerFn({ method: "GET" })
  .inputValidator(userPlantsInput)
  .handler(async ({ data }) => {
    const { getDbPool } = await import("../db.server");
    const pool = getDbPool();

    const [rows] = await pool.execute(
      "SELECT id, name, status, days, image_url, created_at, planted_at FROM user_plants WHERE user_id = ? ORDER BY created_at ASC",
      [data.userId],
    );

    const plants = rows as any[];
    for (const plant of plants) {
      if (plant.status === "Sakit") {
        const [taskCountRows] = await pool.execute(
          "SELECT COUNT(*) as count FROM user_tasks WHERE plant_id = ? AND curative = 1 AND is_done = 0",
          [plant.id]
        );
        const count = (taskCountRows as any[])[0].count;
        if (count === 0) {
          await pool.execute(
            "UPDATE user_plants SET status = 'Sehat' WHERE id = ?",
            [plant.id]
          );
          plant.status = "Sehat";
        }
      }
    }

    return plants;
  });

export const addUserPlant = createServerFn({ method: "POST" })
  .inputValidator(addPlantInput)
  .handler(async ({ data }) => {
    const { getDbPool } = await import("../db.server");
    const pool = getDbPool();

    await pool.execute(
      "INSERT INTO user_plants (id, user_id, name, status, days, image_url, planted_at) VALUES (UUID(), ?, ?, ?, ?, ?, ?)",
      [data.userId, data.name, data.status, data.days, data.imageUrl || null, data.plantedAt],
    );

    return { success: true };
  });

const uploadPhotoInput = z.object({
  base64Data: z.string(),
  fileName: z.string(),
});

export const uploadPlantPhoto = createServerFn({ method: "POST" })
  .inputValidator(uploadPhotoInput)
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("../../integrations/supabase/client.server");

    // Ensure bucket exists
    try {
      await supabaseAdmin.storage.createBucket("plant-photos", {
        public: true,
      });
    } catch (e) {
      // Bucket might already exist, ignore error
    }

    // Convert base64 data to buffer
    const base64Clean = data.base64Data.replace(/^data:image\/\w+;base64,/, "");
    const buffer = Buffer.from(base64Clean, "base64");

    // Extract file extension and generate unique name
    const fileExt = data.fileName.split(".").pop() || "jpg";
    const filePath = `plant_${Date.now()}_${Math.floor(Math.random() * 1000)}.${fileExt}`;

    // Upload to Supabase Storage
    const { error: uploadError } = await supabaseAdmin.storage
      .from("plant-photos")
      .upload(filePath, buffer, {
        contentType: `image/${fileExt}`,
        duplex: "half",
      });

    if (uploadError) {
      throw new Error(`Gagal mengunggah foto ke storage: ${uploadError.message}`);
    }

    // Get public URL
    const { data: urlData } = supabaseAdmin.storage.from("plant-photos").getPublicUrl(filePath);

    return { url: urlData.publicUrl };
  });

export const uploadProductPhoto = createServerFn({ method: "POST" })
  .inputValidator(uploadPhotoInput)
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("../../integrations/supabase/client.server");

    // Ensure bucket exists
    try {
      await supabaseAdmin.storage.createBucket("product-photos", {
        public: true,
      });
    } catch (e) {
      // Bucket might already exist, ignore error
    }

    // Convert base64 data to buffer
    const base64Clean = data.base64Data.replace(/^data:image\/\w+;base64,/, "");
    const buffer = Buffer.from(base64Clean, "base64");

    // Extract file extension and generate unique name
    const fileExt = data.fileName.split(".").pop() || "jpg";
    const filePath = `product_${Date.now()}_${Math.floor(Math.random() * 1000)}.${fileExt}`;

    // Upload to Supabase Storage
    const { error: uploadError } = await supabaseAdmin.storage
      .from("product-photos")
      .upload(filePath, buffer, {
        contentType: `image/${fileExt}`,
        duplex: "half",
      });

    if (uploadError) {
      throw new Error(`Gagal mengunggah foto ke storage: ${uploadError.message}`);
    }

    // Get public URL
    const { data: urlData } = supabaseAdmin.storage.from("product-photos").getPublicUrl(filePath);

    return { url: urlData.publicUrl };
  });

export const deleteProductPhoto = createServerFn({ method: "POST" })
  .inputValidator(z.object({ imageUrl: z.string().min(1) }))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("../../integrations/supabase/client.server");
    try {
      const decodedUrl = decodeURIComponent(data.imageUrl);
      const cleanUrl = decodedUrl.split("?")[0];
      const parts = cleanUrl.split("/product-photos/");
      const filePath = parts[parts.length - 1];

      if (filePath) {
        await supabaseAdmin.storage.from("product-photos").remove([filePath]);
      }
    } catch (err: any) {
      console.error("Gagal menghapus file dari Storage:", err.message);
    }
    return { success: true };
  });

const updatePlantImageInput = z.object({
  plantId: z.string().min(1),
  userId: z.string().min(1),
  imageUrl: z.string().min(1),
});

const deletePhotoInput = z.object({
  imageUrl: z.string().min(1),
});

async function deleteFileByUrl(imageUrl: string) {
  const { supabaseAdmin } = await import("../../integrations/supabase/client.server");
  try {
    const decodedUrl = decodeURIComponent(imageUrl);
    const cleanUrl = decodedUrl.split("?")[0];
    const parts = cleanUrl.split("/plant-photos/");
    const filePath = parts[parts.length - 1];

    if (filePath) {
      const { data, error } = await supabaseAdmin.storage.from("plant-photos").remove([filePath]);

      if (error) {
        console.error(`Gagal menghapus file ${filePath} dari Storage:`, error.message);
      } else {
        console.log(`Berhasil menghapus file ${filePath} dari Storage:`, data);
      }
    }
  } catch (err: any) {
    console.error("Gagal menjalankan fungsi deleteFileByUrl:", err.message);
  }
}

export const deletePlantPhoto = createServerFn({ method: "POST" })
  .inputValidator(deletePhotoInput)
  .handler(async ({ data }) => {
    await deleteFileByUrl(data.imageUrl);
    return { success: true };
  });

export const updatePlantImage = createServerFn({ method: "POST" })
  .inputValidator(updatePlantImageInput)
  .handler(async ({ data }) => {
    const { getDbPool } = await import("../db.server");
    const pool = getDbPool();

    // 1. Get current image_url to delete old photo file
    const [rows] = await pool.execute(
      "SELECT image_url FROM user_plants WHERE id = ? AND user_id = ?",
      [data.plantId, data.userId],
    );
    const plants = rows as any[];
    if (plants.length > 0 && plants[0].image_url) {
      await deleteFileByUrl(plants[0].image_url);
    }

    // 2. Update to new image_url
    await pool.execute("UPDATE user_plants SET image_url = ? WHERE id = ? AND user_id = ?", [
      data.imageUrl,
      data.plantId,
      data.userId,
    ]);

    return { success: true };
  });

const updatePlantPlantedAtInput = z.object({
  plantId: z.string().min(1),
  userId: z.string().min(1),
  plantedAt: z.string().min(1),
});

export const updatePlantPlantedAt = createServerFn({ method: "POST" })
  .inputValidator(updatePlantPlantedAtInput)
  .handler(async ({ data }) => {
    const { getDbPool } = await import("../db.server");
    const pool = getDbPool();

    await pool.execute("UPDATE user_plants SET planted_at = ? WHERE id = ? AND user_id = ?", [
      data.plantedAt,
      data.plantId,
      data.userId,
    ]);

    return { success: true };
  });

export const deleteUserPlant = createServerFn({ method: "POST" })
  .inputValidator(deletePlantInput)
  .handler(async ({ data }) => {
    const { getDbPool } = await import("../db.server");
    const pool = getDbPool();

    // 1. Get current image_url to delete photo file
    const [rows] = await pool.execute(
      "SELECT image_url FROM user_plants WHERE id = ? AND user_id = ?",
      [data.id, data.userId],
    );
    const plants = rows as any[];
    if (plants.length > 0 && plants[0].image_url) {
      await deleteFileByUrl(plants[0].image_url);
    }

    // 2. Delete plant row (MySQL ON DELETE CASCADE foreign key handles tasks/suggestions deletion)
    await pool.execute("DELETE FROM user_plants WHERE id = ? AND user_id = ?", [
      data.id,
      data.userId,
    ]);

    return { success: true };
  });

// ==========================================
// 4. USER TASKS / SCHEDULE FUNCTIONS
// ==========================================

export const getUserTasks = createServerFn({ method: "GET" })
  .inputValidator(userTasksInput)
  .handler(async ({ data }) => {
    const { getDbPool } = await import("../db.server");
    const pool = getDbPool();

    const [rows] = await pool.execute(
      "SELECT id, time, title, type, curative, is_done, plant_id, created_at FROM user_tasks WHERE user_id = ? ORDER BY time ASC",
      [data.userId],
    );

    const tasks = rows as any[];
    const activeTasks = [];
    const today = new Date();

    const getDaysDifference = (date1: Date, date2: Date) => {
      const d1 = new Date(date1.getFullYear(), date1.getMonth(), date1.getDate());
      const d2 = new Date(date2.getFullYear(), date2.getMonth(), date2.getDate());
      return Math.floor((d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24));
    };

    for (const task of tasks) {
      if (!task.curative) {
        activeTasks.push(task);
        continue;
      }

      const createdDate = new Date(task.created_at);
      const diffDays = getDaysDifference(createdDate, today) + 1;

      const match = task.title.match(/\(Hari ke-(\d+)\/(\d+)\)/);
      let targetDay = 1;

      if (match) {
        targetDay = parseInt(match[1], 10);
      }

      if (diffDays === targetDay) {
        activeTasks.push(task);
      } else if (diffDays > targetDay) {
        // Automatically delete the curative task from the database when it belongs to a past day
        await pool.execute("DELETE FROM user_tasks WHERE id = ?", [task.id]);
      } else {
        // Future task: Keep in DB but do not return to client for today
      }
    }

    // Automatically check and reset plant status to "Sehat" if all curative tasks for that plant are completed or empty
    const [userPlantsRows] = await pool.execute(
      "SELECT id, status FROM user_plants WHERE user_id = ?",
      [data.userId]
    );
    const userPlants = userPlantsRows as any[];

    for (const plant of userPlants) {
      if (plant.status === "Sakit") {
        const [taskCountRows] = await pool.execute(
          "SELECT COUNT(*) as count FROM user_tasks WHERE plant_id = ? AND curative = 1 AND is_done = 0",
          [plant.id]
        );
        const count = (taskCountRows as any[])[0].count;

        if (count === 0) {
          await pool.execute(
            "UPDATE user_plants SET status = 'Sehat' WHERE id = ?",
            [plant.id]
          );
        }
      }
    }

    return activeTasks;
  });

export const toggleTaskCompleted = createServerFn({ method: "POST" })
  .inputValidator(toggleTaskInput)
  .handler(async ({ data }) => {
    const { getDbPool } = await import("../db.server");
    const pool = getDbPool();

    // Check if task exists and its current state
    const [tRows] = await pool.execute(
      "SELECT is_done, plant_id, curative FROM user_tasks WHERE id = ? AND user_id = ?",
      [data.taskId, data.userId],
    );

    const tasks = tRows as any[];
    if (tasks.length === 0) {
      throw new Error("Tugas tidak ditemukan");
    }

    const requestedIsDone = data.isDone;

    // Update task completion
    await pool.execute("UPDATE user_tasks SET is_done = ? WHERE id = ? AND user_id = ?", [
      requestedIsDone ? 1 : 0,
      data.taskId,
      data.userId,
    ]);

    // Instantly update plant status to "Sehat" if all curative tasks for that plant are completed
    const tDetail = tasks[0];
    if (tDetail && tDetail.curative && tDetail.plant_id) {
      if (requestedIsDone) {
        const [uncompletedRows] = await pool.execute(
          "SELECT COUNT(*) as count FROM user_tasks WHERE plant_id = ? AND curative = 1 AND is_done = 0",
          [tDetail.plant_id]
        );
        const count = (uncompletedRows as any[])[0].count;
        if (count === 0) {
          await pool.execute(
            "UPDATE user_plants SET status = 'Sehat' WHERE id = ?",
            [tDetail.plant_id]
          );
        }
      } else {
        // If unmarked, set back to "Sakit"
        await pool.execute(
          "UPDATE user_plants SET status = 'Sakit' WHERE id = ?",
          [tDetail.plant_id]
        );
      }
    }

    return { success: true, updatedCoins: 0, coinAdjustment: 0 };
  });

// ==========================================
// 5. SCAN HISTORY FUNCTIONS
// ==========================================

export const saveScanResult = createServerFn({ method: "POST" })
  .inputValidator(scanInput)
  .handler(async ({ data }) => {
    const { getDbPool } = await import("../db.server");
    const pool = getDbPool();

    const serializedSteps = data.steps.join("\n");

    // 1. Save scan record
    await pool.execute(
      "INSERT INTO scan_history (id, user_id, image_url, disease, confidence, summary, steps) VALUES (UUID(), ?, NULL, ?, ?, ?, ?)",
      [data.userId, data.disease, data.confidence, data.summary, serializedSteps],
    );

    // 2. Automatically insert curative schedule tasks for this user from the AI steps
    for (const stepText of data.steps) {
      await pool.execute(
        `INSERT INTO user_tasks (id, user_id, plant_id, time, title, type, curative, is_done) 
         VALUES (UUID(), ?, ?, '08:30', ?, 'Perawatan', true, false)`,
        [data.userId, data.plantId || null, stepText],
      );
    }

    // 3. Update plant status to "Sakit" if plantId is provided
    if (data.plantId) {
      await pool.execute("UPDATE user_plants SET status = 'Sakit' WHERE id = ?", [data.plantId]);
    }

    return { success: true };
  });

export const analyzeLeafImage = createServerFn({ method: "POST" })
  .inputValidator(analyzeLeafInput)
  .handler(async ({ data }) => {
    const { getDbPool } = await import("../db.server");
    const pool = getDbPool();

    // 1. Get the plant name if plantId is provided
    let plantName = "";
    if (data.plantId) {
      const [rows] = await pool.execute(
        "SELECT name FROM user_plants WHERE id = ?",
        [data.plantId]
      );
      const plants = rows as any[];
      if (plants.length > 0) {
        plantName = plants[0].name;
      }
    }

    const [activeProductsRows] = await pool.execute(
      `SELECT pr.id, pr.name, pr.description, pr.price, pr.image_url, p.display_name AS shop_name,
              p.shop_address, p.shop_whatsapp, p.shop_latitude, p.shop_longitude
       FROM products pr
       JOIN profiles p ON pr.admin_id = p.id
       WHERE p.shop_active = 1`
    );
    const activeProducts = activeProductsRows as any[];
    
    const productListStr = activeProducts.map(p => 
      `- ID: ${p.id}\n  Nama: ${p.name}\n  Deskripsi: ${p.description || "Tidak ada deskripsi"}`
    ).join("\n\n");

    let productSectionPrompt = "";
    if (activeProducts.length > 0) {
      productSectionPrompt = `Berikut adalah daftar obat/pestisida/pupuk yang tersedia secara publik di toko aktif sistem kami:
${productListStr}

Rekomendasikan obat/pestisida/pupuk yang cocok dari daftar di atas untuk menyembuhkan penyakit yang dideteksi. Hanya rekomendasikan produk dari daftar di atas yang benar-benar cocok. Jika tidak ada obat yang cocok atau tidak ada obat dalam daftar, kosongkan properti "recommendedProducts" (kembalikan array kosong []).`;
    } else {
      productSectionPrompt = `Saat ini tidak ada obat/pestisida/pupuk yang tersedia di toko aktif kami. Properti "recommendedProducts" harus dikembalikan sebagai array kosong [].`;
    }

    // 2. Prepare the prompt focusing strictly on the selected plant's disease and curative schedule
    let plantContextPrompt = "";
    if (plantName) {
      plantContextPrompt = `Tanaman yang sedang dianalisis adalah "${plantName}".
Fokuslah secara eksklusif hanya pada penyakit yang dapat menyerang tanaman "${plantName}" pada gambar daun ini. Jangan menyarankan atau mengaitkan dengan penyakit tanaman lain.`;
    } else {
      plantContextPrompt = `Identifikasi terlebih dahulu jenis tanaman dari daun pada gambar ini, lalu fokuskan diagnosis pada penyakit yang menyerang tanaman tersebut.`;
    }

    const prompt = `Anda adalah seorang ahli pertanian senior dan pakar patologi tanaman (penyakit tanaman) yang sangat kompeten dan berpengalaman. Analisis gambar daun tanaman ini untuk mendeteksi penyakitnya secara sangat akurat berdasarkan pengetahuan ilmiah agrikultur yang sahih dan valid (anti-halusinasi).

${plantContextPrompt}

Tentukan langkah-langkah penyembuhan penyakit tersebut (tindakan kuratif) berupa jadwal perawatan rutin harian.
Aturan penjadwalan kuratif:
- Total durasi perawatan kuratif harus ditentukan (misal: 3 hari, 5 hari, atau 7 hari).
- Jadwal perawatan kuratif TIDAK boleh dijadwalkan setiap hari agar tidak mengganggu/merusak tanaman (misalnya: jadwalkan hanya di Hari ke-1, Hari ke-3, dan Hari ke-5). Jangan buat jadwal harian terus-menerus berturut-turut.
- Setiap judul tindakan (title) harus mencantumkan hari perawatan secara eksplisit, contoh:
  - "Semprot larutan fungisida (Hari ke-1/5)"
  - "Potong daun yang terinfeksi (Hari ke-1/3)"
  - "Beri pupuk tambahan (Hari ke-3/5)"
  - "Semprot larutan fungisida (Hari ke-5/5)"

${productSectionPrompt}

Kembalikan diagnosis dalam format JSON yang valid dengan struktur berikut:
{
  "disease": "Nama Penyakit (Bahasa Indonesia)",
  "confidence": 0.85,
  "summary": "Penjelasan singkat penyakit dan gejalanya di daun",
  "tasks": [
    {
      "title": "Judul tindakan kuratif spesifik (harus menyertakan hari perawatan secara eksplisit, misal: Hari ke-X/Y)",
      "time": "Waktu pengerjaan (format HH:MM, misal: '08:30')"
    }
  ],
  "recommendedProducts": [
    {
      "productId": "ID produk dari daftar di atas yang direkomendasikan",
      "reason": "Alasan singkat mengapa obat/pestisida/pupuk ini cocok untuk menyembuhkan penyakit tersebut"
    }
  ]
}`;

    // 3. Extract the base64 image data
    const match = data.image.match(/^data:([^;]+);base64,(.+)$/);
    const mimeType = match ? match[1] : "image/jpeg";
    const base64Data = match ? match[2] : data.image;

    // 4. Get Gemini API Key
    const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;
    
    if (!apiKey) {
      throw new Error("Gemini API Key is not configured.");
    }

    // 5. Call the Gemini API
    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
    
    const requestBody = {
      contents: [
        {
          parts: [
            { text: prompt },
            {
              inlineData: {
                mimeType: mimeType,
                data: base64Data,
              },
            },
          ],
        },
      ],
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "OBJECT",
          properties: {
            disease: { type: "STRING" },
            confidence: { type: "NUMBER" },
            summary: { type: "STRING" },
            tasks: {
              type: "ARRAY",
              items: {
                type: "OBJECT",
                properties: {
                  title: { type: "STRING" },
                  time: { type: "STRING" }
                },
                required: ["title", "time"]
              }
            },
            recommendedProducts: {
              type: "ARRAY",
              items: {
                type: "OBJECT",
                properties: {
                  productId: { type: "STRING" },
                  reason: { type: "STRING" }
                },
                required: ["productId", "reason"]
              }
            }
          },
          required: ["disease", "confidence", "summary", "tasks", "recommendedProducts"]
        }
      }
    };

    let geminiResult;
    try {
      const response = await fetch(geminiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Gemini API Error details:", errorText);
        throw new Error(`Gemini API returned status ${response.status}`);
      }

      const resJson = await response.json();
      const rawText = resJson.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!rawText) {
        throw new Error("Invalid response structure from Gemini API");
      }

      geminiResult = JSON.parse(rawText.trim());
    } catch (err: any) {
      console.error("Failed to run Gemini leaf analysis:", err);
      // Fallback in case of API failure or rate limit to allow local testing gracefully
      geminiResult = {
        disease: plantName ? `Penyakit Daun ${plantName}` : "Penyakit Bercak Daun",
        confidence: 0.9,
        summary: `Gagal menghubungi Gemini AI. Ini adalah diagnosis fallback untuk ${plantName || "kategori umum"}.`,
        tasks: [
          { title: "Semprot larutan perawatan (Hari ke-1/3)", time: "08:30" },
          { title: "Gunting daun berbercak (Hari ke-1/3)", time: "09:00" },
          { title: "Semprot larutan perawatan (Hari ke-3/3)", time: "08:30" }
        ],
        recommendedProducts: [
          {
            productId: "inj-p2",
            reason: "Fungisida Antracol sangat disarankan untuk mengatasi infeksi jamur atau bercak daun yang didiagnosis pada tanaman tomat."
          }
        ]
      };
    }

    // 6. Save steps variables
    const stepsArray = geminiResult.tasks.map((t: any) => t.title);
    const serializedSteps = stepsArray.join("\n");

    // 7. Insert the curative schedule tasks into the database
    for (const task of geminiResult.tasks) {
      const titleLower = task.title.toLowerCase();
      let taskType = "Umum";
      
      if (titleLower.includes("potong") || titleLower.includes("pangkas") || titleLower.includes("gunting")) {
        taskType = "Perawatan";
      } else if (titleLower.includes("siram") || titleLower.includes("air") || titleLower.includes("semprot") || titleLower.includes("cairan")) {
        taskType = "Air";
      } else if (titleLower.includes("cahaya") || titleLower.includes("jemur") || titleLower.includes("sinar") || titleLower.includes("matahari")) {
        taskType = "Cahaya";
      }

      await pool.execute(
        `INSERT INTO user_tasks (id, user_id, plant_id, time, title, type, curative, is_done) 
         VALUES (UUID(), ?, ?, ?, ?, ?, true, false)`,
        [data.userId, data.plantId || null, task.time, task.title, taskType]
      );
    }

    // 8. Update plant status to "Sakit" if plantId is provided
    if (data.plantId) {
      await pool.execute(
        "UPDATE user_plants SET status = 'Sakit' WHERE id = ?",
        [data.plantId]
      );
    }

    // 9. Resolve the full details of each recommended product from the database
    const recommendedProductDetails = [];
    if (Array.isArray(geminiResult.recommendedProducts)) {
      for (const rec of geminiResult.recommendedProducts) {
        const found = activeProducts.find(p => p.id === rec.productId);
        if (found) {
          let parsedImages = [];
          try {
            parsedImages = JSON.parse(found.image_url);
          } catch {}
          const imgUrl = Array.isArray(parsedImages) && parsedImages.length > 0 
            ? parsedImages[0] 
            : found.image_url || null;

          recommendedProductDetails.push({
            id: found.id,
            name: found.name,
            description: found.description,
            price: found.price,
            image_url: imgUrl,
            shop_name: found.shop_name,
            shop_address: found.shop_address,
            shop_whatsapp: found.shop_whatsapp,
            shop_latitude: found.shop_latitude,
            shop_longitude: found.shop_longitude,
            reason: rec.reason
          });
        }
      }
    }
 
    // Save scan result to history (after recommendedProductDetails are populated)
    await pool.execute(
      "INSERT INTO scan_history (id, user_id, image_url, disease, confidence, summary, steps, recommended_products) VALUES (UUID(), ?, ?, ?, ?, ?, ?, ?)",
      [
        data.userId,
        data.image,
        geminiResult.disease,
        geminiResult.confidence,
        geminiResult.summary,
        serializedSteps,
        JSON.stringify(recommendedProductDetails),
      ]
    );

    return {
      success: true,
      result: {
        disease: geminiResult.disease,
        confidence: geminiResult.confidence,
        summary: geminiResult.summary,
        steps: stepsArray,
        recommendedProducts: recommendedProductDetails,
      }
    };
  });

export const getScanHistory = createServerFn({ method: "GET" })
  .inputValidator(z.object({ userId: z.string().min(1) }))
  .handler(async ({ data }) => {
    const { getDbPool } = await import("../db.server");
    const pool = getDbPool();

    const [rows] = await pool.execute(
      "SELECT id, disease, confidence, summary, steps, image_url, recommended_products, created_at FROM scan_history WHERE user_id = ? ORDER BY created_at DESC",
      [data.userId],
    );

    return (rows as any[]).map((r) => ({
      ...r,
      steps: r.steps ? r.steps.split("\n") : [],
      recommendedProducts: r.recommended_products ? JSON.parse(r.recommended_products) : [],
    }));
  });

export const deleteScanHistory = createServerFn({ method: "POST" })
  .inputValidator(z.object({ id: z.string().min(1) }))
  .handler(async ({ data }) => {
    const { getDbPool } = await import("../db.server");
    const pool = getDbPool();
    await pool.execute("DELETE FROM scan_history WHERE id = ?", [data.id]);
    return { success: true };
  });

export const checkEmailExists = createServerFn({ method: "POST" })
  .inputValidator(z.object({ email: z.string().email() }))
  .handler(async ({ data }) => {
    const { getDbPool } = await import("../db.server");
    const { supabaseAdmin } = await import("../../integrations/supabase/client.server");
    const pool = getDbPool();

    // 1. Check local MySQL profiles
    const [rows] = await pool.execute("SELECT id, password_hash FROM profiles WHERE email = ?", [
      data.email,
    ]);
    const profiles = rows as any[];
    if (profiles.length > 0) {
      const hasPassword = !!profiles[0].password_hash;
      return {
        exists: true,
        type: (hasPassword ? "local" : "google") as "local" | "google",
      };
    }

    // 2. Check Supabase Auth
    try {
      const {
        data: { users },
      } = await supabaseAdmin.auth.admin.listUsers();
      const user = users.find((u) => u.email?.toLowerCase() === data.email.toLowerCase());
      if (user) {
        return { exists: true, type: "google" as const };
      }
    } catch {
      // Ignore error
    }

    return { exists: false, type: null };
  });

const registerInput = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  displayName: z.string().min(1),
});

export const registerLocal = createServerFn({ method: "POST" })
  .inputValidator(registerInput)
  .handler(async ({ data }) => {
    const { getDbPool } = await import("../db.server");
    const crypto = await import("node:crypto");
    const pool = getDbPool();

    // Check if email already exists
    const [existing] = await pool.execute(
      "SELECT id, password_hash FROM profiles WHERE email = ?",
      [data.email],
    );
    const existingUsers = existing as any[];
    if (existingUsers.length > 0) {
      const user = existingUsers[0];
      if (user.password_hash) {
        throw new Error("Email sudah terdaftar dengan kata sandi");
      }

      // Email exists but has no password (e.g. Google user linking a password)
      const salt = crypto.randomBytes(16).toString("hex");
      const hash = crypto.pbkdf2Sync(data.password, salt, 1000, 64, "sha512").toString("hex");
      const passwordHash = `${salt}:${hash}`;

      await pool.execute("UPDATE profiles SET password_hash = ?, display_name = ? WHERE id = ?", [
        passwordHash,
        data.displayName,
        user.id,
      ]);

      return {
        id: user.id,
        email: data.email,
        display_name: data.displayName,
      };
    }

    // Hash password
    const salt = crypto.randomBytes(16).toString("hex");
    const hash = crypto.pbkdf2Sync(data.password, salt, 1000, 64, "sha512").toString("hex");
    const passwordHash = `${salt}:${hash}`;

    // Generate random UUID
    const userId = crypto.randomUUID();

    // Insert profile
    await pool.execute(
      "INSERT INTO profiles (id, display_name, email, password_hash, coins, streak, level, xp) VALUES (?, ?, ?, ?, 0, 0, 1, 0)",
      [userId, data.displayName, data.email, passwordHash],
    );

    // Insert default 'user' role
    await pool.execute("INSERT INTO user_roles (id, user_id, role) VALUES (UUID(), ?, 'user')", [
      userId,
    ]);

    return {
      id: userId,
      email: data.email,
      display_name: data.displayName,
    };
  });

const loginInput = z.object({
  email: z.string().email(),
  password: z.string(),
});

export const loginLocal = createServerFn({ method: "POST" })
  .inputValidator(loginInput)
  .handler(async ({ data }) => {
    const { getDbPool } = await import("../db.server");
    const crypto = await import("node:crypto");
    const pool = getDbPool();

    // Fetch user
    const [rows] = await pool.execute(
      "SELECT id, email, display_name, password_hash FROM profiles WHERE email = ?",
      [data.email],
    );
    const users = rows as any[];
    if (users.length === 0) {
      throw new Error("Email tidak terdaftar");
    }

    const user = users[0];
    if (!user.password_hash) {
      throw new Error("Email ini terdaftar menggunakan Google. Silakan masuk dengan Google.");
    }

    // Verify password
    const [salt, storedHash] = user.password_hash.split(":");
    if (!salt || !storedHash) {
      throw new Error("Format kata sandi rusak");
    }

    const verifyHash = crypto.pbkdf2Sync(data.password, salt, 1000, 64, "sha512").toString("hex");
    if (verifyHash !== storedHash) {
      throw new Error("Kata sandi salah");
    }

    return {
      id: user.id,
      email: user.email,
      display_name: user.display_name,
    };
  });

const updateProfileInput = z.object({
  id: z.string().min(1),
  displayName: z.string().min(1),
  avatarUrl: z.string().nullable().optional(),
});

export const updateProfile = createServerFn({ method: "POST" })
  .inputValidator(updateProfileInput)
  .handler(async ({ data }) => {
    const { getDbPool } = await import("../db.server");
    const pool = getDbPool();

    await pool.execute(
      "UPDATE profiles SET display_name = ?, avatar_url = ?, updated_at = NOW() WHERE id = ?",
      [data.displayName, data.avatarUrl || null, data.id],
    );

    return { success: true };
  });

const updateUserProfileLocationInput = z.object({
  id: z.string().min(1),
  userDesa: z.string().nullable().optional(),
  userKecamatan: z.string().nullable().optional(),
  userKabupaten: z.string().nullable().optional(),
  userLatitude: z.number().nullable().optional(),
  userLongitude: z.number().nullable().optional(),
});

export const updateUserProfileLocation = createServerFn({ method: "POST" })
  .inputValidator(updateUserProfileLocationInput)
  .handler(async ({ data }) => {
    const { getDbPool } = await import("../db.server");
    const pool = getDbPool();

    await pool.execute(
      "UPDATE profiles SET user_desa = ?, user_kecamatan = ?, user_kabupaten = ?, user_latitude = ?, user_longitude = ?, updated_at = NOW() WHERE id = ?",
      [
        data.userDesa || null,
        data.userKecamatan || null,
        data.userKabupaten || null,
        data.userLatitude !== undefined ? data.userLatitude : null,
        data.userLongitude !== undefined ? data.userLongitude : null,
        data.id,
      ],
    );

    return { success: true };
  });

const updateShopProfileInput = z.object({
  id: z.string().min(1),
  displayName: z.string().min(1),
  shopDescription: z.string().nullable().optional(),
  shopAddress: z.string().nullable().optional(),
  shopWhatsapp: z.string().nullable().optional(),
  shopLatitude: z.number().nullable().optional(),
  shopLongitude: z.number().nullable().optional(),
  shopActive: z.boolean().optional(),
  shopDesa: z.string().nullable().optional(),
  shopKecamatan: z.string().nullable().optional(),
  shopKabupaten: z.string().nullable().optional(),
});

export const updateShopProfile = createServerFn({ method: "POST" })
  .inputValidator(updateShopProfileInput)
  .handler(async ({ data }) => {
    const { getDbPool } = await import("../db.server");
    const pool = getDbPool();

    await pool.execute(
      `UPDATE profiles 
       SET display_name = ?, shop_description = ?, shop_address = ?, shop_whatsapp = ?, shop_latitude = ?, shop_longitude = ?, shop_active = ?, shop_desa = ?, shop_kecamatan = ?, shop_kabupaten = ?, updated_at = NOW() 
       WHERE id = ?`,
      [
        data.displayName,
        data.shopDescription || null,
        data.shopAddress || null,
        data.shopWhatsapp || null,
        data.shopLatitude || null,
        data.shopLongitude || null,
        data.shopActive === undefined ? 1 : data.shopActive ? 1 : 0,
        data.shopDesa || null,
        data.shopKecamatan || null,
        data.shopKabupaten || null,
        data.id,
      ],
    );

    return { success: true };
  });

const updateAccountInput = z.object({
  id: z.string().min(1),
  email: z.string().email().optional(),
  password: z.string().min(6).optional(),
});

export const updateAccount = createServerFn({ method: "POST" })
  .inputValidator(updateAccountInput)
  .handler(async ({ data }) => {
    const { getDbPool } = await import("../db.server");
    const crypto = await import("node:crypto");
    const pool = getDbPool();

    // Check if user has local password or not
    const [rows] = await pool.execute("SELECT password_hash, email FROM profiles WHERE id = ?", [
      data.id,
    ]);
    const users = rows as any[];
    if (users.length === 0) {
      throw new Error("Pengguna tidak ditemukan");
    }

    const user = users[0];

    // If updating email, check if it already exists for another user
    if (data.email && data.email.toLowerCase() !== user.email?.toLowerCase()) {
      const [existing] = await pool.execute("SELECT id FROM profiles WHERE email = ?", [
        data.email,
      ]);
      if ((existing as any[]).length > 0) {
        throw new Error("Email sudah terdaftar oleh pengguna lain");
      }
      await pool.execute("UPDATE profiles SET email = ?, updated_at = NOW() WHERE id = ?", [
        data.email,
        data.id,
      ]);
    }

    // If updating password
    if (data.password) {
      const salt = crypto.randomBytes(16).toString("hex");
      const hash = crypto.pbkdf2Sync(data.password, salt, 1000, 64, "sha512").toString("hex");
      const passwordHash = `${salt}:${hash}`;
      await pool.execute("UPDATE profiles SET password_hash = ?, updated_at = NOW() WHERE id = ?", [
        passwordHash,
        data.id,
      ]);
    }

    return { success: true };
  });

// ==========================================
// 6. SUPER ADMIN SPECIAL FUNCTIONS
// ==========================================

const superAdminUpdateProfileInput = z.object({
  id: z.string().min(1),
  display_name: z.string().min(1),
  role: z.enum(["user", "admin", "super_admin"]),
  password: z.string().min(6).nullable().optional(),
  avatar_url: z.string().nullable().optional(),
  coins: z.number().int().min(0).optional(),
  streak: z.number().int().min(0).optional(),
  level: z.number().int().min(1).optional(),
  xp: z.number().int().min(0).optional(),
});

const superAdminDeleteProfileInput = z.object({
  id: z.string().min(1),
});

const superAdminDeleteUserPlantInput = z.object({
  id: z.string().min(1),
});

export const superAdminUpdateProfile = createServerFn({ method: "POST" })
  .inputValidator(superAdminUpdateProfileInput)
  .handler(async ({ data }) => {
    const { getDbPool } = await import("../db.server");
    const pool = getDbPool();

    // 1. Update profiles table
    await pool.execute(
      "UPDATE profiles SET display_name = ?, avatar_url = ?, coins = ?, streak = ?, level = ?, xp = ?, updated_at = NOW() WHERE id = ?",
      [
        data.display_name,
        data.avatar_url || null,
        data.coins !== undefined ? data.coins : 0,
        data.streak !== undefined ? data.streak : 0,
        data.level !== undefined ? data.level : 1,
        data.xp !== undefined ? data.xp : 0,
        data.id,
      ]
    );

    // If password is provided, hash it and update profiles
    if (data.password) {
      const crypto = await import("node:crypto");
      const salt = crypto.randomBytes(16).toString("hex");
      const hash = crypto.pbkdf2Sync(data.password, salt, 1000, 64, "sha512").toString("hex");
      const passwordHash = `${salt}:${hash}`;
      await pool.execute("UPDATE profiles SET password_hash = ?, updated_at = NOW() WHERE id = ?", [
        passwordHash,
        data.id,
      ]);
    }

    // 2. Update roles table
    // Remove existing roles first
    await pool.execute("DELETE FROM user_roles WHERE user_id = ?", [data.id]);
    // Insert new role
    await pool.execute("INSERT INTO user_roles (id, user_id, role) VALUES (UUID(), ?, ?)", [
      data.id,
      data.role,
    ]);

    return { success: true };
  });

export const superAdminDeleteProfile = createServerFn({ method: "POST" })
  .inputValidator(superAdminDeleteProfileInput)
  .handler(async ({ data }) => {
    const { getDbPool } = await import("../db.server");
    const pool = getDbPool();

    await pool.execute("DELETE FROM profiles WHERE id = ?", [data.id]);

    return { success: true };
  });

export const getAllUserPlants = createServerFn({ method: "GET" }).handler(async () => {
  const { getDbPool } = await import("../db.server");
  const pool = getDbPool();

  const [rows] = await pool.execute(
    `SELECT up.id, up.user_id, up.name, up.status, up.days, up.created_at, up.planted_at, up.image_url, p.display_name AS owner_name, p.email AS owner_email 
       FROM user_plants up
       LEFT JOIN profiles p ON up.user_id = p.id
       ORDER BY up.created_at DESC`,
  );

  const plants = rows as any[];
  for (const plant of plants) {
    if (plant.status === "Sakit") {
      const [taskCountRows] = await pool.execute(
        "SELECT COUNT(*) as count FROM user_tasks WHERE plant_id = ? AND curative = 1 AND is_done = 0",
        [plant.id]
      );
      const count = (taskCountRows as any[])[0].count;
      if (count === 0) {
        await pool.execute(
          "UPDATE user_plants SET status = 'Sehat' WHERE id = ?",
          [plant.id]
        );
        plant.status = "Sehat";
      }
    }
  }

  return plants;
});

export const superAdminDeleteUserPlant = createServerFn({ method: "POST" })
  .inputValidator(superAdminDeleteUserPlantInput)
  .handler(async ({ data }) => {
    const { getDbPool } = await import("../db.server");
    const pool = getDbPool();

    await pool.execute("DELETE FROM user_plants WHERE id = ?", [data.id]);

    return { success: true };
  });

export const addPlantSuggestion = createServerFn({ method: "POST" })
  .inputValidator(addPlantSuggestionInput)
  .handler(async ({ data }) => {
    const { getDbPool } = await import("../db.server");
    const pool = getDbPool();

    await pool.execute(
      "INSERT INTO plant_suggestions (id, user_id, suggested_plant, suggestion_text) VALUES (UUID(), ?, ?, ?)",
      [data.userId, data.suggestedPlant, data.suggestionText || null],
    );

    return { success: true };
  });

export const getPlantSuggestions = createServerFn({ method: "GET" }).handler(async () => {
  const { getDbPool } = await import("../db.server");
  const pool = getDbPool();

  const [rows] = await pool.execute(
    `SELECT ps.id, ps.user_id, ps.suggested_plant, ps.suggestion_text, ps.created_at, p.display_name AS owner_name, p.email AS owner_email 
       FROM plant_suggestions ps
       LEFT JOIN profiles p ON ps.user_id = p.id
       ORDER BY ps.created_at DESC`,
  );

  return rows;
});

export const deletePlantSuggestion = createServerFn({ method: "POST" })
  .inputValidator(deletePlantSuggestionInput)
  .handler(async ({ data }) => {
    const { getDbPool } = await import("../db.server");
    const pool = getDbPool();

    await pool.execute("DELETE FROM plant_suggestions WHERE id = ?", [data.id]);

    return { success: true };
  });

export const getPlantTasksAdmin = createServerFn({ method: "GET" })
  .inputValidator(z.object({ plantId: z.string().min(1) }))
  .handler(async ({ data }) => {
    const { getDbPool } = await import("../db.server");
    const pool = getDbPool();
    const [rows] = await pool.execute(
      "SELECT id, time, title, type, curative, is_done, plant_id, created_at FROM user_tasks WHERE plant_id = ? ORDER BY time ASC",
      [data.plantId]
    );
    const tasks = rows as any[];

    // Sync plant health status
    const [plantRows] = await pool.execute(
      "SELECT status FROM user_plants WHERE id = ?",
      [data.plantId]
    );
    const plants = plantRows as any[];
    if (plants.length > 0 && plants[0].status === "Sakit") {
      const activeCurativeCount = tasks.filter(t => t.curative && !t.is_done).length;
      if (activeCurativeCount === 0) {
        await pool.execute(
          "UPDATE user_plants SET status = 'Sehat' WHERE id = ?",
          [data.plantId]
        );
      }
    }

    return tasks;
  });

export const deleteUserTaskAdmin = createServerFn({ method: "POST" })
  .inputValidator(z.object({ taskId: z.string().min(1) }))
  .handler(async ({ data }) => {
    const { getDbPool } = await import("../db.server");
    const pool = getDbPool();

    const [tRows] = await pool.execute(
      "SELECT plant_id FROM user_tasks WHERE id = ?",
      [data.taskId]
    );
    const tasks = tRows as any[];

    await pool.execute("DELETE FROM user_tasks WHERE id = ?", [data.taskId]);

    if (tasks.length > 0) {
      const plantId = tasks[0].plant_id;
      const [taskCountRows] = await pool.execute(
        "SELECT COUNT(*) as count FROM user_tasks WHERE plant_id = ? AND curative = 1 AND is_done = 0",
        [plantId]
      );
      const count = (taskCountRows as any[])[0].count;
      if (count === 0) {
        await pool.execute(
          "UPDATE user_plants SET status = 'Sehat' WHERE id = ?",
          [plantId]
        );
      }
    }

    return { success: true };
  });

export const updateUserTaskAdmin = createServerFn({ method: "POST" })
  .inputValidator(z.object({
    taskId: z.string().min(1),
    title: z.string().min(1),
    time: z.string().min(5).max(10),
    isDone: z.boolean(),
  }))
  .handler(async ({ data }) => {
    const { getDbPool } = await import("../db.server");
    const pool = getDbPool();

    const [tRows] = await pool.execute(
      "SELECT plant_id FROM user_tasks WHERE id = ?",
      [data.taskId]
    );
    const tasks = tRows as any[];

    await pool.execute(
      "UPDATE user_tasks SET title = ?, time = ?, is_done = ? WHERE id = ?",
      [data.title, data.time, data.isDone ? 1 : 0, data.taskId]
    );

    if (tasks.length > 0) {
      const plantId = tasks[0].plant_id;
      const [taskCountRows] = await pool.execute(
        "SELECT COUNT(*) as count FROM user_tasks WHERE plant_id = ? AND curative = 1 AND is_done = 0",
        [plantId]
      );
      const count = (taskCountRows as any[])[0].count;
      if (count === 0) {
        await pool.execute(
          "UPDATE user_plants SET status = 'Sehat' WHERE id = ?",
          [plantId]
        );
      } else {
        await pool.execute(
          "UPDATE user_plants SET status = 'Sakit' WHERE id = ?",
          [plantId]
        );
      }
    }

    return { success: true };
  });

export const addUserTaskAdmin = createServerFn({ method: "POST" })
  .inputValidator(z.object({
    userId: z.string().min(1),
    plantId: z.string().min(1),
    title: z.string().min(1),
    time: z.string().min(5).max(10),
  }))
  .handler(async ({ data }) => {
    const { getDbPool } = await import("../db.server");
    const pool = getDbPool();
    await pool.execute(
      `INSERT INTO user_tasks (id, user_id, plant_id, time, title, type, curative, is_done) 
       VALUES (UUID(), ?, ?, ?, ?, 'Perawatan', true, false)`,
      [data.userId, data.plantId, data.time, data.title]
    );
    await pool.execute(
      "UPDATE user_plants SET status = 'Sakit' WHERE id = ?",
      [data.plantId]
    );
    return { success: true };
  });

// ==========================================
// 8. WISHLIST & BOOKMARK FUNCTIONS
// ==========================================

export const getWishlistCategories = createServerFn({ method: "GET" })
  .inputValidator(z.object({ userId: z.string().min(1) }))
  .handler(async ({ data }) => {
    const { getDbPool } = await import("../db.server");
    const pool = getDbPool();
    const [rows] = await pool.execute(
      "SELECT id, name, user_id, created_at FROM wishlist_categories WHERE user_id = ? ORDER BY name ASC",
      [data.userId]
    );
    return rows as any[];
  });

export const createWishlistCategory = createServerFn({ method: "POST" })
  .inputValidator(z.object({ userId: z.string().min(1), name: z.string().min(1) }))
  .handler(async ({ data }) => {
    const { getDbPool } = await import("../db.server");
    const pool = getDbPool();
    const id = `wc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    await pool.execute(
      "INSERT INTO wishlist_categories (id, user_id, name) VALUES (?, ?, ?)",
      [id, data.userId, data.name]
    );
    return { success: true, id };
  });

export const updateWishlistCategory = createServerFn({ method: "POST" })
  .inputValidator(z.object({ id: z.string().min(1), name: z.string().min(1) }))
  .handler(async ({ data }) => {
    const { getDbPool } = await import("../db.server");
    const pool = getDbPool();
    await pool.execute(
      "UPDATE wishlist_categories SET name = ? WHERE id = ?",
      [data.name, data.id]
    );
    return { success: true };
  });

export const deleteWishlistCategory = createServerFn({ method: "POST" })
  .inputValidator(z.object({ id: z.string().min(1) }))
  .handler(async ({ data }) => {
    const { getDbPool } = await import("../db.server");
    const pool = getDbPool();
    await pool.execute(
      "DELETE FROM wishlist_categories WHERE id = ?",
      [data.id]
    );
    return { success: true };
  });

export const getWishlistItems = createServerFn({ method: "GET" })
  .inputValidator(z.object({ userId: z.string().min(1) }))
  .handler(async ({ data }) => {
    const { getDbPool } = await import("../db.server");
    const pool = getDbPool();
    
    const [rows] = await pool.execute(
      `SELECT 
        wi.id as wishlist_item_id,
        wi.category_id,
        p.id,
        p.name,
        p.price,
        p.coin,
        p.image_url,
        p.description,
        p.admin_id,
        prof.display_name as shop_name,
        prof.shop_description,
        prof.shop_address,
        prof.shop_whatsapp,
        prof.shop_latitude,
        prof.shop_longitude
       FROM wishlist_items wi
       JOIN products p ON wi.product_id = p.id
       LEFT JOIN profiles prof ON p.admin_id = prof.id
       WHERE wi.user_id = ?
       ORDER BY wi.created_at DESC`,
      [data.userId]
    );
    return rows as any[];
  });

export const toggleWishlistItem = createServerFn({ method: "POST" })
  .inputValidator(z.object({ 
    userId: z.string().min(1), 
    productId: z.string().min(1),
    categoryId: z.string().nullable().optional()
  }))
  .handler(async ({ data }) => {
    const { getDbPool } = await import("../db.server");
    const pool = getDbPool();
    
    const [existing] = await pool.execute(
      "SELECT id FROM wishlist_items WHERE user_id = ? AND product_id = ?",
      [data.userId, data.productId]
    );
    const existingItems = existing as any[];
    
    if (existingItems.length > 0) {
      await pool.execute(
        "DELETE FROM wishlist_items WHERE user_id = ? AND product_id = ?",
        [data.userId, data.productId]
      );
      return { success: true, action: "removed" };
    } else {
      const id = `wi_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      await pool.execute(
        "INSERT INTO wishlist_items (id, user_id, product_id, category_id) VALUES (?, ?, ?, ?)",
        [id, data.userId, data.productId, data.categoryId || null]
      );
      return { success: true, action: "added", id };
    }
  });

export const updateWishlistItemCategory = createServerFn({ method: "POST" })
  .inputValidator(z.object({ 
    userId: z.string().min(1),
    productId: z.string().min(1),
    categoryId: z.string().nullable().optional()
  }))
  .handler(async ({ data }) => {
    const { getDbPool } = await import("../db.server");
    const pool = getDbPool();
    
    await pool.execute(
      "UPDATE wishlist_items SET category_id = ? WHERE user_id = ? AND product_id = ?",
      [data.categoryId || null, data.userId, data.productId]
    );
    return { success: true };
  });