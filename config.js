import dot from "dotenv";
/**
 * 
 * @returns {Map<String, Number>} name, port
 */
export const database_tables = ["users", "logs"];


let name = 'https://inventory2.onrender.com';
if(process.env.PORT){
    name = 'https://inventory2.onrender.com'
}


export const pivot_server = {
    //http://192.168.1.64:8080
    name, 

    port:9000
};

export function express_apps() {

    const env = dot.config().parsed;

 const port = process.env.PORT || env.Port || 8080;
   

    const express_apps = new Map([ 
        [ "app_", 
        { 
        name,
         
        port : (port || 8080)

        } 
        ]  
    ]);

    return express_apps;

}

