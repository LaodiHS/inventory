import { DB } from "../services/database_services.js";

import { error_logging_service } from "./error_logging_service.js";

import { file_system } from "../modules/file_system.js";

const  { file_name } = file_system();

/**
 * 
 * @param { String } api_name 
 * @param { Object } resulting_status_code 
 * @param { Object } data 
 * @returns { Boolean } 
 */
export async function api_logging(api_name, resulting_status_code, data ){

    try {
        
        await DB.get_table("logs");
        
        const id = DB.table.length;
        
        DB.table.push({ 
            
            api: api_name, 
            
            status: resulting_status_code,
            
            data: data, 
            
            date: Date.now(),
            
            id: id
        
        });
       
        const success = await DB.save();
       
        if (success) {
            
            return true;

        }
    
    } catch (errors) {
    
        error_logging_service( errors.code, 
      
            {
            
            file_name: file_name, 
            
            error: errors
          
            } );


        console.error({ 
            
            message: { 
            
                data: `${api_name} not logged` 
            
            }});
        
        return false;
    }


}


