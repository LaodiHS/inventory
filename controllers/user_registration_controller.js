import { DB } from "../services/database_services.js";
import { file_system } from "../modules/file_system.js";
import { create_table } from "../modules/database_files.js";
import {salt_hash_password} from '../modules/crypt.js';

import {
  make_directory_paths,
  is_directory,
  write_file,
  is_file,
  readJSONFile,
  read_directory,
} from "../modules/file_system.js";


const { file_name } = file_system();
/**
 *
 * @dec adds a user into a users json file
 * @param { Object } res
 * @param { Object } req
 * @returns { Object } {code:201, message:{data:`${username} created`}}
 */
export async function user_registration_controller({
  first,

  last,

  age,

  email,

  username,

  password,

  housenumber,

  neighborhood,

  city,

  postcode,

  phone,

}) {



 
const {salt, hash} = salt_hash_password(password);


  try {

    await create_table("users", email, {
      
      first: first,

      last: last,

      age: age,

      email: email,

      username: username,

      password: password,

      salt: salt,

      hash: hash,

      housenumber: housenumber,

      neighborhood: neighborhood,

      city: city,

      postcode: postcode,

      phone:phone,

      created: Date.now(),
      
      id: Date.now(),

      expired:"0",

    });

    const file_path = `db/merchants/${email}/user/user.json`;
    const file_exists = await is_file(file_path);
    if(!file_exists){
      await make_directory_paths(file_path.split("/").slice(0, -1).join("/"));
    
    
      await write_file(file_path, JSON.stringify([{
          
          first: first,
    
          last: last,
    
          age: age,
    
          email: email,
    
          username: username,
    
          password: password,
    
          salt: salt,
    
          hash: hash,
    
          housenumber: housenumber,
    
          neighborhood: neighborhood,
    
          city: city,
    
          postcode: postcode,
    
          phone:phone,
    
          created: Date.now(),
          
          id: Date.now(),
    
          expired:"0",
    
        }]));
      }

    return {
      code:200,
      message:"user succesfully created"
    }

  } catch (error) {
    error_logging_service(
      error.status,

      {
        file_name: file_name,

        error: error,
      }
    );

    return {
      code: 401,

      message: {
        data: error,
      },
    };
  }
}
