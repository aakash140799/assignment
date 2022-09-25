import { ValidationError, ConnectionError, DatabaseError, UniqueConstraintError, ForeignKeyConstraintError } from "sequelize";
import Constant from "./Constant.js";
class appException extends Error {

    // constructor(type, cause = null) {
    //     super(type);
    //     switch(type)
    //     {
    //         case 'ConnFailed':
    //             this.msg = 'connection to database failed';
    //             this.code = 100;
    //             this.cause = cause;
    //             this.isInternal = true;
    //             break;

    //         case 'NullValue':
    //             this.msg = 'null value found';
    //             this.code = 101;
    //             this.cause = cause;
    //             this.isInternal = true;
    //             break;

    //         case 'ItemNotFound':
    //             this.msg = 'given item don"t exists';
    //             this.code = 102;
    //             this.cause = cause;
    //             this.isInternal = false;
    //             break;

    //         case 'InvalidPageNo':
    //             this.msg = 'pageno must be number greater than or equal to one';
    //             this.code = 103;
    //             this.cause = cause;
    //             this.isInternal = false;
    //             break;

    //         case 'InvalidCount':
    //             this.msg = 'pageno must be number greater than zero';
    //             this.code = 104;
    //             this.cause = cause;
    //             this.isInternal = false;
    //             break;

    //         case 'InvalidArgument':
    //             this.msg = 'function argument is invalid';
    //             this.code = 105;
    //             this.cause = cause;
    //             this.isInternal = true;
    //             break;

    //         case 'EntityFailed':
    //             this.msg = 'entity creation failed';
    //             this.code = 106;
    //             this.cause = cause;
    //             this.isInternal = true;
    //             break;

    //         case 'UserNotFound':
    //             this.msg = 'user does not exists';
    //             this.code = 107;
    //             this.cause = cause;
    //             this.isInternal = false;
    //             break;

    //         case 'UserAuthFailed':
    //             this.msg = 'user authentication failed';
    //             this.code = 108;
    //             this.cause = cause;
    //             this.isInternal = false;
    //             break;

    //         case 'RedisConnFailed':
    //             this.msg = 'redis connection failed';
    //             this.code = 109;
    //             this.cause = cause;
    //             this.isInternal = true;
    //             break;

    //         case 'role notNull Violation' : 
    //             this.msg = 'role attribute is needed';
    //             this.code = 110;
    //             this.cause = cause;
    //             this.isInternal = true;
    //             break;

    //         case 'InvalidEmail' : 
    //             this.msg = 'email is invalid';
    //             this.code = 111;
    //             this.cause = cause;
    //             this.isInternal = false;
    //             break;

    //         case 'EntityNotFound':
    //             this.msg = 'not found error';
    //             this.code = 112;
    //             this.cause = cause;
    //             this.isInternal = false;
    //             break;

    //         case 'password string violation':
    //             this.msg = 'password must be a string';
    //             this.code = 113;
    //             this.cause = cause;
    //             this.isInternal = false;
    //             break;

    //         case 'InvalidData':
    //             this.msg = 'data is invalid, check docs';
    //             this.code = 114;
    //             this.cause = cause;
    //             this.isInternal = false;
    //             break;

    //         case 'MissingData':
    //             this.msg = 'data field is required, check docs';
    //             this.code = 115;
    //             this.cause = cause;
    //             this.isInternal = false;
    //             break;

    //         case 'MissingPassword':
    //             this.msg = 'password field is required, check docs';
    //             this.code = 116;
    //             this.cause = cause;
    //             this.isInternal = false;
    //             break;

    //         case 'NotAuthorized':
    //             this.msg = "you don't have permission to perform this operation, contact admin";
    //             this.code = 117;
    //             this.cause = cause;
    //             this.isInternal = false;
    //             break;

    //         case 'InvalidToken':
    //             this.msg = 'authorization token is invalid, pls login again';
    //             this.code = 118;
    //             this.cause = cause;
    //             this.isInternal = false;
    //             break;

    //         case 'Here':
    //             this.msg = 'I am here ;)';
    //             this.code = 1000;
    //             this.cause = cause;
    //             this.isInternal = true;
    //             break;

               
    //         case 'Dev':
    //             this.msg = String(cause);
    //             this.code = 1001;
    //             this.cause = cause;
    //             this.isInternal = true;
    //             break;

            

    //         default:
    //             console.log('type = ', type)
    //             throw new Error('Invalid error type argument');
    //     }
    // }

    // static fromError(err) {
    //     if(err instanceof ValidationError) {
    //         err = err['errors'][0];
    //         if(err['type'] == 'Validation error') {
    //             return new appException(err['message'], err);
    //         }
    //         return new appException(err['path'] + ' ' + err['type'], err)
    //     }
    //     if(err instanceof DatabaseError) {
    //         var reg = new RegExp("invalid input syntax for type uuid", "i");
    //         if(reg.exec(err['parent']) != null) {
    //             return new appException('EntityNotFound', err);
    //         }
    //     }
    //     if(err instanceof appException) {
    //         return err;
    //     }
    //     return new appException('Dev', err)
    // }

    constructor(data, cause) {
        super(data.msg);
        this.msg = data.msg;
        this.http = data.http;
        this.code = data.code;
        this.cause = cause;
    }

    getMsg() {
        return this.msg;
    }

    getHttp() {
        return this.http;
    }

    getCode() {
        return this.code;
    }

    getCause() {
        return this.cause;
    }

    static fromError(err) {
        if(err instanceof appException) {
            return err;
        }
        if(err instanceof DatabaseError) {
            if((new RegExp("invalid input syntax for type uuid", "i")).exec(err['parent']) != null) {return new appException({msg : 'data not found', http : 404, code : 3}, err);}
        }
        if(err instanceof ForeignKeyConstraintError) {
            console.log(err);
            return new appException({msg : 'parent_entry does not exists', code : 15, http : 404});
        }
        if(err instanceof UniqueConstraintError) {
            return new appException({msg : 'duplicate entry error', http : 400, code : 5});
        }
        if(err instanceof ValidationError) {
            err = JSON.parse(err['errors'][0]['message']);
            return new appException(err, err)
        }
        return new appException(Constant.UnknownErr, err)
    }
};

export default appException;