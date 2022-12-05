import LocalStrategy from "passport-local";

import { is_valid } from "../modules/crypt.js";

import { get_record } from "./database_files.js";

export function initializePassport(passport) {

  const authenticateUser = async (email, password, done) => {

    try {
    
      const user_object = (await get_record("users", email)).pop();

      if (!user_object) {
        
        return done(null, false, {

          message: "Incorrect username or password",
        
        });
    
      }

      const valid = is_valid(user_object.hash, password, user_object.salt);

      if (!valid) {
    
        return done(null, false, { message: "no user with that email" });
    
      } else {
    
        return done(null, user_object);
    
      }
    
    } catch (err) {
    
      return done(err);
    
    }
  
  };

  passport.use(new LocalStrategy({ usernameField: "email" }, authenticateUser));

  passport.serializeUser((user, done) => {

    return done(null, user.email);
  
  });
  
  passport.deserializeUser( async (email, done) => {
    
    const user = await get_record("users", email);
    
    return done(null, user);

  });

}
