import express from 'express';
import pino from 'pino';
import userFactory from './services/user/Factory.js';
import postFactory from './services/post/Factory.js';
import commentFactory from './services/comment/Factory.js';
import roleFactory from './services/role/Factory.js';
import appException from './utils/appException.js';
import constant from './utils/Constant.js';
import cryptic from './utils/cryptic.js';
import dotenv from 'dotenv';
import helmet from 'helmet';
dotenv.config();




const logger = pino();
if(process.env.BASE_URL){logger.warn('BASE_URL variable is not set');}
const baseUrl = process.env.BASE_URL || '/'



const app = express();
app.use(express.json())
app.use(express.urlencoded({ extended : true }))
app.use(helmet()); // for security

app.use(baseUrl, async (req, res, next) => {
    try {
        if(req.headers.authorization !== undefined) {
            req.user = await cryptic.verify(req.headers.authorization);
        }
        else if(req.query.authorization !== undefined) {
            req.user = await cryptic.verify(req.query.authorization);
        }
        else {
            req.user = {email : 'test@test.com', role : 0, isPublic : true};
        }
    } catch(err) {
        return next(new appException('InvalidToken'));
    }

    req.permit = (opName) => {logger.info('permit '+opName)} // operation checker is disabled for showcasing
    // req.permit = await roleFactory.getService().getPermitter();
    next();
});


app.use(baseUrl, await userFactory.getApp());

app.use(baseUrl, await postFactory.getApp());

app.use(baseUrl, await commentFactory.getApp());

app.use(baseUrl, await roleFactory.getApp());

// 404 handler
app.use("*", (req, res, next) => {
    return next(new appException(constant.EndpointMissing));
});

// error handler
app.use((err, req, res, next) => {
    var match = (new RegExp("SyntaxError: Unexpected token")).exec(String(err));
    if(match instanceof Array) {
        err = new appException({msg : 'json parsing error', code : 10, http : 400});
    }

    err = appException.fromError(err);
    delete err.cause;
    return res.status(err.getHttp()).json({success : false, error : err});
});

process.on('uncaughtException', (err) => {
    logger.error(err, 'unCaughtError')
})

app.listen(80);