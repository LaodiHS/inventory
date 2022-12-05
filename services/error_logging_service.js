import { file_append } from "../modules/file_system.js";

/**
 * @dec logs errors to a file
 * @param { String } error_type; status code | error code
 * @param { Object } data; req Object
 */
export async function error_logging_service(error_type, data) {

    try {
        
        await file_append("db/error_log.txt", 

        JSON.stringify(

        { 

        type : error_type,
     
        date :  new Intl.DateTimeFormat('en-US', { dateStyle: 'full', timeStyle: 'long' }).format(Date.now()),
        
        data : data
            
        }) + '\n', 
        
        {

            encoding : "utf8" 
        
        });

    } catch (error) {
        
        console.error(error);

        return false;

    }

    return true;

}




