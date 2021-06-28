// Controllers (route handlers)
import * as authController from "./controllers/auth.controller";
import * as userController from "./controllers/user.controller";
import * as shopController from "./controllers/shop.controller";
import * as productController from "./controllers/product.controller";
import * as categoryController from "./controllers/category.controller";
import * as paymentController from "./controllers/payment.controller";
import * as orderController from "./controllers/order.controller";
import * as stateController from "./controllers/state.controller";
import * as searchController from "./controllers/search.controller";
import * as deliveryController from "./controllers/delivery.controller";

import verifyToken from "./libs/verifyToken";

/**
 * Primary app routes.
 */
module.exports = function (app: any) {
  app.post("/api/register", authController.register);
  app.post("/api/authenticate", authController.authenticate);
  app.post("/api/buyer/register", authController.buyerRegister);
  app.post("/api/buyer/login", authController.buyerLogin);
  app.get("/api/auth/refresh", verifyToken, authController.refresh);
  app.get("/api/auth/user", verifyToken, userController.authUser);

  /* shop */
  app.get("/api/shops", verifyToken, shopController.index);
  app.get("/api/shops/:uniqueId", verifyToken, shopController.detail);
  /* shop */

  /* Product */
  app.get("/api/products", verifyToken, productController.index);
  app.get("/api/products/latest", verifyToken, productController.latest);
  app.get("/api/products/:uniqueId", verifyToken, productController.detail);
  app.post("/api/product", verifyToken, productController.create);
  app.get(
    "/api/products/category/:uniqueId",
    verifyToken,
    productController.categoryProducts
  );
  app.get(
    "/api/products/shop/:id",
    verifyToken,
    productController.shopProducts
  );
  /* Product */

  /* Payments */
  app.get("/api/payments", verifyToken, paymentController.index);
  app.post("/api/payment", verifyToken, paymentController.create);
  app.put("/api/payments/:uniqueId", verifyToken, paymentController.update);
  app.delete("/api/payments/:uniqueId", verifyToken, paymentController.destroy);
  /* Payments */

  /* Category */
  app.post("/api/category", verifyToken, categoryController.create);
  app.get(
    "/api/parent/categories",
    verifyToken,
    categoryController.parentCategory
  );
  /* Category */

  /* Order */
  app.post("/api/order", verifyToken, orderController.create);
  app.get("/api/buyer/orders", verifyToken, userController.getBuyerOrders);

  /* Order */

  app.get("/api/states", stateController.index);
  app.get("/api/cities/:stateId", stateController.fetchCities);

  app.post("/api/search", verifyToken, searchController.search);

  app.post("/api/delivery", verifyToken, deliveryController.create);
  app.get(
    "/api/shop/:id/delivery",
    verifyToken,
    deliveryController.getShopDeliveryPrice
  );
};
