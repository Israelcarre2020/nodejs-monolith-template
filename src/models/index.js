import sequelize from "../config/sequelize.js";
import User from "../features/users/user.model.js";
import Product from "../features/products/product.model.js";

// Initialize models
const models = {
  User,
  Product,
  sequelize
};

// Define associations
// User has many Products
User.hasMany(Product, { foreignKey: "userId", as: "products" });
Product.belongsTo(User, { foreignKey: "userId", as: "user" });

export default models;
