import { validationResult } from "express-validator";

import { error_logging_service } from "./error_logging_service.js";

export const capturama_status_codes = {

    200: "success",
    
    205: "dynamic size selector on page found",
    
    400: "request is too large",
    
    500: "internal server error",
    
    504: "capture did not load in time"
    
    };

export const validation_codes = { 

    200: "ok",
    
    201: "ok_created",
    
    202: "accepted",
    
    304: "not_modified",
    
    400: "bad_request",
    
    401: "unauthorized",
    
    500: "internal_server_err"
    
    };


/**
 *
 * @desc Send success response
 * @export
 * @param { String } msg;
 * @param { Object <Array> } data;
 * @param { Number } status;
 * @return {Object} success Object;
 */
 export function success(msg, data, status) {

    return {

        msg: msg,

        error: false,

        code: status,

         response:data

    }
};


/**
 *
 * @desc send error response
 * @export
 * @param { String } msg;
 * @param { Number } status;
 * @return { Object <String, Number ,Boolean> }; error
 */
 export function errors(msg, status) {

    const codes = [ 401, 404, 403, 422, 500];

    let code;

    while (codes.length) {
    
        code = codes.pop();
    
        if (code === status) break;
    
    }
    
    code = code || 500;

    return {
    
        msg: msg,
    
        code: code,
    
        error: true
    };

} 

/**
 * 
 * @param { Number } status_code status code
 * @param { Object } data data object 
 * @returns 
 */
 export async function capturama_response(res, status_code, data){
  
    const response_code = capturama_status_codes[status_code];
    

    try {

        if (response_code) {

            return res.status(status_code).json({ message: capturama_status_codes[status_code], data: data });
           
        }

            throw new Error({ type: "no_code", date: Date.now(), request: req });


    } catch (error) {

        try {

            await error_logging_service(error.type, error.date, error.request);

        } catch (error) {

            console.error(error);

        }

    }

}

/**
 *
 *
 * @export
 * @param { Object } req; request Object
 * @param { Object } res; response Object
 * @param { String } status_code; named status code
 * @param { Object | Array } data; success | error
 */
export async function response(res, status_code, data) {

    try {

        if (validation_codes[status_code]) {

            return res.status(status_code).json({ message: validation_codes[status_code], data: data });

        }

            throw new Error({ type: "no_code", date: Date.now(), request: req });

    } catch (error) {

        try {

            await error_logging_service(error.type, error.date, error.request);

        } catch (error) {

            console.log(error);

        }

    }

}

/**
 * 
 * @param { Object } req; 
 * @param { Object } res;
 * @param { Object } next; 
 * @returns 
 */
export function validate(req, res, next) {

    try {
    
        validationResult(req).throw();

     if(next){

       return next();

     }

    } catch (errors) {

        return res.status(400).json({message:validation_codes[400], errors: errors.array() });

    }

}

export class GeneralError extends Error {
/**
 * 
 * 
 * @param { String } message; 
 */
    constructor(message){

        super();

        this.message = message;
    }

    getCode(){

        if(this instanceof BadRequest){
            
            return 400;

        }if(this instanceof NotFound){
            
            return 404;

        }
        
        return 500;
    }

}

export class BadRequest extends GeneralError{}
export class NotFound extends GeneralError{}

export const handleErrors = (err,req, res, next) => {

    if(err instanceof GeneralError){

        return res.status(err.getCode()).json({
            
            status:"error",
            
            message:err.message
        
        });
        
    }

    return res.status(500).json({

        status:"error",
        
        message: err.message
        
    });

};


