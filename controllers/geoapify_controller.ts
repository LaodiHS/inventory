import axios from 'axios';
import * as dot from 'dotenv';
import { error_logging_service } from "../services/error_logging_service.js";

import { file_system } from '../modules/file_system.js';
import { Address } from '../views/geoapify.js'
import test from "simple-test-framework";
import { STATUS_CODES } from 'http';

const { GEOAPIFY }: any = dot.config().parsed;


export interface AxiosError { statusCode: number, error: string, message: string };

export interface ResponseData {

    country_code: string,
    housenumber: string,
    street: string,
    country: string,

    datasource: {

        sourcename: string,
        attribution: string,
        license: string,
        url: string

    },

    state: string,
    city: string,
    district: string,
    suburb: string,
    county: string,
    lon: number,
    lat: number,
    state_code: string,
    postcode: string,
    formatted: string,
    address_line1: string,
    address_line2: string,
    result_type: string,

    rank: {

        popularity: string,
        confidence: number,
        confidence_city_level: number,
        confidence_street_level: number,
        match_type: string

    },

    place_id: string

};

export interface Response {
    results: {

        country_code: string,
        housenumber: string,
        street: string,
        country: string,

        datasource: {

            sourcename: string,
            attribution: string,
            license: string,
            url: string

        },

        state: string,
        city: string,
        district: string,
        suburb: string,
        county: string,
        lon: number,
        lat: number,
        state_code: string,
        postcode: string,
        formatted: string,
        address_line1: string,
        address_line2: string,
        result_type: string,

        rank: {

            popularity: string,
            confidence: number,
            confidence_city_level: number,
            confidence_street_level: number,
            match_type: string

        },

        place_id: string

    }[],

    query: {

        text: string,

        parsed: {

            house: string,
            housenumber: string,
            street: string,
            postcode: string,
            city: string,
            state: string,
            country: string,
            expected_type: string

        }

    }

};




export async function check_address(body: { housenumber: string, street: string, postcode: string, city: string, limit: string }): Promise<{ status: number, data: ResponseData[] | AxiosError }> {

    const { housenumber, street, postcode: postcode, city } = body;

    try {

        const response = await axios.get(`https://api.geoapify.com/v1/geocode/search?housenumber=${encodeURIComponent(housenumber)}&street=${encodeURIComponent(street)}&postcode=${encodeURIComponent(postcode)}&city=${encodeURIComponent(city)}&limit=4&format=json&&apiKey=${GEOAPIFY}`);

        const data: Response = await response.data;

        const { results }: { results: ResponseData[] } = data;

        return { status: response.status, data: results };


    } catch (error: any) {

        const { file_name }: { file_name: string } = file_system();

        const { code, response }: { code: string, response: any } = error;

        const { status, data }: { status: number, data: AxiosError } = response;

        error_logging_service(code,

            {
                file_name,
                error

            });

        return { status, data: data };

    }

}
export async function check_address_text_search(text: string): Promise<{ status: number, data: ResponseData[] | AxiosError }> {
    try {
        const response = await axios.get(`https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(text)}&limit=4&format=json&&apiKey=${GEOAPIFY}`);
        
        const data: Response = await response.data;

        const { results }: { results: ResponseData[] } = data;

        return { status: response.status, data: results };


    } catch (error: any) {

        const { file_name }: { file_name: string } = file_system();

        const { code, response }: { code: string, response: any } = error;

        const { status, data }: { status: number, data: AxiosError } = response;

        error_logging_service(code,

            {
                file_name,
                error

            });

        return { status, data: data };

    }

}

export async function request_address_check(address: Address): Promise<{ status: number, data: ResponseData[] | AxiosError }> {

    return await check_address(address)

}


/**
 * test end point dynamic_routes/dynamic_routes.ts -> views/geoapify.ts -> geoapify_controller.ts
 */
export async function geoapify() {

    test('check_address', (tests: any) => {

        tests("address: house 24882, street: branch, postcode: 92630, city: lake forest, limit:5", async (tests: any) => {

            const body = { housenumber: "24882", street: "branch", postcode: "92630", city: "lake forest", limit: "5" };

            const response = await check_address(body);

            const { status, data }: { status: number, data: ResponseData[] | AxiosError } = response;

            console.log(status);

            console.log(data);


        })

    })

}