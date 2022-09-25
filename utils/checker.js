import appException from "./appException.js";
import Constant from "./Constant.js";

function checkediRes(ires, req, res, next) {
    res.json({success : true, response : ires});
    return next();
}

function checkediErr(err, req, res, next) {
    return next(err);
}

function isString(arg) {
    return typeof(arg) === "string";
}

function isNumber(arg) {
    return typeof(arg) === "number";
}

function isBoolean(arg) {
    return typeof(arg) === "boolean";
}

function isObject(arg) {
    return typeof(arg) === "object" && arg !== null;
}

function isUndefined(arg) {
    return typeof(arg) === "undefined";
}

function isNull(arg) {
    return arg === null;
}


function getManySanity(body) {
    var {query, exact, select, count, index} = body;
    
    if(isUndefined(query)){query = {}}
    if(!isObject(query)){throw new appException(Constant.ReqQueryWrong);}
    if(isUndefined(exact)){exact = false;}
    if(!isBoolean(exact)){throw new appException(Constant.ReqExactWrong);}
    if(isUndefined(select) || select === null){select = []}
    if(!(select instanceof Array)){throw new appException(Constant.ReqSelectWrong);}
    if(isUndefined(count)){count = 1000;}
    if(!isNumber(count) || count < 1){throw new appException(Constant.ReqCountWrong);}
    if(isUndefined(index)){index = 1;}
    if(!isNumber(index) || index < 1){throw new appException(Constant.ReqIndexWrong);}

    if(select.length === 0){select = null;}
    return {query, exact, select, count, index};
}

function searchSanity(body) {
    var {select, count, index} = body;
    if(isUndefined(select) || isNull(select)){select = []}
    if(!(select instanceof Array)){throw new appException(Constant.ReqSelectWrong);}
    if(isUndefined(count)){count = 1000;}
    if(!isNumber(count) || count < 1){throw new appException(Constant.ReqCountWrong);}
    if(isUndefined(index)){index = 1;}
    if(!isNumber(index) || index < 1){throw new appException(Constant.ReqIndexWrong);}

    if(select.length === 0){select = null;}
    return {select, count, index};
}


function deleteManySanity(body) {
    var {query, exact} = body;
    if(isUndefined(query)){throw new appException(Constant.ReqQueryMissing);}
    if(!isObject(query)){throw new appException(Constant.ReqQueryWrong);}
    if(isUndefined(exact)){throw new appException(Constant.ReqExactMissing);}
    if(!isBoolean(exact)){throw new appException(Constant.ReqExactWrong);}

    return {query, exact};
}
export default {checkediRes, checkediErr, isString, isNumber, isBoolean, isObject, isUndefined, isNull, getManySanity, deleteManySanity, searchSanity};
