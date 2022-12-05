
import { buildCheckFunction, check } from "express-validator";

import { response } from "../services/response_service.js";

import { user_registration_controller } from "../controllers/user_registration_controller.js";

import { api_logging } from '../services/logging_services.js';

const checkBodyAndQuery: any = buildCheckFunction(['body', 'query']);

/**
 * @dec validate and sanitize with chaining. 
 * @returns { Object } validation Object
 */
export const register_user_validate =
    [
        check("first").exists().notEmpty().isLength({ min: 3 }).trim().escape(),
        
        check("last").exists().notEmpty().isLength({ min: 3 }).trim().escape(),

        check("email").exists().notEmpty().isEmail().normalizeEmail(),
    
        check("age").exists().notEmpty().isNumeric().trim().escape(),
    
        check("username").exists().notEmpty().escape().trim().toLowerCase().isLength({ min: 5 }),
    
        check("password").exists().isLength( { min: 8, max: 20 } ),

        check("housenumber").exists().notEmpty().isNumeric().trim().escape(),
        
        check("neighborhood").exists().notEmpty().trim().escape(),
        
        check("city").exists().notEmpty().trim().escape(),
        
        check("postcode").exists().notEmpty().trim().isNumeric().escape()
        
        
        
        

        

    ];

export async function register_user(req: any, res: any) {

    const { code, message } = await user_registration_controller(req.body);

    response(res, code, message.data);

}











