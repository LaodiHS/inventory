import { DB } from "../services/database_services.js";
import { file_system } from "../modules/file_system.js";
import { create_table } from "../modules/database_files.js";
import {salt_hash_password} from '../modules/crypt.js'
const { file_name } = file_system();



export async function products_registration_controller({
    name,
  
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

try {

    await create_table(email, 'products', {
      
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