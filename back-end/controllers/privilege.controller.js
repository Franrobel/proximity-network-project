const { pool } = require("../pool");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

//middleware

//functions
const getMapsUrl = (storeStreet, city) => {
  const tail = storeStreet.split(" ").join("+") + `+${city}`;
  return `https://www.google.com/maps/search/?api=1&query=${tail}`;
};

//profiles
exports.getLoggedProfile =  (req,res)=>{ 
  const storeId = req.user.id; 
  pool.query('SELECT s_a.store_manager, s.name, s.store_description, s.store_category, s.web_page, s.phone_number, s.image, s_l.address, s_l.city, s_l.country, s_l.postcode  FROM stores as s join stores_locations as s_l on s_l.store_id = s.store_id join stores_authentications as s_a on s_a.id = s.store_id  WHERE s.store_id = $1', [storeId])
  .then((result) => res.json(result.rows))
  .catch((e) => console.log(e));
};

exports.insertProfileData = async (req, res) => {
  console.log("req.params in insertProfileData : ", req.params)
  const {
    storeId,
    storeName,
    storeDescription,
    storeWeb,
    phoneNumber,
    storeCategory,
    storeEmail,
    imageUrl,
    storeStreet,
    city,
    country,
    postcode,
  } = req.body;
  const mapsUrl = getMapsUrl(storeStreet, city);
  let response = {};

  await pool
    .query(
      "INSERT INTO stores (store_id, name, store_description, store_category, web_page, store_email, phone_number, image) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)",
      [
        storeId,
        storeName,
        storeDescription,
        storeCategory,
        storeWeb,
        storeEmail,
        phoneNumber,
        imageUrl,
      ]
    )
    .then(() => {
      response.profile = "data uploaded correctly.";
    })
    .catch((error) => {
      console.log(error);
    });

  await pool
    .query(
      "INSERT INTO stores_locations (store_id, address, city, postcode, country, maps_url) VALUES ($1, $2, $3, $4, $5, $6)",
      [storeId, storeStreet, city, postcode, country, mapsUrl]
    )
    .then(() => {
      response.location = "data uploaded correctly.";
      res.status(200).json(response);
    })
    .catch((error) => console.log(error));
};

// exports.insertProfileData = async (req, res) => {
//   const id = req.params.id
//   console.log("req.params.id  --> ", id);
//   const {
//     storeName,
//     storeDescription,
//     storeWeb,
//     phoneNumber,
//     storeCategory,
//     storeEmail,
//     imageUrl,
//     storeStreet,
//     city,
//     country,
//     postcode,
//   } = req.body;
//   const mapsUrl = getMapsUrl(storeStreet, city);
//   let response = {};
// await pool.query('SELECT id from stores_authentications where id=$1', [id]);

//   await pool
//     .query(
//       "INSERT INTO stores (name, store_description, store_category, web_page, store_email, phone_number, image) VALUES ($1, $2, $3, $4, $5, $6, $7) where store_id=$8",
//       [
//         storeName,
//         storeDescription,
//         storeCategory,
//         storeWeb,
//         storeEmail,
//         phoneNumber,
//         imageUrl,
//         id
//       ]
//     )
//     .then(() => {
//       response.profile = "data uploaded correctly.";
//     })
//     .catch((error) => {
//       console.log(error);
//     });

//   await pool
//     .query(
//       "INSERT INTO stores_locations (address, city, postcode, country, maps_url) VALUES ($1, $2, $3, $4, $5, $6) where store_id=$7",
//       [storeStreet, city, postcode, country, mapsUrl, id]
//     )
//     .then(() => {
//       response.location = "data uploaded correctly.";
//       res.status(200).json(response);
//     })
//     .catch((error) => console.log(error));
// };

exports.editProfile = async (req, res) => {
  const storeId = req.user.id;
  const {
    storeName,
    storeDescription,
    storeWeb,
    phoneNumber,
    storeCategory,
    imageUrl,
    storeStreet,
    city,
    country,
    postcode,
  } = req.body;
  const mapsUrl = getMapsUrl(storeStreet, city);
  let response = {};
  await pool
    .query(
      "UPDATE stores SET name=$1, store_description=$2, store_category=$3, web_page=$4, phone_number=$5, image=$6 WHERE store_id = $7",
      [
        storeName,
        storeDescription,
        storeCategory,
        storeWeb,
        phoneNumber,
        imageUrl,
        storeId,
      ]
    )
    .then(() => {
      response.profile = "data updated correctly.";
    })
    .catch((error) => {
      console.log(error);
    });

  await pool
    .query(
      "UPDATE stores_locations SET address=$1, city=$2, postcode=$3, country=$4, maps_url=$5 WHERE store_id = $6",
      [storeStreet, city, postcode, country, mapsUrl, storeId]
    )
    .then(() => {
      response.location = "data updated correctly.";
      res.status(200).json(response);
    })
    .catch((error) => console.log(error));
};

//products
exports.getAllStoreProducts = (req, res) => {
  const storeId = req.user.id;  
  console.log({storeId})
    pool
      .query("SELECT * FROM products WHERE store_id = $1", [storeId])
      .then((result) => res.status(200).json(result.rows))
      .catch((e) => console.log(e));
  
};
exports.addProduct = (req, res) => {
  // the store add a product
  const storeId = req.user.id;
  const {
    type,
    brand,
    category,
    description,
    unit,
    price,
    producer,
    origin,
    productImage,
  } = req.body;
  const query =
    "INSERT INTO products (store_id, product_type, brand, category, product_description, unit, price, producer, origin, product_image) values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)";

  pool
    .query(query, [
      storeId,
      type,
      brand,
      category,
      description,
      unit,
      price,
      producer,
      origin,
      productImage,
    ])
    .then(() =>
      res
        .status(200)
        .send({ message: `Product ${brand} was added succesfully` })
    )
    .catch((error) => console.log(error));
  //res.send(console.log(req.body))
};

exports.deleteProduct = (req, res) => {
  const idProduct = req.params.productId;
  const queryDeleteProduct =
    "DELETE FROM products USING stores WHERE products.store_id = stores.store_id and products.id = $1";
  pool
    .query(queryDeleteProduct, [idProduct])
    .then(() =>
      res
        .status(200)
        .send({ message: `Product number ${idProduct} was deleted` })
    )
    .catch((e) => console.log(e));
};

exports.editProduct = (req, res) => {
  const storeId = req.user.id;
  const productId = req.params.productId;
  const {
    type,
    brand,
    category,
    description,
    unit,
    price,
    producer,
    origin,
    productImage,
  } = req.body;
  const query =
    "UPDATE products SET product_type = $1, brand = $2, category = $3, product_description = $4, unit = $5, price = $6, producer = $7, origin = $8, product_image=$9 WHERE id = $10";

  pool
    .query("SELECT store_id FROM products WHERE id = $1", [productId])
    .then((result) => {
      const dbStoreId = result.rows[0].store_id;
     
      if (dbStoreId === storeId) {
        pool
          .query(query, [
            type,
            brand,
            category,
            description,
            unit,
            price,
            producer,
            origin,
            productImage,
            productId,
          ])
          .then(() => {
            return res.send({ message: "your change was submitted" });
          })
          .catch((e) => console.log(e));
      } else {
        res.status(401).json({message:"you are not allowed to modify this product"})
      }
    })
    .catch((e)=>console.log(e));
};
