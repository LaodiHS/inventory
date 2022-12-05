import axios from 'axios';
import test from 'simple-test-framework';

import { random_data_generator as generate } from '../modules/random_data_generator.js'

const generator_map = {
    
    'email': generate.email(),
    
    'username': generate.email().split("@").shift(),
    
    'age': generate.integer(1, 100),
    
    'password': generate.word(5, 10),
    
    'name': generate.first(),
    
    'first_name': generate.first(),
    
    'last_name': generate.last()

}



function* generate_body_params(params) {
    
    const body = {};

    yield JSON.stringify(body)

    while (params.length) {

        const param = params.shift();

        body[param] = "";

        yield JSON.stringify(body);

        body[param] = generator_map[param]

        yield JSON.stringify(body);
    }
}





const generate_in_sequence = generate_body_params(['email', 'username', 'age', 'name', 'password'])

async function parameter_test() {

    test('Test selector error parameter', async (selector_param_test) => {

        const app = express_applications.get("app_");

        selector_param_test.test("Test post api errors with missing selector", async (axios_post_api) => {

            try {

                await axios.post(`${app.name}${app.port}/api`, generate_in_sequence());

            } catch (error) {

                const response = error.response;

                axios_post_api.check(response.status === 400, 'A status of 400');

                axios_post_api.check(response.statusText === 'Bad Request', 'A Status Text of Bad Request');

                axios_post_api.test("test the data object for the correct fields", (post_api_data_response) => {

                    const data = response.data;

                    post_api_data_response.check(data.message === "bad_request", 'A message of bad_request');

                    post_api_data_response.test("test missing field request", (post_api_error_response) => {

                        const errors = data.errors;

                        post_api_error_response.check(errors.length === 3, 'The number of errors');

                        post_api_error_response.check(
                            Boolean(
                                errors.find(result => result.msg === 'This required parameter does not exists' && result.param === 'selector' && result.location === 'body')
                            ),
                            'does not exist error'
                        );

                        post_api_error_response.check(

                            Boolean(
                                errors.find(result => result.msg === 'This empty field parameter is required' && result.param === 'selector' && result.location === 'body')
                            ),
                            "Empty field error"
                        )

                        post_api_error_response.check(
                            Boolean(
                                errors.find(result => result.msg === 'This url parameter is less than the required minimum of 5 characters' && result.param === 'selector' && result.location === 'body')
                            ),
                            'The min number of characters, error'
                        );

                        post_api_error_response.finish();

                    })

                    post_api_data_response.finish();

                })

                axios_post_api.finish();

            }

        });


        selector_param_test.test("Test post api errors with empty selector parameter", async (axios_post_api) => {



            try {

                await axios.post(`${app.name}${app.port}/api`, { url: "http://youtube.com", selector: "" });

            } catch (error) {


                const response = error.response;

                axios_post_api.check(response.status === 400, 'A status of 400');

                axios_post_api.check(response.statusText === 'Bad Request', 'A Status Text of Bad Request');


                axios_post_api.test("test the data object for the correct fields", (post_api_data_response) => {

                    const data = response.data;

                    post_api_data_response.check(data.message === "bad_request", 'A message of bad_request');

                    post_api_data_response.test("test missing field request", (post_api_error_response) => {

                        const errors = data.errors;

                        post_api_error_response.check(errors.length === 2, 'The number of errors');


                        post_api_error_response.check(

                            Boolean(
                                errors.find(result => result.msg === 'This empty field parameter is required' && result.param === 'selector' && result.location === 'body')
                            ),
                            "Empty field error"
                        )

                        post_api_error_response.check(
                            Boolean(
                                errors.find(result => result.msg === 'This url parameter is less than the required minimum of 5 characters' && result.param === 'selector' && result.location === 'body')
                            ),
                            'The min number of characters, error'
                        );

                        post_api_error_response.finish();

                    })

                    post_api_data_response.finish();

                })

                axios_post_api.finish();

            }

        });


        selector_param_test.test("Test post api errors with min number of characters on the selector parameter", async (axios_post_api) => {



            try {

                await axios.post(`${app.name}${app.port}/api`, { url: "http://youtube.com", selector: "1234" });

            } catch (error) {


                const response = error.response;

                axios_post_api.check(response.status === 400, 'A status of 400');

                axios_post_api.check(response.statusText === 'Bad Request', 'A Status Text of Bad Request');


                axios_post_api.test("test the data object for the correct fields", (post_api_data_response) => {

                    const data = response.data;

                    post_api_data_response.check(data.message === "bad_request", 'A message of bad_request');

                    post_api_data_response.test("test missing field request", (post_api_error_response) => {

                        const errors = data.errors;

                        post_api_error_response.check(errors.length === 1, 'The number of errors');


                        post_api_error_response.check(
                            Boolean(
                                errors.find(result => result.msg === 'This url parameter is less than the required minimum of 5 characters' && result.param === 'selector' && result.location === 'body')
                            ),
                            'The min number of characters, error'
                        );

                        post_api_error_response.finish();

                    })

                    post_api_data_response.finish();

                })

                axios_post_api.finish();

            }

        });

        selector_param_test.finish()


    })
}