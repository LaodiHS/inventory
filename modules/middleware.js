import compression from "compression"

import express_session from "express-session"
import minify from "express-minify"

import passport from "passport"

import body_parser from "body-parser"
import cookie_parser from "cookie-parser"

import uglifyEs from "uglify-es"

import flash from 'express-flash'

import session from "express-session"
import cors from 'cors';

import {stripe} from './stripe.js';



export const middleware = {

compression, 

express_session,

minify,

passport: passport,

body_parser,

cookie_parser,

uglifyEs,

flash,
passport,
session,
cors,
stripe

};