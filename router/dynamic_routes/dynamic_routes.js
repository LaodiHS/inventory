import { checkSchema } from "express-validator";

import { validate } from "../../services/response_service.js";

import { gojos, gojos_selector, gojos_metrics } from "../../views/gojos.js";
import { register_user_validate, register_user } from "../../views/register.js";
import {join} from 'path';
import fs from 'fs';
import { valid_address } from "../../views/geoapify.js";
import { middleware } from "../../modules/middleware.js";
import { call_upc_database } from "../../controllers/call_upc_database.js";
import { write_to_inventory } from "../../controllers/write_to_inventory.js";
import { products } from "../../controllers/products.js";
import multer  from "multer";
import {
  make_directory_paths,
  is_directory,
  write_file,
  is_file,
  readJSONFile,
  read_directory,
} from "../../modules/file_system.js";
import Busboy from 'busboy';
export function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
    //res.status(200).send("authenticated");
  }
  // res.status(200).send("not authenticated");
  res.redirect("/login");
}

export function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    res.redirect("/");
  }
  next();
}
/**
 * if gojos interface becomes large enough split into a gojos route file
 * same applies for registration
 * @param {Object} app client Object
 */
export async function dynamic_routes(app) {

  app.get("/", (req, res, next) => {
    res.status(200).send(JSON.stringify(req));
    //  res.render('home');
  });

  app.get("/tabs", (req, res, next) => {
    console.log(res);
    res.status(200).send("login success");
    // console.log('authenticated:',req.isAuthenticated())
    //  res.render('home');
  });

  app.post("/gojos", checkSchema(gojos.validate), validate, gojos.handel);

  app.post(
    "/gojos/selector",
    checkSchema(gojos_selector.validate),
    validate,
    gojos_selector.handel
  );

  app.get("/gojos/metrics", gojos_metrics.handel);

  app.post(
    "/geoapify",
    checkSchema(valid_address.validate),
    validate,
    valid_address.handel
  );

  app.post("/register", register_user_validate, validate, register_user);

  app.post("/authenticated", (req, res) => {
    // console.log(req.isAuthenticated());
    if(req.user && req.user[0]){
    const { first, last, age, username, email, phone, postcode, city, housenumber } = req.user[0]
    if (req.isAuthenticated()) {
      res.status(200).json({first, last, age, username, email, phone, postcode, city, housenumber});
    } else {
      res.status(400).send("unauthenticated");
    }
  }else{
     res.status(400).send("unauthenticated");
  }
  });

  const calculateOrderAmount = (items) => {
    // Replace this constant with a calculation of the order's amount
    // Calculate the order total on the server to prevent
    // people from directly manipulating the amount on the client
    return 1400;
  };

  app.post("/create-payment-intent", async (req, res) => {
    const { items } = req.body;

    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await middleware.stripe.paymentIntents.create({
      amount: calculateOrderAmount(items),
      currency: "usd",
      automatic_payment_methods: {
        enabled: true,
      },
    });

    res.send({
      clientSecret: paymentIntent.client_secret,
    });
  });

  app.get("/user", checkAuthenticated, async (req, res) => {
    const { first, last, email, salt } = req.user[0];
    try {
      const user = await readJSONFile(`db/merchants/${email}/user/user.json`);

      res.status(200).json(user[user.length-1]);
    } catch (error) {
      console.log('aythenticated', error);
    }
  });

  app.post("/upc", checkAuthenticated, call_upc_database);

  app.post("/post_product", checkAuthenticated, write_to_inventory);

  app.post("/product", checkAuthenticated, products);




  const upload_multer_object = multer({
    limits: { fileSize: 10000000 },

    fileFilter(req, file, cb) {
      console.log(file)
      // if (!file.originalname.match(/\.(image_extensions.join("|"))$/)) {
      //   return;

      //   cb(new Error("Please upload a valid image file"));
      // }

      cb(undefined, true);
    },
  });




app.post("/post_image", checkAuthenticated, (req, res, next) => {
  if(req.user[0]){
  const { first, last, email, salt } = req.user[0];
  var busboy = Busboy({ headers: req.headers });
  busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
    var saveTo = join('.', `db/${email}/images/${filename.filename}.${filename.mimeType.split('/').pop() }`);
    console.log('Uploading: ' + saveTo);
    file.pipe(fs.createWriteStream(saveTo));
  });
  busboy.on('finish', function() {
    console.log('Upload complete');
    res.writeHead(200, { 'Connection': 'close' });
    res.end("That's all folks!");
  });
  return req.pipe(busboy);
  }
});

}
