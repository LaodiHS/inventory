import axios from "axios";

import test from "simple-test-framework";

import { random_data_generator as generate } from "../modules/random_data_generator.js";

import { express_apps } from "../config.js";

const express_applications = express_apps();

const app = express_applications.get("app_");

// test("/gojos/metrics get valid table data", async (data_table) => {

//     try {

//        const response = await axios.get( `${app.name}${app.port}/gojos/metrics`);

//        const result = await response.data;

//        data_table.check(response.status === 200, "current status");

//        data_table.test("Test resulting data table belongs to capturama", (table_body) => {

//            table_body.check(result.msg === "success", "success message" );

//            const {api, total_records, data} = result.response;

//            table_body.check(api === 'capturama', "table name is correct")

//            table_body.finish();

//        });

//      let t_result =  data_table.finish();

//    } catch (error) {

//        console.log("error", error.response);

//    }

// })

// test("/gojos/metrics get valid table data", async (data_table) => {

//     try {

//        const response = await axios.get( `${app.name}${app.port}/gojos/metrics`);

//        const result = await response.data;

//        data_table.check(response.status === 200, "current status");

//        data_table.test("Test resulting data table belongs to capturama", (table_body) => {

//            table_body.check(result.msg === "success", "success message" );

//            const {api, total_records, data} = result.response;

//            table_body.check(api === 'capturama', "table name is correct")

//            table_body.finish();

//        });

//      let t_result =  data_table.finish();

//    } catch (error) {

//        console.log("error", error.response);

//    }

// })

// test("/gojos valid url in post body", async (url) => {

//     try {

//        const response = await axios.post( `${app.name}${app.port}/gojos` ,{ url: "https://www.dmcinfo.com/latest-thinking/blog/id/9852/multi-user-video-chat-with-webrtc" });

//        const result = await response.data;

//        url.check(response.status === 200);

//        url.test("Test result message is equal to success.", (image_response) => {

//            image_response.check(result.message === "success", "success message" );

//            image_response.finish();
//        })

//        url.finish();

//    } catch (error) {

//        console.log("error", error.response);

//    }

// })

// test("/gojos invalid url test 1x1 pixel 205.png and 200 status.", async (one_pixel) => {

//     try {

//        const response = await axios.post( `${app.name}${app.port}/gojos` ,{ url: generate.url("http") });

//        const result = await response.data;

//        one_pixel.check(response.status === 200);

//        one_pixel.test("Test result message is equal to success. and the resulting image is a 1x1 pixel, a 205.png file", (err_png) => {

//             err_png.check(result.message === "success", "success message" );

//             const { data } = result;
//             const {image_url} = data;
//             const file_location = image_url.pop();

//             const  file_name_routes = file_location.split("/");
//             const file_name = file_name_routes.pop();

//             err_png.check( file_name === "205.png" );

//             err_png.finish();

//        });

//         one_pixel.finish();

//    } catch (error) {

//         console.log("error", error.response);

//    }

// });

// test("/gojos/selector test valid body params post.", async (all_valid) => {

//      try {

//         const response = await axios.post( `${app.name}${app.port}/gojos/selector` ,{ url: "https://ourworldindata.org/world-population-growth", selector: ".article-titles" });

//         const result = await response.data;

//         all_valid.check(response.status === 200);

//         all_valid.test("Test result message is equal to success.", (body_response) => {

//           const {data} = result;

//             body_response.check(result.message === 'success', "success message" );

//             while(data.length){

//                 const file = data.pop();

//                 body_response.check( !file.includes('205.png'), `${file} is not a 205.png`);

//             }

//             body_response.finish();
//         });

//         all_valid.finish();

//     } catch (error) {

//         console.log("error", error.response);

//     }

// });

// test("/gojos/selector test body parameter validation",
// /**
//  *
//  * @param {Object} validation Detailed client response on errors.
//  */

// async (validation) => {

//   const app = express_applications.get("app_");

// validation.test("Test missing selector param", async (selector) => {

//         try {

//             await axios.post(`${app.name}${app.port}/gojos/selector`, { url: generate.url("http") });

//        } catch (error) {

//         const response = error.response;

//             selector.check(response.status === 400, "A status of 400");

//             selector.check(response.statusText === "Bad Request", "A Status Text of Bad Request");

//             selector.test("test the data object for the correct fields", (field) =>{

//                 const data = response.data;

