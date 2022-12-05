import { DB } from "../services/database_services.js";
import { success, errors } from "../services/response_service.js";
import { error_logging_service } from "../services/error_logging_service.js";
import { file_system } from "../modules/file_system.js";

const { file_name } = file_system();
/**
 * 
 * @dec adds a user into a users json file
 * @param { Object } res 
 * @param { Object } req 
 * @returns { Object } {code:201, message:{data:`${username} created`}}
 */
export async function activity_stats_controller(req, res) {

  try {
    
  await DB.get_table("logs");

  const capturama_data =  DB.table.filter(file => file.api === "capturama")
  .map((record, id ) => { record.id= id; return record; } );

    const data = { 
    
        api : "capturama",

        "total_records" : capturama_data.length, 
        
        data : capturama_data 
    
      };

res.status(200).json(success("success", data, 200));

  } catch(error) {

    error_logging_service( error.status, 
      
      {
      
      file_name: file_name, 
      
      error: error
    
      } );

    res.status(500).json(errors("internal server error", 500));

  }

}


