import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import appException from './appException.js';
import bcrypt from 'bcrypt';
import pino from 'pino';

const logger = pino();

if(process.env.SALT_ROUNDS === undefined) {logger.warn('SALT_ROUNDS variable is not set');}
var rounds = Number(process.env.SALT_ROUNDS) || 10;
if(rounds > 10) {
    logger.warn('SALT_ROUNDS variable is too high, setting to 10');
    rounds = 10;
}

if(process.env.SIGNING_KEY === undefined){logger.warn('SIGNING_KEY variable is not set');}
var key = process.env.SIGNING_KEY || '.ljj2h43p8weryluKQUHEQKJQRGW;o12uilyiLi^zi*G1EUH2LUIdeui2bgjrhvKHSKUTYRY2ETFHEGHDIUYDATY2F1Y1O1HV984UILQYCC@rewrQRIUY!@ARSIOUOasQ2OEU OI189(*)sq2Q@$@$!@'


function generateHash(text) {
    return text;
    return new Promise((resolve, reject) => {
        bcrypt.hash(text, rounds, (err, hashText) => {
            if(err) {reject(err);}
            resolve(hashText);
        })
    });
}

function compareHash(text, textHash) {
    return text === textHash;
    return new Promise((resolve, reject) => {
        bcrypt.compare(text, textHash, (err, result) => {
            if(err) {reject(err);}
            resolve(result);
        })
    });
}

async function sign(data, options = null) {
    return new Promise((resolve, reject) => {
        jwt.sign(data, key, options || {}, (err, decoded) => {
            if(err){reject(err);}
            resolve(decoded);
        });
    });
}

async function verify(token, options = null) {
    return new Promise((resolve, reject) => {
        jwt.verify(token, key, options || {}, (err, decoded) => {
            if(err){reject(err);}
            resolve(decoded);
        });
    });
}


export default {generateHash, compareHash, sign, verify};

// let keyPairs = [];
// let secretArray = [];
// const genKeys = async () => {
//     var seed = process.env.ENCRYPTION_KEY_SEED || 'lkjaskldjl123120aofasjdkl12n3emnmdnaso1iahsklafafyilojbndjksdvbgandbkcc90;U:wiorytojbr2r';

//     for(let i = 0; i < constants.NoOfKeyPairs; i++) {
        
//         const rsa = new seedRsa(seed);
//         seed = rsa.rng.randomBytes(seed.length/2).toString('hex');
//         const keys = await rsa.generateNew(512);

//         keyPairs.push(keys);
//     }

//     seed = process.env.SIGNING_KEY_SEED || '9128ihka029p11ulkjnz,kcntyqp0ryo4u2thqo;iujrp999;rhqukfbjaHD97389rrgqklr219euioqhr';
//     for(let i = 0; i < constants.NoOfKeyPairs; i++) {

//         const rsa = new seedRsa(seed);
//         seed = rsa.rng.randomBytes(seed.length/2).toString('hex');

//         secretArray.push(seed);
//     }
// }



// // async function createToken(data, key, options) {
// //     if(data !== null && data !== undefined && data.iat !== undefined && data.exp !== undefined){throw new appException(errTy.Invalid, 'Data');}
// //     return await sign(data, key, options);
// // } 

// // async function decodeToken(token, key, options) {
// //     try{
// //         var body = await verify(token, key, options);
// //         delete body.iat;
// //         delete body.exp;
// //         return body;
// //     } catch(err){
// //         if(err instanceof appException){throw err;}
// //         if(err instanceof jwt.TokenExpiredError){throw new appException(errTy.Expired, 'Token');}
// //         if(err instanceof jwt.JsonWebTokenError){throw new appException(errTy.Invalid, 'Token');}
// //         throw new appException(errTy.Internal,  'DecodeToken', err);
// //     }
// // }


// // async function getEncryptedToken(data, expireMinutes = '10') {
// //     await genKeys();

// //     try{
// //         expireMinutes = _.toLength(expireMinutes).toString();
// //         if(expireMinutes.length > constants.tokenFillLength){throw new appException(errTy.Long, 'ExpireMinutes');}
    
// //         const no = crypto.randomInt(constants.NoOfKeyPairs);
// //         var token = await createToken(data, {key : keyPairs[no].privateKey}, {algorithm : 'RS256', expiresIn : expireMinutes + 'm'});
// //         token += '0'.repeat(constants.tokenFillLength - String(no).length) + String(no);
// //         return token;
// //     } catch(err){
// //         if(err instanceof appException){throw err;}
// //         throw new appException(errTy.Internal, 'GetEncrptedToken', err);
// //     }
// // }

// // async function getDecryptedBody(token) {
// //     await genKeys();

// //     try{
// //         const no = _.toLength(token.substring(token.length - constants.tokenFillLength));
// //         token = token.substring(0, token.length - constants.tokenFillLength);
// //         return await decodeToken(token,  keyPairs[no].publicKey, {algorithms : ['RS256']});
// //     } catch(err){
// //         if(err instanceof appException){throw err;}
// //         throw new appException(errTy.Internal, 'GetDecryptedBody', err);
// //     }
// // }

// // async function getServiceToken(data, expireMinutes = '10') {
// //     await genKeys();

// //     try{
// //         expireMinutes = _.toLength(expireMinutes).toString();
// //         if(expireMinutes.length > constants.tokenFillLength){throw new appException(errTy.Long, 'ExpireMinutes');}
    
// //         const no = crypto.randomInt(constants.NoOfKeyPairs);
// //         var token = await createToken(data, secretArray[no], {algorithm : 'HS256', expiresIn : expireMinutes + 'm'});
// //         token += '0'.repeat(constants.tokenFillLength - String(no).length) + String(no);
// //         return token;
// //     } catch(err){
// //         if(err instanceof appException){throw err;}
// //         throw new appException(errTy.Internal, 'GetEncrptedToken', err);
// //     }
// // }

// // async function getServiceBody(token) {
// //     await genKeys();

// //     try{
// //         const no = _.toLength(token.substring(token.length - constants.tokenFillLength));
// //         token = token.substring(0, token.length - constants.tokenFillLength);
// //         return await decodeToken(token,  secretArray[no], {algorithms : ['HS256']});
// //     } catch(err){
// //         if(err instanceof appException){throw err;}
// //         throw new appException(errTy.Internal, 'GetDecryptedBody', err);
// //     }
// // }

// // export default {generateHash, verifyPassword, getServiceToken, getServiceBody, getEncryptedToken, getDecryptedBody};