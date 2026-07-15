import { T as TSS_SERVER_FUNCTION, c as createServerFn } from "./index.mjs";
import "../_libs/seroval.mjs";
import "../_libs/react.mjs";
import { o as objectType, s as stringType, e as enumType, n as numberType, b as booleanType, a as arrayType } from "../_libs/zod.mjs";
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
import "node:stream";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "../_libs/tanstack__react-router.mjs";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "../_libs/isbot.mjs";
var createServerRpc = (serverFnMeta, splitImportFn) => {
  const url = "/_serverFn/" + serverFnMeta.id;
  return Object.assign(splitImportFn, {
    url,
    serverFnMeta,
    [TSS_SERVER_FUNCTION]: true
  });
};
const profileInput = objectType({
  id: stringType().min(1),
  email: stringType().nullable().optional(),
  display_name: stringType().nullable().optional(),
  avatar_url: stringType().nullable().optional()
});
const adminRoleInput = objectType({
  userId: stringType().min(1)
});
const addRoleInput = objectType({
  targetUserIdOrEmail: stringType().min(1),
  role: enumType(["admin", "super_admin"])
});
const removeRoleInput = objectType({
  roleId: stringType().min(1)
});
const productInput = objectType({
  name: stringType().min(1),
  price: numberType().int().min(0),
  coin: numberType().int().min(0).default(0),
  description: stringType().nullable().optional(),
  admin_id: stringType().nullable().optional(),
  image_url: stringType().nullable().optional()
});
const updateProductInput = objectType({
  id: stringType().min(1),
  name: stringType().min(1),
  price: numberType().int().min(0),
  coin: numberType().int().min(0).default(0),
  description: stringType().nullable().optional(),
  admin_id: stringType().nullable().optional(),
  image_url: stringType().nullable().optional()
});
const buyProductInput = objectType({
  userId: stringType().min(1),
  productId: stringType().min(1)
});
const userPlantsInput = objectType({
  userId: stringType().min(1)
});
const addPlantInput = objectType({
  userId: stringType().min(1),
  name: stringType().min(1),
  status: stringType().default("Sehat"),
  days: numberType().int().min(1).default(1),
  imageUrl: stringType().nullable().optional(),
  plantedAt: stringType().min(1)
});
const deletePlantInput = objectType({
  id: stringType().min(1),
  userId: stringType().min(1)
});
const userTasksInput = objectType({
  userId: stringType().min(1)
});
const toggleTaskInput = objectType({
  taskId: stringType().min(1),
  userId: stringType().min(1),
  isDone: booleanType()
});
const scanInput = objectType({
  userId: stringType().min(1),
  disease: stringType().min(1),
  confidence: numberType(),
  summary: stringType(),
  steps: arrayType(stringType()),
  plantId: stringType().nullable().optional()
});
const analyzeLeafInput = objectType({
  userId: stringType().min(1),
  image: stringType().min(1),
  plantId: stringType().nullable().optional()
});
const addPlantSuggestionInput = objectType({
  userId: stringType().min(1),
  suggestedPlant: stringType().min(1),
  suggestionText: stringType().nullable().optional()
});
const deletePlantSuggestionInput = objectType({
  id: stringType().min(1)
});
const getOrCreateProfile_createServerFn_handler = createServerRpc({
  id: "f235a2ec3388f5431c235048714b6feb3fa2783779056f8c3a12f79db3142119",
  name: "getOrCreateProfile",
  filename: "src/lib/api/db.functions.ts"
}, (opts) => getOrCreateProfile.__executeServer(opts));
const getOrCreateProfile = createServerFn({
  method: "POST"
}).inputValidator(profileInput).handler(getOrCreateProfile_createServerFn_handler, async ({
  data
}) => {
  const {
    getDbPool
  } = await import("./db.server-utiFpwk-.mjs");
  const pool = getDbPool();
  const [rows] = await pool.execute("SELECT id, display_name, email, avatar_url, coins, streak, level, xp, password_hash, created_at, updated_at, shop_description, shop_address, shop_whatsapp, shop_latitude, shop_longitude, shop_active, shop_desa, shop_kecamatan, shop_kabupaten, user_desa, user_kecamatan, user_kabupaten, user_latitude, user_longitude FROM profiles WHERE id = ?", [data.id]);
  const profiles = rows;
  if (profiles.length > 0) {
    return profiles[0];
  }
  if (data.email) {
    const [emailRows] = await pool.execute("SELECT id, display_name, email, avatar_url, coins, streak, level, xp, password_hash, created_at, shop_active FROM profiles WHERE email = ?", [data.email]);
    const emailProfiles = emailRows;
    if (emailProfiles.length > 0) {
      const oldId = emailProfiles[0].id;
      const newId = data.id;
      await pool.execute("SET FOREIGN_KEY_CHECKS = 0");
      await pool.execute("UPDATE profiles SET id = ? WHERE id = ?", [newId, oldId]);
      await pool.execute("UPDATE user_plants SET user_id = ? WHERE user_id = ?", [newId, oldId]);
      await pool.execute("UPDATE user_tasks SET user_id = ? WHERE user_id = ?", [newId, oldId]);
      await pool.execute("UPDATE scan_history SET user_id = ? WHERE user_id = ?", [newId, oldId]);
      await pool.execute("UPDATE user_roles SET user_id = ? WHERE user_id = ?", [newId, oldId]);
      await pool.execute("SET FOREIGN_KEY_CHECKS = 1");
      const displayName2 = emailProfiles[0].display_name || data.display_name || data.email.split("@")[0];
      const avatarUrl2 = data.avatar_url || emailProfiles[0].avatar_url;
      await pool.execute("UPDATE profiles SET display_name = ?, avatar_url = ? WHERE id = ?", [displayName2, avatarUrl2, newId]);
      const [updatedRows] = await pool.execute("SELECT id, display_name, email, avatar_url, coins, streak, level, xp, password_hash, created_at, updated_at, shop_description, shop_address, shop_whatsapp, shop_latitude, shop_longitude, shop_active, shop_desa, shop_kecamatan, shop_kabupaten, user_desa, user_kecamatan, user_kabupaten, user_latitude, user_longitude FROM profiles WHERE id = ?", [newId]);
      return updatedRows[0];
    }
  }
  const displayName = data.display_name || data.email?.split("@")[0] || "Petani Urban";
  const avatarUrl = data.avatar_url || null;
  await pool.execute("INSERT INTO profiles (id, display_name, email, avatar_url, coins, streak, level, xp) VALUES (?, ?, ?, ?, 0, 0, 1, 0)", [data.id, displayName, data.email || null, avatarUrl]);
  await pool.execute("INSERT INTO user_roles (id, user_id, role) VALUES (UUID(), ?, 'user')", [data.id]);
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
    created_at: (/* @__PURE__ */ new Date()).toISOString(),
    updated_at: (/* @__PURE__ */ new Date()).toISOString()
  };
});
const getAdminRoles_createServerFn_handler = createServerRpc({
  id: "7d6518fb08bf5ef68a64578d5d973eef49e9b0530949000432324336608d0faa",
  name: "getAdminRoles",
  filename: "src/lib/api/db.functions.ts"
}, (opts) => getAdminRoles.__executeServer(opts));
const getAdminRoles = createServerFn({
  method: "GET"
}).inputValidator(adminRoleInput).handler(getAdminRoles_createServerFn_handler, async ({
  data
}) => {
  const {
    getDbPool
  } = await import("./db.server-utiFpwk-.mjs");
  const pool = getDbPool();
  const [rows] = await pool.execute("SELECT role FROM user_roles WHERE user_id = ?", [data.userId]);
  return rows.map((r) => r.role);
});
const addAdminRole_createServerFn_handler = createServerRpc({
  id: "1d11917690a500db665bdcf25a4a8079d1aec0084e697cf3f8838ecfe304a37e",
  name: "addAdminRole",
  filename: "src/lib/api/db.functions.ts"
}, (opts) => addAdminRole.__executeServer(opts));
const addAdminRole = createServerFn({
  method: "POST"
}).inputValidator(addRoleInput).handler(addAdminRole_createServerFn_handler, async ({
  data
}) => {
  const {
    getDbPool
  } = await import("./db.server-utiFpwk-.mjs");
  const {
    supabaseAdmin
  } = await import("./client.server-BdOYdn1O.mjs");
  const pool = getDbPool();
  const input = data.targetUserIdOrEmail.trim();
  let targetUserId = "";
  if (input.includes("@")) {
    const [localRows] = await pool.execute("SELECT id FROM profiles WHERE email = ?", [input]);
    const localUsers = localRows;
    if (localUsers.length > 0) {
      targetUserId = localUsers[0].id;
    } else {
      try {
        const {
          data: {
            users
          },
          error: authError
        } = await supabaseAdmin.auth.admin.listUsers();
        if (authError) throw authError;
        const user = users.find((u) => u.email?.toLowerCase() === input.toLowerCase());
        if (!user) {
          throw new Error("Email tidak terdaftar di sistem");
        }
        targetUserId = user.id;
        const displayName = user.user_metadata?.full_name || user.user_metadata?.name || input.split("@")[0];
        await pool.execute("INSERT INTO profiles (id, display_name, email, avatar_url, coins, streak, level, xp) VALUES (?, ?, ?, NULL, 0, 0, 1, 0)", [targetUserId, displayName, input]);
      } catch (err) {
        throw new Error(err.message || "Gagal mencari pengguna berdasarkan email");
      }
    }
  } else {
    targetUserId = input;
    const [profileRows] = await pool.execute("SELECT id FROM profiles WHERE id = ?", [targetUserId]);
    if (profileRows.length === 0) {
      await pool.execute("INSERT INTO profiles (id, display_name, avatar_url, coins, streak, level, xp) VALUES (?, ?, NULL, 0, 0, 1, 0)", [targetUserId, `User ${targetUserId.slice(0, 8)}`]);
    }
  }
  await pool.execute("DELETE FROM user_roles WHERE user_id = ?", [targetUserId]);
  await pool.execute("INSERT INTO user_roles (id, user_id, role) VALUES (UUID(), ?, ?)", [targetUserId, data.role]);
  return {
    success: true
  };
});
const removeAdminRole_createServerFn_handler = createServerRpc({
  id: "3f288b5c541f68b09ca6eb4716cd5ea739431fc74024f415a67e4cd6cc8b49a9",
  name: "removeAdminRole",
  filename: "src/lib/api/db.functions.ts"
}, (opts) => removeAdminRole.__executeServer(opts));
const removeAdminRole = createServerFn({
  method: "POST"
}).inputValidator(removeRoleInput).handler(removeAdminRole_createServerFn_handler, async ({
  data
}) => {
  const {
    getDbPool
  } = await import("./db.server-utiFpwk-.mjs");
  const pool = getDbPool();
  await pool.execute("UPDATE user_roles SET role = 'user' WHERE id = ?", [data.roleId]);
  return {
    success: true
  };
});
const getAdminStats_createServerFn_handler = createServerRpc({
  id: "ea8a994eff4c22910186a0e16c90c9c15d0f7e19b5f98f07699de199961bb3aa",
  name: "getAdminStats",
  filename: "src/lib/api/db.functions.ts"
}, (opts) => getAdminStats.__executeServer(opts));
const getAdminStats = createServerFn({
  method: "GET"
}).handler(getAdminStats_createServerFn_handler, async () => {
  const {
    getDbPool
  } = await import("./db.server-utiFpwk-.mjs");
  const pool = getDbPool();
  const [profilesRows] = await pool.execute("SELECT coins, streak FROM profiles");
  const [rolesRows] = await pool.execute("SELECT role FROM user_roles");
  const [plantsRows] = await pool.execute("SELECT COUNT(*) as count FROM user_plants");
  const [productsRows] = await pool.execute("SELECT COUNT(*) as count FROM products");
  const profiles = profilesRows;
  const roles = rolesRows;
  const totalPlants = plantsRows[0]?.count ?? 0;
  const totalProducts = productsRows[0]?.count ?? 0;
  const users = profiles.length;
  const totalCoins = profiles.reduce((sum, p) => sum + (p.coins || 0), 0);
  const totalStreak = profiles.reduce((sum, p) => sum + (p.streak || 0), 0);
  const avgStreak = users ? Math.round(totalStreak / users * 10) / 10 : 0;
  const admins = roles.filter((r) => r.role === "admin").length;
  const superAdmins = roles.filter((r) => r.role === "super_admin").length;
  return {
    users,
    admins,
    superAdmins,
    totalCoins,
    avgStreak,
    totalPlants,
    totalProducts
  };
});
const getAdminProfiles_createServerFn_handler = createServerRpc({
  id: "2a7be8877cbc513308c34d98f5e978d222965ada2723a239274db54538289cd6",
  name: "getAdminProfiles",
  filename: "src/lib/api/db.functions.ts"
}, (opts) => getAdminProfiles.__executeServer(opts));
const getAdminProfiles = createServerFn({
  method: "GET"
}).handler(getAdminProfiles_createServerFn_handler, async () => {
  const {
    getDbPool
  } = await import("./db.server-utiFpwk-.mjs");
  const pool = getDbPool();
  const [rows] = await pool.execute(`SELECT p.id, p.display_name, p.email, p.avatar_url, p.coins, p.streak, p.level, p.xp, p.created_at, ur.role 
       FROM profiles p
       LEFT JOIN user_roles ur ON p.id = ur.user_id
       ORDER BY p.created_at DESC`);
  return rows;
});
const getAdminRolesList_createServerFn_handler = createServerRpc({
  id: "f47bd43bd1547f277b7e3724ea67eecd24d8df4eee49d19a98a10da8943bebe9",
  name: "getAdminRolesList",
  filename: "src/lib/api/db.functions.ts"
}, (opts) => getAdminRolesList.__executeServer(opts));
const getAdminRolesList = createServerFn({
  method: "GET"
}).handler(getAdminRolesList_createServerFn_handler, async () => {
  const {
    getDbPool
  } = await import("./db.server-utiFpwk-.mjs");
  const pool = getDbPool();
  const [rows] = await pool.execute(`SELECT ur.id, ur.user_id, ur.role, ur.created_at, p.display_name 
       FROM user_roles ur 
       LEFT JOIN profiles p ON ur.user_id = p.id 
       WHERE ur.role IN ('admin', 'super_admin') 
       ORDER BY ur.created_at DESC`);
  return rows;
});
const getProducts_createServerFn_handler = createServerRpc({
  id: "2a50a5b647acc02a57e3287d42f6b334735c7305ea91ef4a56aacd9222e4545d",
  name: "getProducts",
  filename: "src/lib/api/db.functions.ts"
}, (opts) => getProducts.__executeServer(opts));
const getProducts = createServerFn({
  method: "GET"
}).handler(getProducts_createServerFn_handler, async () => {
  const {
    getDbPool
  } = await import("./db.server-utiFpwk-.mjs");
  const pool = getDbPool();
  const [rows] = await pool.execute(`SELECT pr.id, pr.name, pr.price, pr.coin, pr.image_url, pr.description, pr.created_at, pr.admin_id, 
              p.display_name AS shop_name, p.shop_description, p.shop_address, p.shop_whatsapp, p.shop_latitude, p.shop_longitude,
              p.shop_active
       FROM products pr
       LEFT JOIN profiles p ON pr.admin_id = p.id
       WHERE p.id IS NULL OR p.shop_active != 0 OR p.shop_active IS NULL
       ORDER BY pr.name ASC`);
  return rows;
});
const getProductById_createServerFn_handler = createServerRpc({
  id: "318a6b6669862aeeb5d16b06073e649ccd22f7c7f8e614c5ce57a4dd97aa84cc",
  name: "getProductById",
  filename: "src/lib/api/db.functions.ts"
}, (opts) => getProductById.__executeServer(opts));
const getProductById = createServerFn({
  method: "GET"
}).inputValidator(objectType({
  id: stringType().min(1)
})).handler(getProductById_createServerFn_handler, async ({
  data
}) => {
  const {
    getDbPool
  } = await import("./db.server-utiFpwk-.mjs");
  const pool = getDbPool();
  const [rows] = await pool.execute(`SELECT pr.id, pr.name, pr.price, pr.coin, pr.image_url, pr.description, pr.created_at, pr.admin_id, 
              p.display_name AS shop_name, p.shop_description, p.shop_address, p.shop_whatsapp, p.shop_latitude, p.shop_longitude,
              p.shop_active
       FROM products pr
       LEFT JOIN profiles p ON pr.admin_id = p.id
       WHERE pr.id = ?`, [data.id]);
  const products = rows;
  if (products.length === 0) return null;
  return products[0];
});
const addProduct_createServerFn_handler = createServerRpc({
  id: "16604798d696a7ed7b47d7900191866bfb217d8d6f6feb5cc397c8ad4a9f8db5",
  name: "addProduct",
  filename: "src/lib/api/db.functions.ts"
}, (opts) => addProduct.__executeServer(opts));
const addProduct = createServerFn({
  method: "POST"
}).inputValidator(productInput).handler(addProduct_createServerFn_handler, async ({
  data
}) => {
  const {
    getDbPool
  } = await import("./db.server-utiFpwk-.mjs");
  const pool = getDbPool();
  await pool.execute("INSERT INTO products (id, name, price, coin, description, admin_id, image_url) VALUES (UUID(), ?, ?, ?, ?, ?, ?)", [data.name, data.price, data.coin, data.description || null, data.admin_id || null, data.image_url || null]);
  return {
    success: true
  };
});
const updateProduct_createServerFn_handler = createServerRpc({
  id: "4770555434a024d49b8af6eb8136e1d550fc6df5b1b725fe151f9b1e93d1a5e4",
  name: "updateProduct",
  filename: "src/lib/api/db.functions.ts"
}, (opts) => updateProduct.__executeServer(opts));
const updateProduct = createServerFn({
  method: "POST"
}).inputValidator(updateProductInput).handler(updateProduct_createServerFn_handler, async ({
  data
}) => {
  const {
    getDbPool
  } = await import("./db.server-utiFpwk-.mjs");
  const pool = getDbPool();
  await pool.execute("UPDATE products SET name = ?, price = ?, coin = ?, description = ?, admin_id = ?, image_url = ? WHERE id = ?", [data.name, data.price, data.coin, data.description || null, data.admin_id || null, data.image_url || null, data.id]);
  return {
    success: true
  };
});
const deleteProduct_createServerFn_handler = createServerRpc({
  id: "a25e7bd42bc6d7f15511d84443abf5ee889537cc41a67d519b2780effe3e6b92",
  name: "deleteProduct",
  filename: "src/lib/api/db.functions.ts"
}, (opts) => deleteProduct.__executeServer(opts));
const deleteProduct = createServerFn({
  method: "POST"
}).inputValidator(objectType({
  id: stringType().min(1)
})).handler(deleteProduct_createServerFn_handler, async ({
  data
}) => {
  const {
    getDbPool
  } = await import("./db.server-utiFpwk-.mjs");
  const pool = getDbPool();
  await pool.execute("DELETE FROM products WHERE id = ?", [data.id]);
  return {
    success: true
  };
});
const buyProduct_createServerFn_handler = createServerRpc({
  id: "cbd576a8fe732fdc782443bb139b702897c588beb41e6f0b7d5b84f3d7ea5be8",
  name: "buyProduct",
  filename: "src/lib/api/db.functions.ts"
}, (opts) => buyProduct.__executeServer(opts));
const buyProduct = createServerFn({
  method: "POST"
}).inputValidator(buyProductInput).handler(buyProduct_createServerFn_handler, async ({
  data
}) => {
  const {
    getDbPool
  } = await import("./db.server-utiFpwk-.mjs");
  const pool = getDbPool();
  const [pRows] = await pool.execute("SELECT name, coin FROM products WHERE id = ?", [data.productId]);
  const products = pRows;
  if (products.length === 0) {
    throw new Error("Produk tidak ditemukan");
  }
  const product = products[0];
  return {
    success: true,
    updatedCoins: 0,
    productName: product.name,
    addedCoins: 0
  };
});
const getUserPlants_createServerFn_handler = createServerRpc({
  id: "fee8752a8b935fd1b2b2585b7368b830885bbea0216566a2c86be4288f3c8302",
  name: "getUserPlants",
  filename: "src/lib/api/db.functions.ts"
}, (opts) => getUserPlants.__executeServer(opts));
const getUserPlants = createServerFn({
  method: "GET"
}).inputValidator(userPlantsInput).handler(getUserPlants_createServerFn_handler, async ({
  data
}) => {
  const {
    getDbPool
  } = await import("./db.server-utiFpwk-.mjs");
  const pool = getDbPool();
  const [rows] = await pool.execute("SELECT id, name, status, days, image_url, created_at, planted_at FROM user_plants WHERE user_id = ? ORDER BY created_at ASC", [data.userId]);
  const plants = rows;
  for (const plant of plants) {
    if (plant.status === "Sakit") {
      const [taskCountRows] = await pool.execute("SELECT COUNT(*) as count FROM user_tasks WHERE plant_id = ? AND curative = 1 AND is_done = 0", [plant.id]);
      const count = taskCountRows[0].count;
      if (count === 0) {
        await pool.execute("UPDATE user_plants SET status = 'Sehat' WHERE id = ?", [plant.id]);
        plant.status = "Sehat";
      }
    }
  }
  return plants;
});
const addUserPlant_createServerFn_handler = createServerRpc({
  id: "5f3a6537d488f17df377229f04165fe60fb3265fcd0456b4cdda1bd46588babf",
  name: "addUserPlant",
  filename: "src/lib/api/db.functions.ts"
}, (opts) => addUserPlant.__executeServer(opts));
const addUserPlant = createServerFn({
  method: "POST"
}).inputValidator(addPlantInput).handler(addUserPlant_createServerFn_handler, async ({
  data
}) => {
  const {
    getDbPool
  } = await import("./db.server-utiFpwk-.mjs");
  const pool = getDbPool();
  await pool.execute("INSERT INTO user_plants (id, user_id, name, status, days, image_url, planted_at) VALUES (UUID(), ?, ?, ?, ?, ?, ?)", [data.userId, data.name, data.status, data.days, data.imageUrl || null, data.plantedAt]);
  return {
    success: true
  };
});
const uploadPhotoInput = objectType({
  base64Data: stringType(),
  fileName: stringType()
});
const uploadPlantPhoto_createServerFn_handler = createServerRpc({
  id: "18a4078e51b633eb5b1bed0d600761b0026c1d29146827660d51273848be42fe",
  name: "uploadPlantPhoto",
  filename: "src/lib/api/db.functions.ts"
}, (opts) => uploadPlantPhoto.__executeServer(opts));
const uploadPlantPhoto = createServerFn({
  method: "POST"
}).inputValidator(uploadPhotoInput).handler(uploadPlantPhoto_createServerFn_handler, async ({
  data
}) => {
  const {
    supabaseAdmin
  } = await import("./client.server-BdOYdn1O.mjs");
  try {
    await supabaseAdmin.storage.createBucket("plant-photos", {
      public: true
    });
  } catch (e) {
  }
  const base64Clean = data.base64Data.replace(/^data:image\/\w+;base64,/, "");
  const buffer = Buffer.from(base64Clean, "base64");
  const fileExt = data.fileName.split(".").pop() || "jpg";
  const filePath = `plant_${Date.now()}_${Math.floor(Math.random() * 1e3)}.${fileExt}`;
  const {
    error: uploadError
  } = await supabaseAdmin.storage.from("plant-photos").upload(filePath, buffer, {
    contentType: `image/${fileExt}`,
    duplex: "half"
  });
  if (uploadError) {
    throw new Error(`Gagal mengunggah foto ke storage: ${uploadError.message}`);
  }
  const {
    data: urlData
  } = supabaseAdmin.storage.from("plant-photos").getPublicUrl(filePath);
  return {
    url: urlData.publicUrl
  };
});
const uploadProductPhoto_createServerFn_handler = createServerRpc({
  id: "054dde430634675cae144336234c9857df8a8f1d075e08cb2450cd1ce10fbfa8",
  name: "uploadProductPhoto",
  filename: "src/lib/api/db.functions.ts"
}, (opts) => uploadProductPhoto.__executeServer(opts));
const uploadProductPhoto = createServerFn({
  method: "POST"
}).inputValidator(uploadPhotoInput).handler(uploadProductPhoto_createServerFn_handler, async ({
  data
}) => {
  const {
    supabaseAdmin
  } = await import("./client.server-BdOYdn1O.mjs");
  try {
    await supabaseAdmin.storage.createBucket("product-photos", {
      public: true
    });
  } catch (e) {
  }
  const base64Clean = data.base64Data.replace(/^data:image\/\w+;base64,/, "");
  const buffer = Buffer.from(base64Clean, "base64");
  const fileExt = data.fileName.split(".").pop() || "jpg";
  const filePath = `product_${Date.now()}_${Math.floor(Math.random() * 1e3)}.${fileExt}`;
  const {
    error: uploadError
  } = await supabaseAdmin.storage.from("product-photos").upload(filePath, buffer, {
    contentType: `image/${fileExt}`,
    duplex: "half"
  });
  if (uploadError) {
    throw new Error(`Gagal mengunggah foto ke storage: ${uploadError.message}`);
  }
  const {
    data: urlData
  } = supabaseAdmin.storage.from("product-photos").getPublicUrl(filePath);
  return {
    url: urlData.publicUrl
  };
});
const deleteProductPhoto_createServerFn_handler = createServerRpc({
  id: "3a3c2f05d7d694db3cdec0afa9baa1166f1e567df74c9765d82011aa22adf0f0",
  name: "deleteProductPhoto",
  filename: "src/lib/api/db.functions.ts"
}, (opts) => deleteProductPhoto.__executeServer(opts));
const deleteProductPhoto = createServerFn({
  method: "POST"
}).inputValidator(objectType({
  imageUrl: stringType().min(1)
})).handler(deleteProductPhoto_createServerFn_handler, async ({
  data
}) => {
  const {
    supabaseAdmin
  } = await import("./client.server-BdOYdn1O.mjs");
  try {
    const decodedUrl = decodeURIComponent(data.imageUrl);
    const cleanUrl = decodedUrl.split("?")[0];
    const parts = cleanUrl.split("/product-photos/");
    const filePath = parts[parts.length - 1];
    if (filePath) {
      await supabaseAdmin.storage.from("product-photos").remove([filePath]);
    }
  } catch (err) {
    console.error("Gagal menghapus file dari Storage:", err.message);
  }
  return {
    success: true
  };
});
const updatePlantImageInput = objectType({
  plantId: stringType().min(1),
  userId: stringType().min(1),
  imageUrl: stringType().min(1)
});
const deletePhotoInput = objectType({
  imageUrl: stringType().min(1)
});
async function deleteFileByUrl(imageUrl) {
  const {
    supabaseAdmin
  } = await import("./client.server-BdOYdn1O.mjs");
  try {
    const decodedUrl = decodeURIComponent(imageUrl);
    const cleanUrl = decodedUrl.split("?")[0];
    const parts = cleanUrl.split("/plant-photos/");
    const filePath = parts[parts.length - 1];
    if (filePath) {
      const {
        data,
        error
      } = await supabaseAdmin.storage.from("plant-photos").remove([filePath]);
      if (error) {
        console.error(`Gagal menghapus file ${filePath} dari Storage:`, error.message);
      } else {
        console.log(`Berhasil menghapus file ${filePath} dari Storage:`, data);
      }
    }
  } catch (err) {
    console.error("Gagal menjalankan fungsi deleteFileByUrl:", err.message);
  }
}
const deletePlantPhoto_createServerFn_handler = createServerRpc({
  id: "32b42016a03f5ee25a58027216edf0810f0b1bce25ca47deb5e4e12038d9c303",
  name: "deletePlantPhoto",
  filename: "src/lib/api/db.functions.ts"
}, (opts) => deletePlantPhoto.__executeServer(opts));
const deletePlantPhoto = createServerFn({
  method: "POST"
}).inputValidator(deletePhotoInput).handler(deletePlantPhoto_createServerFn_handler, async ({
  data
}) => {
  await deleteFileByUrl(data.imageUrl);
  return {
    success: true
  };
});
const updatePlantImage_createServerFn_handler = createServerRpc({
  id: "80196975074845e9f873e422d5276c34a0e678e4520aed92030696d0c6364409",
  name: "updatePlantImage",
  filename: "src/lib/api/db.functions.ts"
}, (opts) => updatePlantImage.__executeServer(opts));
const updatePlantImage = createServerFn({
  method: "POST"
}).inputValidator(updatePlantImageInput).handler(updatePlantImage_createServerFn_handler, async ({
  data
}) => {
  const {
    getDbPool
  } = await import("./db.server-utiFpwk-.mjs");
  const pool = getDbPool();
  const [rows] = await pool.execute("SELECT image_url FROM user_plants WHERE id = ? AND user_id = ?", [data.plantId, data.userId]);
  const plants = rows;
  if (plants.length > 0 && plants[0].image_url) {
    await deleteFileByUrl(plants[0].image_url);
  }
  await pool.execute("UPDATE user_plants SET image_url = ? WHERE id = ? AND user_id = ?", [data.imageUrl, data.plantId, data.userId]);
  return {
    success: true
  };
});
const updatePlantPlantedAtInput = objectType({
  plantId: stringType().min(1),
  userId: stringType().min(1),
  plantedAt: stringType().min(1)
});
const updatePlantPlantedAt_createServerFn_handler = createServerRpc({
  id: "875b577272acda400c0bb531357f8afa0714cc6411660b2322f049b5f24cbddd",
  name: "updatePlantPlantedAt",
  filename: "src/lib/api/db.functions.ts"
}, (opts) => updatePlantPlantedAt.__executeServer(opts));
const updatePlantPlantedAt = createServerFn({
  method: "POST"
}).inputValidator(updatePlantPlantedAtInput).handler(updatePlantPlantedAt_createServerFn_handler, async ({
  data
}) => {
  const {
    getDbPool
  } = await import("./db.server-utiFpwk-.mjs");
  const pool = getDbPool();
  await pool.execute("UPDATE user_plants SET planted_at = ? WHERE id = ? AND user_id = ?", [data.plantedAt, data.plantId, data.userId]);
  return {
    success: true
  };
});
const deleteUserPlant_createServerFn_handler = createServerRpc({
  id: "0900fa5c60ef1ba04df6b4593dd6323293c6b657b56b746e9fd4b383ac26b16a",
  name: "deleteUserPlant",
  filename: "src/lib/api/db.functions.ts"
}, (opts) => deleteUserPlant.__executeServer(opts));
const deleteUserPlant = createServerFn({
  method: "POST"
}).inputValidator(deletePlantInput).handler(deleteUserPlant_createServerFn_handler, async ({
  data
}) => {
  const {
    getDbPool
  } = await import("./db.server-utiFpwk-.mjs");
  const pool = getDbPool();
  const [rows] = await pool.execute("SELECT image_url FROM user_plants WHERE id = ? AND user_id = ?", [data.id, data.userId]);
  const plants = rows;
  if (plants.length > 0 && plants[0].image_url) {
    await deleteFileByUrl(plants[0].image_url);
  }
  await pool.execute("DELETE FROM user_plants WHERE id = ? AND user_id = ?", [data.id, data.userId]);
  return {
    success: true
  };
});
const getUserTasks_createServerFn_handler = createServerRpc({
  id: "3462f3e36921f2e965c749e1299bc045875c5971dcf9d4b2dec7e01d0a465edf",
  name: "getUserTasks",
  filename: "src/lib/api/db.functions.ts"
}, (opts) => getUserTasks.__executeServer(opts));
const getUserTasks = createServerFn({
  method: "GET"
}).inputValidator(userTasksInput).handler(getUserTasks_createServerFn_handler, async ({
  data
}) => {
  const {
    getDbPool
  } = await import("./db.server-utiFpwk-.mjs");
  const pool = getDbPool();
  const [rows] = await pool.execute("SELECT id, time, title, type, curative, is_done, plant_id, created_at FROM user_tasks WHERE user_id = ? ORDER BY time ASC", [data.userId]);
  const tasks = rows;
  const activeTasks = [];
  const today = /* @__PURE__ */ new Date();
  const getDaysDifference = (date1, date2) => {
    const d1 = new Date(date1.getFullYear(), date1.getMonth(), date1.getDate());
    const d2 = new Date(date2.getFullYear(), date2.getMonth(), date2.getDate());
    return Math.floor((d2.getTime() - d1.getTime()) / (1e3 * 60 * 60 * 24));
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
      await pool.execute("DELETE FROM user_tasks WHERE id = ?", [task.id]);
    } else ;
  }
  const [userPlantsRows] = await pool.execute("SELECT id, status FROM user_plants WHERE user_id = ?", [data.userId]);
  const userPlants = userPlantsRows;
  for (const plant of userPlants) {
    if (plant.status === "Sakit") {
      const [taskCountRows] = await pool.execute("SELECT COUNT(*) as count FROM user_tasks WHERE plant_id = ? AND curative = 1 AND is_done = 0", [plant.id]);
      const count = taskCountRows[0].count;
      if (count === 0) {
        await pool.execute("UPDATE user_plants SET status = 'Sehat' WHERE id = ?", [plant.id]);
      }
    }
  }
  return activeTasks;
});
const toggleTaskCompleted_createServerFn_handler = createServerRpc({
  id: "6d6a1a48f4697c0558396a14584d64e7a18cbf44f112c74aa01d10f435f780fa",
  name: "toggleTaskCompleted",
  filename: "src/lib/api/db.functions.ts"
}, (opts) => toggleTaskCompleted.__executeServer(opts));
const toggleTaskCompleted = createServerFn({
  method: "POST"
}).inputValidator(toggleTaskInput).handler(toggleTaskCompleted_createServerFn_handler, async ({
  data
}) => {
  const {
    getDbPool
  } = await import("./db.server-utiFpwk-.mjs");
  const pool = getDbPool();
  const [tRows] = await pool.execute("SELECT is_done, plant_id, curative FROM user_tasks WHERE id = ? AND user_id = ?", [data.taskId, data.userId]);
  const tasks = tRows;
  if (tasks.length === 0) {
    throw new Error("Tugas tidak ditemukan");
  }
  const requestedIsDone = data.isDone;
  await pool.execute("UPDATE user_tasks SET is_done = ? WHERE id = ? AND user_id = ?", [requestedIsDone ? 1 : 0, data.taskId, data.userId]);
  const tDetail = tasks[0];
  if (tDetail && tDetail.curative && tDetail.plant_id) {
    if (requestedIsDone) {
      const [uncompletedRows] = await pool.execute("SELECT COUNT(*) as count FROM user_tasks WHERE plant_id = ? AND curative = 1 AND is_done = 0", [tDetail.plant_id]);
      const count = uncompletedRows[0].count;
      if (count === 0) {
        await pool.execute("UPDATE user_plants SET status = 'Sehat' WHERE id = ?", [tDetail.plant_id]);
      }
    } else {
      await pool.execute("UPDATE user_plants SET status = 'Sakit' WHERE id = ?", [tDetail.plant_id]);
    }
  }
  return {
    success: true,
    updatedCoins: 0,
    coinAdjustment: 0
  };
});
const saveScanResult_createServerFn_handler = createServerRpc({
  id: "ac59a9e80d26236a3b3c56c15878f7c892960f64ac7ac6cdf69b795467659f02",
  name: "saveScanResult",
  filename: "src/lib/api/db.functions.ts"
}, (opts) => saveScanResult.__executeServer(opts));
const saveScanResult = createServerFn({
  method: "POST"
}).inputValidator(scanInput).handler(saveScanResult_createServerFn_handler, async ({
  data
}) => {
  const {
    getDbPool
  } = await import("./db.server-utiFpwk-.mjs");
  const pool = getDbPool();
  const serializedSteps = data.steps.join("\n");
  await pool.execute("INSERT INTO scan_history (id, user_id, image_url, disease, confidence, summary, steps) VALUES (UUID(), ?, NULL, ?, ?, ?, ?)", [data.userId, data.disease, data.confidence, data.summary, serializedSteps]);
  for (const stepText of data.steps) {
    await pool.execute(`INSERT INTO user_tasks (id, user_id, plant_id, time, title, type, curative, is_done) 
         VALUES (UUID(), ?, ?, '08:30', ?, 'Perawatan', true, false)`, [data.userId, data.plantId || null, stepText]);
  }
  if (data.plantId) {
    await pool.execute("UPDATE user_plants SET status = 'Sakit' WHERE id = ?", [data.plantId]);
  }
  return {
    success: true
  };
});
const analyzeLeafImage_createServerFn_handler = createServerRpc({
  id: "d0312bdadbb06d9bbb1ec2464acc620562d831592cc3620f8385e088b849c9bc",
  name: "analyzeLeafImage",
  filename: "src/lib/api/db.functions.ts"
}, (opts) => analyzeLeafImage.__executeServer(opts));
const analyzeLeafImage = createServerFn({
  method: "POST"
}).inputValidator(analyzeLeafInput).handler(analyzeLeafImage_createServerFn_handler, async ({
  data
}) => {
  const {
    getDbPool
  } = await import("./db.server-utiFpwk-.mjs");
  const pool = getDbPool();
  let plantName = "";
  if (data.plantId) {
    const [rows] = await pool.execute("SELECT name FROM user_plants WHERE id = ?", [data.plantId]);
    const plants = rows;
    if (plants.length > 0) {
      plantName = plants[0].name;
    }
  }
  const [activeProductsRows] = await pool.execute(`SELECT pr.id, pr.name, pr.description, pr.price, pr.image_url, p.display_name AS shop_name,
              p.shop_address, p.shop_whatsapp, p.shop_latitude, p.shop_longitude
       FROM products pr
       JOIN profiles p ON pr.admin_id = p.id
       WHERE p.shop_active = 1`);
  const activeProducts = activeProductsRows;
  const productListStr = activeProducts.map((p) => `- ID: ${p.id}
  Nama: ${p.name}
  Deskripsi: ${p.description || "Tidak ada deskripsi"}`).join("\n\n");
  let productSectionPrompt = "";
  if (activeProducts.length > 0) {
    productSectionPrompt = `Berikut adalah daftar obat/pestisida/pupuk yang tersedia secara publik di toko aktif sistem kami:
${productListStr}

Rekomendasikan obat/pestisida/pupuk yang cocok dari daftar di atas untuk menyembuhkan penyakit yang dideteksi. Hanya rekomendasikan produk dari daftar di atas yang benar-benar cocok. Jika tidak ada obat yang cocok atau tidak ada obat dalam daftar, kosongkan properti "recommendedProducts" (kembalikan array kosong []).`;
  } else {
    productSectionPrompt = `Saat ini tidak ada obat/pestisida/pupuk yang tersedia di toko aktif kami. Properti "recommendedProducts" harus dikembalikan sebagai array kosong [].`;
  }
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
  const match = data.image.match(/^data:([^;]+);base64,(.+)$/);
  const mimeType = match ? match[1] : "image/jpeg";
  const base64Data = match ? match[2] : data.image;
  const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("Gemini API Key is not configured.");
  }
  const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
  const requestBody = {
    contents: [{
      parts: [{
        text: prompt
      }, {
        inlineData: {
          mimeType,
          data: base64Data
        }
      }]
    }],
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: {
        type: "OBJECT",
        properties: {
          disease: {
            type: "STRING"
          },
          confidence: {
            type: "NUMBER"
          },
          summary: {
            type: "STRING"
          },
          tasks: {
            type: "ARRAY",
            items: {
              type: "OBJECT",
              properties: {
                title: {
                  type: "STRING"
                },
                time: {
                  type: "STRING"
                }
              },
              required: ["title", "time"]
            }
          },
          recommendedProducts: {
            type: "ARRAY",
            items: {
              type: "OBJECT",
              properties: {
                productId: {
                  type: "STRING"
                },
                reason: {
                  type: "STRING"
                }
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
        "Content-Type": "application/json"
      },
      body: JSON.stringify(requestBody)
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
  } catch (err) {
    console.error("Failed to run Gemini leaf analysis:", err);
    geminiResult = {
      disease: plantName ? `Penyakit Daun ${plantName}` : "Penyakit Bercak Daun",
      confidence: 0.9,
      summary: `Gagal menghubungi Gemini AI. Ini adalah diagnosis fallback untuk ${plantName || "kategori umum"}.`,
      tasks: [{
        title: "Semprot larutan perawatan (Hari ke-1/3)",
        time: "08:30"
      }, {
        title: "Gunting daun berbercak (Hari ke-1/3)",
        time: "09:00"
      }, {
        title: "Semprot larutan perawatan (Hari ke-3/3)",
        time: "08:30"
      }],
      recommendedProducts: [{
        productId: "inj-p2",
        reason: "Fungisida Antracol sangat disarankan untuk mengatasi infeksi jamur atau bercak daun yang didiagnosis pada tanaman tomat."
      }]
    };
  }
  const stepsArray = geminiResult.tasks.map((t) => t.title);
  const serializedSteps = stepsArray.join("\n");
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
    await pool.execute(`INSERT INTO user_tasks (id, user_id, plant_id, time, title, type, curative, is_done) 
         VALUES (UUID(), ?, ?, ?, ?, ?, true, false)`, [data.userId, data.plantId || null, task.time, task.title, taskType]);
  }
  if (data.plantId) {
    await pool.execute("UPDATE user_plants SET status = 'Sakit' WHERE id = ?", [data.plantId]);
  }
  const recommendedProductDetails = [];
  if (Array.isArray(geminiResult.recommendedProducts)) {
    for (const rec of geminiResult.recommendedProducts) {
      const found = activeProducts.find((p) => p.id === rec.productId);
      if (found) {
        let parsedImages = [];
        try {
          parsedImages = JSON.parse(found.image_url);
        } catch {
        }
        const imgUrl = Array.isArray(parsedImages) && parsedImages.length > 0 ? parsedImages[0] : found.image_url || null;
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
  await pool.execute("INSERT INTO scan_history (id, user_id, image_url, disease, confidence, summary, steps, recommended_products) VALUES (UUID(), ?, ?, ?, ?, ?, ?, ?)", [data.userId, data.image, geminiResult.disease, geminiResult.confidence, geminiResult.summary, serializedSteps, JSON.stringify(recommendedProductDetails)]);
  return {
    success: true,
    result: {
      disease: geminiResult.disease,
      confidence: geminiResult.confidence,
      summary: geminiResult.summary,
      steps: stepsArray,
      recommendedProducts: recommendedProductDetails
    }
  };
});
const getScanHistory_createServerFn_handler = createServerRpc({
  id: "07645ca2e9d295844246f94bc099ea2acc9b41001e02849abcb4a0b316ba2c27",
  name: "getScanHistory",
  filename: "src/lib/api/db.functions.ts"
}, (opts) => getScanHistory.__executeServer(opts));
const getScanHistory = createServerFn({
  method: "GET"
}).inputValidator(objectType({
  userId: stringType().min(1)
})).handler(getScanHistory_createServerFn_handler, async ({
  data
}) => {
  const {
    getDbPool
  } = await import("./db.server-utiFpwk-.mjs");
  const pool = getDbPool();
  const [rows] = await pool.execute("SELECT id, disease, confidence, summary, steps, image_url, recommended_products, created_at FROM scan_history WHERE user_id = ? ORDER BY created_at DESC", [data.userId]);
  return rows.map((r) => ({
    ...r,
    steps: r.steps ? r.steps.split("\n") : [],
    recommendedProducts: r.recommended_products ? JSON.parse(r.recommended_products) : []
  }));
});
const deleteScanHistory_createServerFn_handler = createServerRpc({
  id: "5fad867b7a90838afb8cc6f7025b64c75f76e9e25dd02a1c9465f8d461a22bf1",
  name: "deleteScanHistory",
  filename: "src/lib/api/db.functions.ts"
}, (opts) => deleteScanHistory.__executeServer(opts));
const deleteScanHistory = createServerFn({
  method: "POST"
}).inputValidator(objectType({
  id: stringType().min(1)
})).handler(deleteScanHistory_createServerFn_handler, async ({
  data
}) => {
  const {
    getDbPool
  } = await import("./db.server-utiFpwk-.mjs");
  const pool = getDbPool();
  await pool.execute("DELETE FROM scan_history WHERE id = ?", [data.id]);
  return {
    success: true
  };
});
const checkEmailExists_createServerFn_handler = createServerRpc({
  id: "c8de46c9ea044154ee881b2ee6f90cab20da811ee7f2d03d4cd11175d8dffc55",
  name: "checkEmailExists",
  filename: "src/lib/api/db.functions.ts"
}, (opts) => checkEmailExists.__executeServer(opts));
const checkEmailExists = createServerFn({
  method: "POST"
}).inputValidator(objectType({
  email: stringType().email()
})).handler(checkEmailExists_createServerFn_handler, async ({
  data
}) => {
  const {
    getDbPool
  } = await import("./db.server-utiFpwk-.mjs");
  const {
    supabaseAdmin
  } = await import("./client.server-BdOYdn1O.mjs");
  const pool = getDbPool();
  const [rows] = await pool.execute("SELECT id, password_hash FROM profiles WHERE email = ?", [data.email]);
  const profiles = rows;
  if (profiles.length > 0) {
    const hasPassword = !!profiles[0].password_hash;
    return {
      exists: true,
      type: hasPassword ? "local" : "google"
    };
  }
  try {
    const {
      data: {
        users
      }
    } = await supabaseAdmin.auth.admin.listUsers();
    const user = users.find((u) => u.email?.toLowerCase() === data.email.toLowerCase());
    if (user) {
      return {
        exists: true,
        type: "google"
      };
    }
  } catch {
  }
  return {
    exists: false,
    type: null
  };
});
const registerInput = objectType({
  email: stringType().email(),
  password: stringType().min(6),
  displayName: stringType().min(1)
});
const registerLocal_createServerFn_handler = createServerRpc({
  id: "907673ce0406b410c803947aaafc5fff516bcd5a1334660fac83b0211220cc18",
  name: "registerLocal",
  filename: "src/lib/api/db.functions.ts"
}, (opts) => registerLocal.__executeServer(opts));
const registerLocal = createServerFn({
  method: "POST"
}).inputValidator(registerInput).handler(registerLocal_createServerFn_handler, async ({
  data
}) => {
  const {
    getDbPool
  } = await import("./db.server-utiFpwk-.mjs");
  const crypto = await import("node:crypto");
  const pool = getDbPool();
  const [existing] = await pool.execute("SELECT id, password_hash FROM profiles WHERE email = ?", [data.email]);
  const existingUsers = existing;
  if (existingUsers.length > 0) {
    const user = existingUsers[0];
    if (user.password_hash) {
      throw new Error("Email sudah terdaftar dengan kata sandi");
    }
    const salt2 = crypto.randomBytes(16).toString("hex");
    const hash2 = crypto.pbkdf2Sync(data.password, salt2, 1e3, 64, "sha512").toString("hex");
    const passwordHash2 = `${salt2}:${hash2}`;
    await pool.execute("UPDATE profiles SET password_hash = ?, display_name = ? WHERE id = ?", [passwordHash2, data.displayName, user.id]);
    return {
      id: user.id,
      email: data.email,
      display_name: data.displayName
    };
  }
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.pbkdf2Sync(data.password, salt, 1e3, 64, "sha512").toString("hex");
  const passwordHash = `${salt}:${hash}`;
  const userId = crypto.randomUUID();
  await pool.execute("INSERT INTO profiles (id, display_name, email, password_hash, coins, streak, level, xp) VALUES (?, ?, ?, ?, 0, 0, 1, 0)", [userId, data.displayName, data.email, passwordHash]);
  await pool.execute("INSERT INTO user_roles (id, user_id, role) VALUES (UUID(), ?, 'user')", [userId]);
  return {
    id: userId,
    email: data.email,
    display_name: data.displayName
  };
});
const loginInput = objectType({
  email: stringType().email(),
  password: stringType()
});
const loginLocal_createServerFn_handler = createServerRpc({
  id: "1f44673e51d91818c80b176dcb5adf390143aaa9a0eb43d304cf7a7a53f54c15",
  name: "loginLocal",
  filename: "src/lib/api/db.functions.ts"
}, (opts) => loginLocal.__executeServer(opts));
const loginLocal = createServerFn({
  method: "POST"
}).inputValidator(loginInput).handler(loginLocal_createServerFn_handler, async ({
  data
}) => {
  const {
    getDbPool
  } = await import("./db.server-utiFpwk-.mjs");
  const crypto = await import("node:crypto");
  const pool = getDbPool();
  const [rows] = await pool.execute("SELECT id, email, display_name, password_hash FROM profiles WHERE email = ?", [data.email]);
  const users = rows;
  if (users.length === 0) {
    throw new Error("Email tidak terdaftar");
  }
  const user = users[0];
  if (!user.password_hash) {
    throw new Error("Email ini terdaftar menggunakan Google. Silakan masuk dengan Google.");
  }
  const [salt, storedHash] = user.password_hash.split(":");
  if (!salt || !storedHash) {
    throw new Error("Format kata sandi rusak");
  }
  const verifyHash = crypto.pbkdf2Sync(data.password, salt, 1e3, 64, "sha512").toString("hex");
  if (verifyHash !== storedHash) {
    throw new Error("Kata sandi salah");
  }
  return {
    id: user.id,
    email: user.email,
    display_name: user.display_name
  };
});
const updateProfileInput = objectType({
  id: stringType().min(1),
  displayName: stringType().min(1),
  avatarUrl: stringType().nullable().optional()
});
const updateProfile_createServerFn_handler = createServerRpc({
  id: "45381f46cd1801e535b1d3023656ab60e43e62689146c424b89d908e1b0cf9aa",
  name: "updateProfile",
  filename: "src/lib/api/db.functions.ts"
}, (opts) => updateProfile.__executeServer(opts));
const updateProfile = createServerFn({
  method: "POST"
}).inputValidator(updateProfileInput).handler(updateProfile_createServerFn_handler, async ({
  data
}) => {
  const {
    getDbPool
  } = await import("./db.server-utiFpwk-.mjs");
  const pool = getDbPool();
  await pool.execute("UPDATE profiles SET display_name = ?, avatar_url = ?, updated_at = NOW() WHERE id = ?", [data.displayName, data.avatarUrl || null, data.id]);
  return {
    success: true
  };
});
const updateUserProfileLocationInput = objectType({
  id: stringType().min(1),
  userDesa: stringType().nullable().optional(),
  userKecamatan: stringType().nullable().optional(),
  userKabupaten: stringType().nullable().optional(),
  userLatitude: numberType().nullable().optional(),
  userLongitude: numberType().nullable().optional()
});
const updateUserProfileLocation_createServerFn_handler = createServerRpc({
  id: "eb02acdeb83841539e4fe6e8e1399180a433107f7a0f762916eed4e84e861fc5",
  name: "updateUserProfileLocation",
  filename: "src/lib/api/db.functions.ts"
}, (opts) => updateUserProfileLocation.__executeServer(opts));
const updateUserProfileLocation = createServerFn({
  method: "POST"
}).inputValidator(updateUserProfileLocationInput).handler(updateUserProfileLocation_createServerFn_handler, async ({
  data
}) => {
  const {
    getDbPool
  } = await import("./db.server-utiFpwk-.mjs");
  const pool = getDbPool();
  await pool.execute("UPDATE profiles SET user_desa = ?, user_kecamatan = ?, user_kabupaten = ?, user_latitude = ?, user_longitude = ?, updated_at = NOW() WHERE id = ?", [data.userDesa || null, data.userKecamatan || null, data.userKabupaten || null, data.userLatitude !== void 0 ? data.userLatitude : null, data.userLongitude !== void 0 ? data.userLongitude : null, data.id]);
  return {
    success: true
  };
});
const updateShopProfileInput = objectType({
  id: stringType().min(1),
  displayName: stringType().min(1),
  shopDescription: stringType().nullable().optional(),
  shopAddress: stringType().nullable().optional(),
  shopWhatsapp: stringType().nullable().optional(),
  shopLatitude: numberType().nullable().optional(),
  shopLongitude: numberType().nullable().optional(),
  shopActive: booleanType().optional(),
  shopDesa: stringType().nullable().optional(),
  shopKecamatan: stringType().nullable().optional(),
  shopKabupaten: stringType().nullable().optional()
});
const updateShopProfile_createServerFn_handler = createServerRpc({
  id: "038b2f3bccb6ccd0467859d42acd25c730bfee87e968c2d0c35ad14e525bbe30",
  name: "updateShopProfile",
  filename: "src/lib/api/db.functions.ts"
}, (opts) => updateShopProfile.__executeServer(opts));
const updateShopProfile = createServerFn({
  method: "POST"
}).inputValidator(updateShopProfileInput).handler(updateShopProfile_createServerFn_handler, async ({
  data
}) => {
  const {
    getDbPool
  } = await import("./db.server-utiFpwk-.mjs");
  const pool = getDbPool();
  await pool.execute(`UPDATE profiles 
       SET display_name = ?, shop_description = ?, shop_address = ?, shop_whatsapp = ?, shop_latitude = ?, shop_longitude = ?, shop_active = ?, shop_desa = ?, shop_kecamatan = ?, shop_kabupaten = ?, updated_at = NOW() 
       WHERE id = ?`, [data.displayName, data.shopDescription || null, data.shopAddress || null, data.shopWhatsapp || null, data.shopLatitude || null, data.shopLongitude || null, data.shopActive === void 0 ? 1 : data.shopActive ? 1 : 0, data.shopDesa || null, data.shopKecamatan || null, data.shopKabupaten || null, data.id]);
  return {
    success: true
  };
});
const updateAccountInput = objectType({
  id: stringType().min(1),
  email: stringType().email().optional(),
  password: stringType().min(6).optional()
});
const updateAccount_createServerFn_handler = createServerRpc({
  id: "e395aa272a2b53b28a30d4bde5be9c8a542d2113922316b0bff3efb1c221bc0d",
  name: "updateAccount",
  filename: "src/lib/api/db.functions.ts"
}, (opts) => updateAccount.__executeServer(opts));
const updateAccount = createServerFn({
  method: "POST"
}).inputValidator(updateAccountInput).handler(updateAccount_createServerFn_handler, async ({
  data
}) => {
  const {
    getDbPool
  } = await import("./db.server-utiFpwk-.mjs");
  const crypto = await import("node:crypto");
  const pool = getDbPool();
  const [rows] = await pool.execute("SELECT password_hash, email FROM profiles WHERE id = ?", [data.id]);
  const users = rows;
  if (users.length === 0) {
    throw new Error("Pengguna tidak ditemukan");
  }
  const user = users[0];
  if (data.email && data.email.toLowerCase() !== user.email?.toLowerCase()) {
    const [existing] = await pool.execute("SELECT id FROM profiles WHERE email = ?", [data.email]);
    if (existing.length > 0) {
      throw new Error("Email sudah terdaftar oleh pengguna lain");
    }
    await pool.execute("UPDATE profiles SET email = ?, updated_at = NOW() WHERE id = ?", [data.email, data.id]);
  }
  if (data.password) {
    const salt = crypto.randomBytes(16).toString("hex");
    const hash = crypto.pbkdf2Sync(data.password, salt, 1e3, 64, "sha512").toString("hex");
    const passwordHash = `${salt}:${hash}`;
    await pool.execute("UPDATE profiles SET password_hash = ?, updated_at = NOW() WHERE id = ?", [passwordHash, data.id]);
  }
  return {
    success: true
  };
});
const superAdminUpdateProfileInput = objectType({
  id: stringType().min(1),
  display_name: stringType().min(1),
  role: enumType(["user", "admin", "super_admin"]),
  password: stringType().min(6).nullable().optional(),
  avatar_url: stringType().nullable().optional(),
  coins: numberType().int().min(0).optional(),
  streak: numberType().int().min(0).optional(),
  level: numberType().int().min(1).optional(),
  xp: numberType().int().min(0).optional()
});
const superAdminDeleteProfileInput = objectType({
  id: stringType().min(1)
});
const superAdminDeleteUserPlantInput = objectType({
  id: stringType().min(1)
});
const superAdminUpdateProfile_createServerFn_handler = createServerRpc({
  id: "cd99e9835172a0fbba14102261e14b5b31486c8d3f125335dbda01f1eaaa69cb",
  name: "superAdminUpdateProfile",
  filename: "src/lib/api/db.functions.ts"
}, (opts) => superAdminUpdateProfile.__executeServer(opts));
const superAdminUpdateProfile = createServerFn({
  method: "POST"
}).inputValidator(superAdminUpdateProfileInput).handler(superAdminUpdateProfile_createServerFn_handler, async ({
  data
}) => {
  const {
    getDbPool
  } = await import("./db.server-utiFpwk-.mjs");
  const pool = getDbPool();
  await pool.execute("UPDATE profiles SET display_name = ?, avatar_url = ?, coins = ?, streak = ?, level = ?, xp = ?, updated_at = NOW() WHERE id = ?", [data.display_name, data.avatar_url || null, data.coins !== void 0 ? data.coins : 0, data.streak !== void 0 ? data.streak : 0, data.level !== void 0 ? data.level : 1, data.xp !== void 0 ? data.xp : 0, data.id]);
  if (data.password) {
    const crypto = await import("node:crypto");
    const salt = crypto.randomBytes(16).toString("hex");
    const hash = crypto.pbkdf2Sync(data.password, salt, 1e3, 64, "sha512").toString("hex");
    const passwordHash = `${salt}:${hash}`;
    await pool.execute("UPDATE profiles SET password_hash = ?, updated_at = NOW() WHERE id = ?", [passwordHash, data.id]);
  }
  await pool.execute("DELETE FROM user_roles WHERE user_id = ?", [data.id]);
  await pool.execute("INSERT INTO user_roles (id, user_id, role) VALUES (UUID(), ?, ?)", [data.id, data.role]);
  return {
    success: true
  };
});
const superAdminDeleteProfile_createServerFn_handler = createServerRpc({
  id: "8702fdc5634dd052993e28073deb8bcf14524c535499fbd972cce5be5ecf6dcb",
  name: "superAdminDeleteProfile",
  filename: "src/lib/api/db.functions.ts"
}, (opts) => superAdminDeleteProfile.__executeServer(opts));
const superAdminDeleteProfile = createServerFn({
  method: "POST"
}).inputValidator(superAdminDeleteProfileInput).handler(superAdminDeleteProfile_createServerFn_handler, async ({
  data
}) => {
  const {
    getDbPool
  } = await import("./db.server-utiFpwk-.mjs");
  const pool = getDbPool();
  await pool.execute("DELETE FROM profiles WHERE id = ?", [data.id]);
  return {
    success: true
  };
});
const getAllUserPlants_createServerFn_handler = createServerRpc({
  id: "bf61550ae809244f153eea6077bf47384b1ae8b15ab6c9b5cd1306cbaec65778",
  name: "getAllUserPlants",
  filename: "src/lib/api/db.functions.ts"
}, (opts) => getAllUserPlants.__executeServer(opts));
const getAllUserPlants = createServerFn({
  method: "GET"
}).handler(getAllUserPlants_createServerFn_handler, async () => {
  const {
    getDbPool
  } = await import("./db.server-utiFpwk-.mjs");
  const pool = getDbPool();
  const [rows] = await pool.execute(`SELECT up.id, up.user_id, up.name, up.status, up.days, up.created_at, up.planted_at, up.image_url, p.display_name AS owner_name, p.email AS owner_email 
       FROM user_plants up
       LEFT JOIN profiles p ON up.user_id = p.id
       ORDER BY up.created_at DESC`);
  const plants = rows;
  for (const plant of plants) {
    if (plant.status === "Sakit") {
      const [taskCountRows] = await pool.execute("SELECT COUNT(*) as count FROM user_tasks WHERE plant_id = ? AND curative = 1 AND is_done = 0", [plant.id]);
      const count = taskCountRows[0].count;
      if (count === 0) {
        await pool.execute("UPDATE user_plants SET status = 'Sehat' WHERE id = ?", [plant.id]);
        plant.status = "Sehat";
      }
    }
  }
  return plants;
});
const superAdminDeleteUserPlant_createServerFn_handler = createServerRpc({
  id: "466c3daa0393ea6ab7e2487ebe07fc85e05d16a40d732bb544c3528346cf7efa",
  name: "superAdminDeleteUserPlant",
  filename: "src/lib/api/db.functions.ts"
}, (opts) => superAdminDeleteUserPlant.__executeServer(opts));
const superAdminDeleteUserPlant = createServerFn({
  method: "POST"
}).inputValidator(superAdminDeleteUserPlantInput).handler(superAdminDeleteUserPlant_createServerFn_handler, async ({
  data
}) => {
  const {
    getDbPool
  } = await import("./db.server-utiFpwk-.mjs");
  const pool = getDbPool();
  await pool.execute("DELETE FROM user_plants WHERE id = ?", [data.id]);
  return {
    success: true
  };
});
const addPlantSuggestion_createServerFn_handler = createServerRpc({
  id: "96abc83d8c0983b4285effdd50fb621f0092a3f9b362bb9848b8de9dec178ea0",
  name: "addPlantSuggestion",
  filename: "src/lib/api/db.functions.ts"
}, (opts) => addPlantSuggestion.__executeServer(opts));
const addPlantSuggestion = createServerFn({
  method: "POST"
}).inputValidator(addPlantSuggestionInput).handler(addPlantSuggestion_createServerFn_handler, async ({
  data
}) => {
  const {
    getDbPool
  } = await import("./db.server-utiFpwk-.mjs");
  const pool = getDbPool();
  await pool.execute("INSERT INTO plant_suggestions (id, user_id, suggested_plant, suggestion_text) VALUES (UUID(), ?, ?, ?)", [data.userId, data.suggestedPlant, data.suggestionText || null]);
  return {
    success: true
  };
});
const getPlantSuggestions_createServerFn_handler = createServerRpc({
  id: "ac0287ab7df51f1371b7ab081f507552cb8158ac09f27ca878c3c1ab38f96fca",
  name: "getPlantSuggestions",
  filename: "src/lib/api/db.functions.ts"
}, (opts) => getPlantSuggestions.__executeServer(opts));
const getPlantSuggestions = createServerFn({
  method: "GET"
}).handler(getPlantSuggestions_createServerFn_handler, async () => {
  const {
    getDbPool
  } = await import("./db.server-utiFpwk-.mjs");
  const pool = getDbPool();
  const [rows] = await pool.execute(`SELECT ps.id, ps.user_id, ps.suggested_plant, ps.suggestion_text, ps.created_at, p.display_name AS owner_name, p.email AS owner_email 
       FROM plant_suggestions ps
       LEFT JOIN profiles p ON ps.user_id = p.id
       ORDER BY ps.created_at DESC`);
  return rows;
});
const deletePlantSuggestion_createServerFn_handler = createServerRpc({
  id: "3ab4f9045cff8a49441e3ab12c7719bde171ae8386845cf4e09a91037fa33ba5",
  name: "deletePlantSuggestion",
  filename: "src/lib/api/db.functions.ts"
}, (opts) => deletePlantSuggestion.__executeServer(opts));
const deletePlantSuggestion = createServerFn({
  method: "POST"
}).inputValidator(deletePlantSuggestionInput).handler(deletePlantSuggestion_createServerFn_handler, async ({
  data
}) => {
  const {
    getDbPool
  } = await import("./db.server-utiFpwk-.mjs");
  const pool = getDbPool();
  await pool.execute("DELETE FROM plant_suggestions WHERE id = ?", [data.id]);
  return {
    success: true
  };
});
const getPlantTasksAdmin_createServerFn_handler = createServerRpc({
  id: "d0bbf992f550b5c0a907d90e6dac3483d1ca509512eb0db7d1c521ad47634204",
  name: "getPlantTasksAdmin",
  filename: "src/lib/api/db.functions.ts"
}, (opts) => getPlantTasksAdmin.__executeServer(opts));
const getPlantTasksAdmin = createServerFn({
  method: "GET"
}).inputValidator(objectType({
  plantId: stringType().min(1)
})).handler(getPlantTasksAdmin_createServerFn_handler, async ({
  data
}) => {
  const {
    getDbPool
  } = await import("./db.server-utiFpwk-.mjs");
  const pool = getDbPool();
  const [rows] = await pool.execute("SELECT id, time, title, type, curative, is_done, plant_id, created_at FROM user_tasks WHERE plant_id = ? ORDER BY time ASC", [data.plantId]);
  const tasks = rows;
  const [plantRows] = await pool.execute("SELECT status FROM user_plants WHERE id = ?", [data.plantId]);
  const plants = plantRows;
  if (plants.length > 0 && plants[0].status === "Sakit") {
    const activeCurativeCount = tasks.filter((t) => t.curative && !t.is_done).length;
    if (activeCurativeCount === 0) {
      await pool.execute("UPDATE user_plants SET status = 'Sehat' WHERE id = ?", [data.plantId]);
    }
  }
  return tasks;
});
const deleteUserTaskAdmin_createServerFn_handler = createServerRpc({
  id: "84619989b09f19084a2dc19a7139dfcc675b4d18c2381bb228d5f71eb7a4248b",
  name: "deleteUserTaskAdmin",
  filename: "src/lib/api/db.functions.ts"
}, (opts) => deleteUserTaskAdmin.__executeServer(opts));
const deleteUserTaskAdmin = createServerFn({
  method: "POST"
}).inputValidator(objectType({
  taskId: stringType().min(1)
})).handler(deleteUserTaskAdmin_createServerFn_handler, async ({
  data
}) => {
  const {
    getDbPool
  } = await import("./db.server-utiFpwk-.mjs");
  const pool = getDbPool();
  const [tRows] = await pool.execute("SELECT plant_id FROM user_tasks WHERE id = ?", [data.taskId]);
  const tasks = tRows;
  await pool.execute("DELETE FROM user_tasks WHERE id = ?", [data.taskId]);
  if (tasks.length > 0) {
    const plantId = tasks[0].plant_id;
    const [taskCountRows] = await pool.execute("SELECT COUNT(*) as count FROM user_tasks WHERE plant_id = ? AND curative = 1 AND is_done = 0", [plantId]);
    const count = taskCountRows[0].count;
    if (count === 0) {
      await pool.execute("UPDATE user_plants SET status = 'Sehat' WHERE id = ?", [plantId]);
    }
  }
  return {
    success: true
  };
});
const updateUserTaskAdmin_createServerFn_handler = createServerRpc({
  id: "c2ff90a3e92559203728491c39fea818b775e94418bd6ceac76cf3a4dac99ef4",
  name: "updateUserTaskAdmin",
  filename: "src/lib/api/db.functions.ts"
}, (opts) => updateUserTaskAdmin.__executeServer(opts));
const updateUserTaskAdmin = createServerFn({
  method: "POST"
}).inputValidator(objectType({
  taskId: stringType().min(1),
  title: stringType().min(1),
  time: stringType().min(5).max(10),
  isDone: booleanType()
})).handler(updateUserTaskAdmin_createServerFn_handler, async ({
  data
}) => {
  const {
    getDbPool
  } = await import("./db.server-utiFpwk-.mjs");
  const pool = getDbPool();
  const [tRows] = await pool.execute("SELECT plant_id FROM user_tasks WHERE id = ?", [data.taskId]);
  const tasks = tRows;
  await pool.execute("UPDATE user_tasks SET title = ?, time = ?, is_done = ? WHERE id = ?", [data.title, data.time, data.isDone ? 1 : 0, data.taskId]);
  if (tasks.length > 0) {
    const plantId = tasks[0].plant_id;
    const [taskCountRows] = await pool.execute("SELECT COUNT(*) as count FROM user_tasks WHERE plant_id = ? AND curative = 1 AND is_done = 0", [plantId]);
    const count = taskCountRows[0].count;
    if (count === 0) {
      await pool.execute("UPDATE user_plants SET status = 'Sehat' WHERE id = ?", [plantId]);
    } else {
      await pool.execute("UPDATE user_plants SET status = 'Sakit' WHERE id = ?", [plantId]);
    }
  }
  return {
    success: true
  };
});
const addUserTaskAdmin_createServerFn_handler = createServerRpc({
  id: "34385a10872e25dac466cb385005bcca6f3ae63e5c5b7d6c4742ec196078e6fe",
  name: "addUserTaskAdmin",
  filename: "src/lib/api/db.functions.ts"
}, (opts) => addUserTaskAdmin.__executeServer(opts));
const addUserTaskAdmin = createServerFn({
  method: "POST"
}).inputValidator(objectType({
  userId: stringType().min(1),
  plantId: stringType().min(1),
  title: stringType().min(1),
  time: stringType().min(5).max(10)
})).handler(addUserTaskAdmin_createServerFn_handler, async ({
  data
}) => {
  const {
    getDbPool
  } = await import("./db.server-utiFpwk-.mjs");
  const pool = getDbPool();
  await pool.execute(`INSERT INTO user_tasks (id, user_id, plant_id, time, title, type, curative, is_done) 
       VALUES (UUID(), ?, ?, ?, ?, 'Perawatan', true, false)`, [data.userId, data.plantId, data.time, data.title]);
  await pool.execute("UPDATE user_plants SET status = 'Sakit' WHERE id = ?", [data.plantId]);
  return {
    success: true
  };
});
const getWishlistCategories_createServerFn_handler = createServerRpc({
  id: "67f752fac1ddbe4c55370e962b380e61daa3d2a1d1ee4c4eb062478f7145ea87",
  name: "getWishlistCategories",
  filename: "src/lib/api/db.functions.ts"
}, (opts) => getWishlistCategories.__executeServer(opts));
const getWishlistCategories = createServerFn({
  method: "GET"
}).inputValidator(objectType({
  userId: stringType().min(1)
})).handler(getWishlistCategories_createServerFn_handler, async ({
  data
}) => {
  const {
    getDbPool
  } = await import("./db.server-utiFpwk-.mjs");
  const pool = getDbPool();
  const [rows] = await pool.execute("SELECT id, name, user_id, created_at FROM wishlist_categories WHERE user_id = ? ORDER BY name ASC", [data.userId]);
  return rows;
});
const createWishlistCategory_createServerFn_handler = createServerRpc({
  id: "ddef14b5de42ec5a56afeb3e2bf3d4193ab7ef93f13d6769a406fd750bc1204d",
  name: "createWishlistCategory",
  filename: "src/lib/api/db.functions.ts"
}, (opts) => createWishlistCategory.__executeServer(opts));
const createWishlistCategory = createServerFn({
  method: "POST"
}).inputValidator(objectType({
  userId: stringType().min(1),
  name: stringType().min(1)
})).handler(createWishlistCategory_createServerFn_handler, async ({
  data
}) => {
  const {
    getDbPool
  } = await import("./db.server-utiFpwk-.mjs");
  const pool = getDbPool();
  const id = `wc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  await pool.execute("INSERT INTO wishlist_categories (id, user_id, name) VALUES (?, ?, ?)", [id, data.userId, data.name]);
  return {
    success: true,
    id
  };
});
const updateWishlistCategory_createServerFn_handler = createServerRpc({
  id: "fa707a4d4ed35df5a0e1f2c9169ab00ace0241f6d4da255be60bb4e21a95e8cd",
  name: "updateWishlistCategory",
  filename: "src/lib/api/db.functions.ts"
}, (opts) => updateWishlistCategory.__executeServer(opts));
const updateWishlistCategory = createServerFn({
  method: "POST"
}).inputValidator(objectType({
  id: stringType().min(1),
  name: stringType().min(1)
})).handler(updateWishlistCategory_createServerFn_handler, async ({
  data
}) => {
  const {
    getDbPool
  } = await import("./db.server-utiFpwk-.mjs");
  const pool = getDbPool();
  await pool.execute("UPDATE wishlist_categories SET name = ? WHERE id = ?", [data.name, data.id]);
  return {
    success: true
  };
});
const deleteWishlistCategory_createServerFn_handler = createServerRpc({
  id: "14817af28be3301b67bcee8ea11a8dfa9c1597ed586d9472027335c8e434e7ab",
  name: "deleteWishlistCategory",
  filename: "src/lib/api/db.functions.ts"
}, (opts) => deleteWishlistCategory.__executeServer(opts));
const deleteWishlistCategory = createServerFn({
  method: "POST"
}).inputValidator(objectType({
  id: stringType().min(1)
})).handler(deleteWishlistCategory_createServerFn_handler, async ({
  data
}) => {
  const {
    getDbPool
  } = await import("./db.server-utiFpwk-.mjs");
  const pool = getDbPool();
  await pool.execute("DELETE FROM wishlist_categories WHERE id = ?", [data.id]);
  return {
    success: true
  };
});
const getWishlistItems_createServerFn_handler = createServerRpc({
  id: "89bc642a6cfb03103eca52a99c0a3a50c5534460f21483132d404611dcf9ad73",
  name: "getWishlistItems",
  filename: "src/lib/api/db.functions.ts"
}, (opts) => getWishlistItems.__executeServer(opts));
const getWishlistItems = createServerFn({
  method: "GET"
}).inputValidator(objectType({
  userId: stringType().min(1)
})).handler(getWishlistItems_createServerFn_handler, async ({
  data
}) => {
  const {
    getDbPool
  } = await import("./db.server-utiFpwk-.mjs");
  const pool = getDbPool();
  const [rows] = await pool.execute(`SELECT 
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
       ORDER BY wi.created_at DESC`, [data.userId]);
  return rows;
});
const toggleWishlistItem_createServerFn_handler = createServerRpc({
  id: "668977dba0f5295d7fb2f3bae32eea6222af61b79a46e57772723389a77e8492",
  name: "toggleWishlistItem",
  filename: "src/lib/api/db.functions.ts"
}, (opts) => toggleWishlistItem.__executeServer(opts));
const toggleWishlistItem = createServerFn({
  method: "POST"
}).inputValidator(objectType({
  userId: stringType().min(1),
  productId: stringType().min(1),
  categoryId: stringType().nullable().optional()
})).handler(toggleWishlistItem_createServerFn_handler, async ({
  data
}) => {
  const {
    getDbPool
  } = await import("./db.server-utiFpwk-.mjs");
  const pool = getDbPool();
  const [existing] = await pool.execute("SELECT id FROM wishlist_items WHERE user_id = ? AND product_id = ?", [data.userId, data.productId]);
  const existingItems = existing;
  if (existingItems.length > 0) {
    await pool.execute("DELETE FROM wishlist_items WHERE user_id = ? AND product_id = ?", [data.userId, data.productId]);
    return {
      success: true,
      action: "removed"
    };
  } else {
    const id = `wi_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    await pool.execute("INSERT INTO wishlist_items (id, user_id, product_id, category_id) VALUES (?, ?, ?, ?)", [id, data.userId, data.productId, data.categoryId || null]);
    return {
      success: true,
      action: "added",
      id
    };
  }
});
const updateWishlistItemCategory_createServerFn_handler = createServerRpc({
  id: "cac08fde4b71d90befbf723f4468d13c2e00c35d54bb8a400d66dcb2e09d0eff",
  name: "updateWishlistItemCategory",
  filename: "src/lib/api/db.functions.ts"
}, (opts) => updateWishlistItemCategory.__executeServer(opts));
const updateWishlistItemCategory = createServerFn({
  method: "POST"
}).inputValidator(objectType({
  userId: stringType().min(1),
  productId: stringType().min(1),
  categoryId: stringType().nullable().optional()
})).handler(updateWishlistItemCategory_createServerFn_handler, async ({
  data
}) => {
  const {
    getDbPool
  } = await import("./db.server-utiFpwk-.mjs");
  const pool = getDbPool();
  await pool.execute("UPDATE wishlist_items SET category_id = ? WHERE user_id = ? AND product_id = ?", [data.categoryId || null, data.userId, data.productId]);
  return {
    success: true
  };
});
export {
  addAdminRole_createServerFn_handler,
  addPlantSuggestion_createServerFn_handler,
  addProduct_createServerFn_handler,
  addUserPlant_createServerFn_handler,
  addUserTaskAdmin_createServerFn_handler,
  analyzeLeafImage_createServerFn_handler,
  buyProduct_createServerFn_handler,
  checkEmailExists_createServerFn_handler,
  createWishlistCategory_createServerFn_handler,
  deletePlantPhoto_createServerFn_handler,
  deletePlantSuggestion_createServerFn_handler,
  deleteProductPhoto_createServerFn_handler,
  deleteProduct_createServerFn_handler,
  deleteScanHistory_createServerFn_handler,
  deleteUserPlant_createServerFn_handler,
  deleteUserTaskAdmin_createServerFn_handler,
  deleteWishlistCategory_createServerFn_handler,
  getAdminProfiles_createServerFn_handler,
  getAdminRolesList_createServerFn_handler,
  getAdminRoles_createServerFn_handler,
  getAdminStats_createServerFn_handler,
  getAllUserPlants_createServerFn_handler,
  getOrCreateProfile_createServerFn_handler,
  getPlantSuggestions_createServerFn_handler,
  getPlantTasksAdmin_createServerFn_handler,
  getProductById_createServerFn_handler,
  getProducts_createServerFn_handler,
  getScanHistory_createServerFn_handler,
  getUserPlants_createServerFn_handler,
  getUserTasks_createServerFn_handler,
  getWishlistCategories_createServerFn_handler,
  getWishlistItems_createServerFn_handler,
  loginLocal_createServerFn_handler,
  registerLocal_createServerFn_handler,
  removeAdminRole_createServerFn_handler,
  saveScanResult_createServerFn_handler,
  superAdminDeleteProfile_createServerFn_handler,
  superAdminDeleteUserPlant_createServerFn_handler,
  superAdminUpdateProfile_createServerFn_handler,
  toggleTaskCompleted_createServerFn_handler,
  toggleWishlistItem_createServerFn_handler,
  updateAccount_createServerFn_handler,
  updatePlantImage_createServerFn_handler,
  updatePlantPlantedAt_createServerFn_handler,
  updateProduct_createServerFn_handler,
  updateProfile_createServerFn_handler,
  updateShopProfile_createServerFn_handler,
  updateUserProfileLocation_createServerFn_handler,
  updateUserTaskAdmin_createServerFn_handler,
  updateWishlistCategory_createServerFn_handler,
  updateWishlistItemCategory_createServerFn_handler,
  uploadPlantPhoto_createServerFn_handler,
  uploadProductPhoto_createServerFn_handler
};
