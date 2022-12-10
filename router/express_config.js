import express from "express";

import { create } from "express-handlebars";

import { middleware } from "../modules/middleware.js";
import { file_system } from "../modules/file_system.js";
import { initializePassport } from "../modules/passport_config.js";
import { get_record } from "../modules/database_files.js";
import session from 'cookie-session';
import {
  checkAuthenticated,
  checkNotAuthenticated,
} from "./dynamic_routes/dynamic_routes.js";
const { join, root_dir } = file_system();
/**
 *
 * @export
 * @param { Object } app; express server instance
 */

const allowedOrigins = [
  'capacitor://localhost',
  'ionic://localhost',
  'http://localhost',
  'http://localhost:8080',
  'http://localhost:8100'
]
export default async function express_configuration(app) {


  app.use(middleware.cookie_parser());

  app.use(middleware.cors({ credentials: true ,     sameSite: 'lax', origin:(origin, callback) => {

if(allowedOrigins.includes(origin)){
  callback(null, true);

}else{
  callback(new Error('Origin not allowed by Cors'));
}

  }, 'methods':  'GET,HEAD,PUT,PATCH,POST,DELETE'}));

  // app.use(function(req, res, next) {
  //   res.header("Access-Control-Allow-Origin", "http://localhost"); // update to match the domain you will make the request from
  //   res.header("Vary", "Origin")
  //   res.header("Access-Control-Allow-Headers", "Accept");
  //   res.header("Access-Control-Allow-Credentials", "true");

  //   next();
  // });

  app.use(express.json());
  // function logResponseBody(req, res, next) {
  //   var oldWrite = res.write,
  //       oldEnd = res.end;

  //   var chunks = [];

  //   res.write = function (chunk) {
  //     chunks.push(chunk);

  //     return oldWrite.apply(res, arguments);
  //   };

  //   res.end = function (chunk) {
  //     if (chunk)
  //       chunks.push(chunk);

  //     var body = Buffer.concat(chunks).toString('utf8');
  //     console.log(req.path, body);

  //     oldEnd.apply(res, arguments);
  //   };

  //   next();
  // }

  // app.use(logResponseBody);
  app.use(middleware.compression());

  app.use(
    middleware.minify({
      cache: join(root_dir, "cache"),
      uglifyJsModule: middleware.uglifyEs,
      errorHandler: (errorInfo) => {
        //console.log("minfify error", errorInfo);
      },
      jsMatch: /javascript/,
      cssMatch: /css/,
      jsonMatch: /json/,
      sassMatch: /scss/,
      lessMatch: /less/,
      stylusMatch: /stylus/,
      coffeeScriptMatch: /coffeescript/,
    })
  );

  app.use(middleware.body_parser.urlencoded({ extended: true }));

  const hbs = create({
    /* config */
  });

  initializePassport(
    middleware.passport,
    async (email) => (await get_record("users", email)).find(email),
    async (email) => (await get_record("users", email)).find(email)
  );

  // const store = new middleware.express_session.MemoryStore();
  app.use(
    middleware.express_session
    //session
    ({
      secret: "secret123",
      // resave: true,
     //secure: false,
      //httpOnly:false,
      saveUninitialized: true,
      sameSite: 'lax',
       cookie: {
       SameSite: "None",
     },
      // store,
    })
  );

  app.use(middleware.passport.initialize());
  app.use(middleware.passport.session());

  app.use(middleware.flash());
  app.engine("handlebars", hbs.engine);

  app.enable("view cache");

  app.set("view engine", "handlebars");

  app.set("views", "./templates");

  app.post(
    "/login",
    middleware.passport.authenticate("local", {
      successRedirect: "/tabs",

      failureRedirect: "/authenticated",
      failureFlash: true,
    })
  );
}
