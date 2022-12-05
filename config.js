import dot from "dotenv";
/**
 * 
 * @returns {Map<String, Number>} name, port
 */
export const database_tables = ["users", "logs"];

export const pivot_server = {
    //http://192.168.1.64:8080
    name:"http://192.168.1.64:", 

    port:9000
};

export function express_apps() {

    const env = dot.config().parsed;

    const port = process.env.PORT || env.Port || 8080;

    const express_apps = new Map([ 
        [ "app_", 
        { 
        name: "http://192.168.1.64:",
         
        port : (port || 8080)

        } 
        ]  
    ]);

    return express_apps;

}

