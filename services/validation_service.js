/**
 * 
 * @returns customSanitizer
 */
export function customSanitizer() {

    return {

        "customSanitizer": {

            options: (value, { req, location, path }) => {

                if (req && location && path) {

                    return value.trim();

                }
            }
        }
    };
}


/**
 * 
 * @param { String } response_location;
 * @return { Object } Schema_object;
 */
export function response_location(response_location) {

    return { "in": [response_location] };

}

/**
 * 
 * @param {Int} min; minium number of characters required
 * @return { Object <Map <String, Array<Schema_Objects>>>>}; 
 */
export function isLength(min) {

    return {

        "isLength": {

            "options": {

                "min": min
            },

            errorMessage: `This url parameter is less than the required minimum of ${min} characters`

        }
    };
}

/**
 * 
 * @param { String } country_abbreviation; uppercase 
 * @returns { Object }; postal code Object
 */
export function isPostalCode(country_abbreviation) {

    return {

        "isPostalCode": {

            options: country_abbreviation

        }

    };
}


/**
 * 
 * @export
 * @param { String }; [["string-item","replace-with" ]] || [[" ", "-"]]
 * @return { Object }; rtrim Object 
 */
export function rtrim(map) {

    const options = JSON.parse(map);

    return {

        "rtrim": {

            options: options,

        }

    };

}
/**
 * 
 * @export
 * @return { Object } Email Validation Object 
 */
export function isEmail() {

    return {

        "isEmail": {

            bail: true

        }

    };

}

/**
 * 
 * @export
 * @return { Object } Exists Validation Object 
 */
export function exists() {

    return {

        "exists": {

            "errorMessage": "This required parameter does not exists",

            "option": true

        }

    };

}

/**
 * 
 * @export
 * @return { Object } Empty Validation Object 
 */
export function isEmpty() {

    return {

        "isEmpty": {

            "negated": true,

            "errorMessage": "This empty field parameter is required"

        }

    };

}

/**
 * 
 * @export
 * @return { Object } URL Validation Object 
 */
export function isURL() {

    return {

        "isURL": {

            "errorMessage": "This url parameter value is invalid"

        }

    };

}



const validation_elements = {

    in: (body) => response_location(body),

    isEmpty: () => isEmpty(),

    isURL: () => isURL(),

    exists: () => exists(),

    isLength: (len) => isLength(len),

    isEmail: () => isEmail()
};


/**
 * 
 * @dec whole body validation for many criteria.
 * @param { []<String> } param_array
 * @return { Object } response_code_schema_validation_object
 */
export function validation_parameters(param_array) {

    const schema_object = {};

    while (param_array.length) {

        const param_object = param_array.shift();

        for (const param_name in param_object) {

            schema_object[param_name] = {};

            for (const validator of param_object[param_name]) {

                Object.assign(schema_object[param_name], validator.includes("-") ?

                    validation_elements[validator.split("-").shift()](validator.split("-").pop()) :

                    validation_elements[validator]());

            }

        }

    }

    return schema_object;
    
}






