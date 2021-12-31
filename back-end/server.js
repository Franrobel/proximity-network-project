const express = require("express");
const cors = require("cors");
const app = express();
const bcrypt = require("bcrypt");
app.use(express.json());
const corsOptions = {
  origin: "http://localhost:3000",
};
app.use(cors(corsOptions));

const { pool } = require("./pool");
const authController = require("./controllers/auth.controller");
const publicController = require("./controllers/public.controller");
const privilegeController = require("./controllers/privilege.controller");
const filecontroller= require("./controllers/file.controller");
const uploadImage = require("./controllers/uploadImage.controller")
global.__basedir = __dirname;



//AUTH ENDPOINTS

app.post(
  "/register",
  authController.checkDuplicatedEmail,
  authController.register
);
app.post("/login", authController.logIn);

//PUBLIC ENDPOINTS

app.get("/", (req, res) => {
  // display the home page
  const nameApp = { App: "Proximity network" };
  res.status(200).send(nameApp);
});

app.get("/search/:zone", publicController.search); //devuelve lista de tiendas fitradas por codigo postal o ciudad
app.get("/stores/profiles/:storeId", publicController.getStoreById); //devuleve los datos de la tienda con ese id
app.get('/stores/:storeName', publicController.getProfile);//devuelve los datos de perfil de la tienda indicada

app.get("/stores", publicController.findAllStores); //devuelve lista de todas las tiendas
app.get("/stores/search/:storeName", publicController.findStoreByName); //devuelve los datos publicos de las tienda que coinciden con la busqueda
app.get("/products/storeProducts/:storeId", publicController.getAllStoreProducts);//devuelve todos los productos de una tienda
app.get("/products/:productId", publicController.findProductById);//devuelve los datos del producto con ese id


//privilege endpoints
app.get("/logged/stores", authController.veryfyJwt, privilegeController.getLoggedProfile);//devuelve los datos de la tienda loggeada
app.post("/stores/profiles/",authController.veryfyJwt, privilegeController.insertProfileData);//la tienda completa los datos por primera vez
app.put("/stores/profiles", authController.veryfyJwt, privilegeController.editProfile);//la tienda puede editar los datos de su perfil
app.get("/stores/managers/authentications", authController.veryfyJwt, authController.getNameAndEmail);//devuelve email y nombre del manager de la tienda loggeada
app.put("/stores/managers/authentications", authController.veryfyJwt, authController.editAuthentications);//la tienda puede cambiar el email, contraseña o nombre del storeManager
app.put("/stores/authentications/passwords", authController.veryfyJwt, authController.editPassword);//la tienda puede cambiar la contraseña actual

app.get("/products", authController.veryfyJwt, privilegeController.getAllStoreProducts);//devuelve todos los productos que tiene la tienda logeada
app.post("/stores/products", authController.veryfyJwt, privilegeController.addProduct);//la tienda puede subir un nuevo producto
app.put("/stores/products/:productId", authController.veryfyJwt, privilegeController.editProduct);//la tienda puede editar un determinado producto
app.delete("/products/:productId", authController.veryfyJwt, privilegeController.deleteProduct);//la tienda puede eliminar un determinado producto

//upload and retrieve images
app.post("/images/upload", filecontroller.upload);
app.get("/images", filecontroller.getListImages);
app.get("/images/:name", filecontroller.download);

app.put("/stores/images/upload", authController.veryfyJwt, uploadImage.uploadStoreImage);
app.put("/products/images/upload/:productId", authController.veryfyJwt, uploadImage.uploadProductImage);





const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`proximity network is running in port ${PORT}`));