//             field.check(data.message === "bad_request","A message of bad_request");

//                 field.test("test missing field request", (error_response) => {

//                     const errors = data.errors;

//                     error_response.check(errors.length === 3, "The number of errors" );

//                     error_response.check(
//                         Boolean(
//                             errors.find(result => result.msg === "This required parameter does not exists" && result.param === "selector" && result.location === "body")),
//                             "does not exist error");

//                     error_response.check(

//                         Boolean(
//                             errors.find(result => result.msg === "This empty field parameter is required" && result.param === "selector"  && result.location === "body")), "Empty field error");

//                     error_response.check(
//                         Boolean(
//                             errors.find(result => result.msg === "This url parameter is less than the required minimum of 5 characters"  && result.param === "selector"  && result.location === "body")),"The min number of characters, error");

//                     error_response.finish();

//             });

//             field.finish();

//         });

//     selector.finish();

//        }

//     });

// validation.test("/gojos/selector post errors with empty selector parameter", async (empty_selector) => {

//         try {

//             await axios.post(`${app.name}${app.port}/gojos/selector`, { url: generate.url("http"), selector:"" });

//        } catch (error) {

//         const response = error.response;

//             empty_selector.check(response.status === 400, "A status of 400");

//             empty_selector.check(response.statusText === "Bad Request", "A Status Text of Bad Request");

//             empty_selector.test("Test the data object for the correct fields", (field) => {

//             const data = response.data;

//             field.check(data.message === "bad_request","A message of bad_request");

//                 field.test("test missing field request", (field_body) => {

//                     const errors = data.errors;

//                     field_body.check(errors.length === 2, "The number of errors" );

//                     field_body.check(

//                         Boolean(
//                             errors.find(result => result.msg === "This empty field parameter is required" && result.param === "selector"  && result.location === "body")
//                             ), "Empty field error" );

//                     field_body.check(
//                         Boolean(
//                             errors.find(result => result.msg === "This url parameter is less than the required minimum of 5 characters"  && result.param === "selector"  && result.location === "body")
//                             ), "The min number of characters, error" );

//                     field_body.finish();

//             });

//             field.finish();

//         });

//         empty_selector.finish();

//        }

//     });

//     validation.test("/gojos/selector errors with min number of characters ", async (min_character_check) => {

//         try {

//             await axios.post(`${app.name}${app.port}/gojos/selector`, { url: generate.url("http"), selector:`#${generate.word(1,3)}`});

//        } catch (error) {

//             const response = error.response;

//             min_character_check.check(response.status === 400, "A status of 400");

//             min_character_check.check(response.statusText === "Bad Request", "A Status Text of Bad Request");

//             min_character_check.test("test the data object for the correct fields", (field) => {

//             const data = response.data;

//             field.check(data.message === "bad_request","A message of bad_request");

//                 field.test("test missing field request", (field_body) => {

//                     const errors = data.errors;

//                     field_body.check(errors.length === 1, "The number of errors" );

//                     field_body.check(
//                         Boolean(
//                             errors.find(result =>

//                                 result.msg === "This url parameter is less than the required minimum of 5 characters" && result.param === "selector"  && result.location === "body")), "The min number of characters, error");

//                                 field_body.finish();

//             });

//             field.finish();

//         });

//     min_character_check.finish();

//        }

//     });

// validation.finish();

// });
//remove test prior to pushing
test("/register non detailed response check", /**
 *
 * @param {Object} user_register Test Object for tests without a detailed response to the client on the errors.
 */
async (user_register) => {
  const email = generate.email()
  const password= generate.word(7, 10)
  try {
    const response = await axios.post(`${app.name}${app.port}/register`, {
      email: email,
      username: generate.word(5, 9),
      age: generate.integer(25, 45),
      first: generate.first(),
      last: generate.last(),
      password: password,
      housenumber: generate.integer(25, 45),
      city: generate.word(5, 9),
      neighborhood: generate.word(5, 9),
      postcode: generate.integer(90210, 92675),
    });

    const result = await response.data;

    const login = await axios.post(`${app.name}${app.port}/login`, {
    email:email,password:password
    }
    )
    const log= await login.data

    // console.log(log)
    user_register.check(response.status === 201);

    user_register.test(
      "response message is equal to success",
      (post_register_response) => {
        post_register_response.finish();
      }
    );

    user_register.finish();
  } catch (error) {
    console.log("error", error.response);
  }
});
