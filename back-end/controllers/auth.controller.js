const { pool } = require("../pool");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const secret = "proximity migracode";

//middlewares
exports.checkDuplicatedEmail = (req, res, next) => {
  const email = req.body.managerEmail;

  pool
    .query(
      "SELECT  manager_email FROM stores_authentications WHERE manager_email = $1",
      [email]
    )
    .then((result) => {
      if (result.rowCount !== 0) {
        console.log("dntro de if hay uno ya registrado")
         res.status(400).json({ messege: "Error! ya existe una cuenta vinculada a este email!",});
         return
      } else {
      next();}
    })
    .catch((error) => console.log(error));
};

// exports.veryfyJwt = (req, res, next) => {
//   let token = req.header("authorization");
//   token = token.split(" ")[1]; //separa "bearer" de  "token" y se queda con el segundo elemento
//   try {
//     const decodedToken = jwt.verify(token, secret);
//     req.user = decodedToken.user; //asigna al obj req la propiedad user que tiene la info del token
//     next();
//   } catch (err) {
//     res.status(401).json({ message: "Not authorized token!" });
//   }
// };
exports.veryfyJwt = (req, res, next) => {
  let token = req.header("authorization");
  console.log("token without split", token)
  token = token.split(" ")[1]; //separa "bearer" de  "token" y se queda con el segundo elemento
  if (!token) {
        return res.status(403).send({ message: "authorization denied", isAuthenticated: false });
      }
  console.log("token", token )
  try { 
    const decodedToken = jwt.verify(token, secret);
    req.user = decodedToken.user; //asigna al obj req la propiedad user que tiene la info del token
    res.status(202).send({message: "everything is fine", decodedToken: decodedToken.id })
    console.log('decodedToken', decodedToken)
    next();
  } catch (err) {
    res.status(401).json({ err, message: "Not authorized token!" });
  }
};
//Controllers
exports.register = (req, res) => {
  const newUser = req.body;
  console.log("newUser", req.body)
  const salt = bcrypt.genSaltSync(6)
  const encriptedPass = bcrypt.hashSync(newUser.password, salt);
  pool
    .query(
      "INSERT INTO stores_authentications ( store_manager, manager_email, password) VALUES ( $1, $2, $3)",
      [newUser.storeManager, newUser.managerEmail, encriptedPass]
    )
    .then(() => {
      pool
        .query(
          "SELECT id, store_manager FROM stores_authentications WHERE manager_email = $1", [newUser.managerEmail])
        .then((result)=>{
          console.log("result.rows[0]", result.rows[0])
          let token = jwt.sign({ id: result.rows[0].id }, secret, {
            expiresIn: 86400,
            
          });
          console.log("token", token)
          const data = { id: result.rows[0].id, name: result.rows[0].store_manager, token: token, isAuthenticated: true, message: "store user created!" };
          res.status(200).json(data)
          
              
        })
            .catch((error) => {
              console.log(error);
            });
    })
 
};

exports.logIn = (req, res) => {
  const user = req.body;
  pool
  .query("SELECT * FROM stores_authentications where manager_email = $1", [
    user.email
    ])
    .then((result) => {
      if (result.rows.length < 1) {
        return res.status(401).json({ "messege": "not valid email" });

      }
      const dbPassword = result.rows[0].password;
      const id = result.rows[0].id;
      const passwordIsValid = bcrypt.compareSync(user.password, dbPassword);
      console.log({passwordIsValid});
      if (dbPassword !== user.password) {
        return res.status(401).json({"messege":"not valid email or password"});
      } else {

        console.log("id: ", id);
        let token = jwt.sign({ id }, secret, {
          expiresIn: 86400,
        });
        return res
          .status(200)
          .json({id, token, "isAuthenticated": true});
      }
    });
  };
  
  exports.getNameAndEmail = (req, res) => {
    const userId = req.user.id
    pool
      .query(
        "SELECT store_manager, manager_email FROM stores_authentications WHERE id=$1",
        [userId]
      )
      .then((result) => {
        const data = result.rows[0];
        res.status(200).json(data);
      })
      .catch((error) => {
        console.log(error);
    });
};

exports.editAuthentications =  (req, res) =>{
  const userId = req.user.id
  const {storeManager, managerEmail} = req.body;

  pool.query("UPDATE stores_authentications SET store_manager=$1, manager_email=$2 where id=$3", [storeManager, managerEmail, userId])
  .then(()=>res.status(200).json({"messege":"manager's name and email updated"}))
  .catch(console.error())
}

exports.editPassword = (req, res) => {
  const userId = req.user.id;
  const {currentPassword, newPassword} = req.body;

  pool.query("SELECT password FROM stores_authentications WHERE id =$1", [userId])
  .then((result)=> {
    const dbPassword = result.rows[0].password;
    const passwordIsValid = bcrypt.compareSync(currentPassword, dbPassword);
    if(passwordIsValid){
      const encriptedPassword = bcrypt.hashSync(newPassword, 6)
      pool.query("UPDATE stores_authentications SET password=$1 WHERE id=$2", [encriptedPassword, userId])
      .then(() => {
        res.status(200).json({"messege": "password updated"})
      })
      .catch(console.error());      
    } else {
      res.status(401).json({"messege": "password is invalid"});
    }
  })
  .catch(console.error());
} 