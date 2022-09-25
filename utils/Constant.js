

export default {
    ReqMultiErr : {
        msg : 'this is a bulk api, there are multiple errors',
        code : 0,
        http : 400,
    },

    UnknownErr : {
        msg : 'internal error happend, reason unknown',
        code : 1,
        http : 500,
    },

    FuncArgWrong : {
        msg : 'internal error, invalid function argument',
        code : 100,
        http : 500,
    },

    RedisConnFailed : {
        msg : 'can;t connect to redis',
        code : 30,
        http : 500,
    },

    ReqDataMissing : {
        msg : 'attribute data is required attributes, check docs for dto',
        code : 101,
        http : 400,
    },

    ReqDataWrong : {
        msg : 'attribute data is invalid, check docs for dto',
        code : 102,
        http : 400,
    },

    ReqEmailMissing : {
        msg : 'attribute email is required attributes, check docs for dto',
        code : 103,
        http : 400,
    },

    ReqPasswordMissing : {
        msg : 'attribute password is required attributes, check docs for dto',
        code : 104,
        http : 400,
    },

    ReqEmailWrong : {
        msg : 'attribute email is invalid, check docs for dto',
        code : 105,
        http : 400,
    },

    ReqPasswordWrong : {
        msg : 'attribute password is invalid, check docs for dto',
        code : 106,
        http : 400,
    },

    DbUserMissing : {
        msg : 'user does not exists in db, if already created, pls contact admin',
        code : 107,
        http : 404,
    },

    ReqPasswordIncorrect : {
        msg : 'password provided in incorrect',
        code : 108,
        http : 401,
    },

    ReqRememberWrong : {
        msg : 'attribute rememberMe is invalid, pls check docs',
        code : 109,
        http : 400,
    },

    ReqExactWrong : {
        msg : 'attribute exact is invalid, pls check docs',
        code : 111,
        http : 400,
    },

    ReqExactMissing : {
        msg : 'attribute exact is a required attribute, pls check docs',
        code : 112,
        http : 400,
    },

    ReqQueryWrong : {
        msg : 'attribute query is invalid, pls check docs',
        code : 113,
        http : 400,
    },

    ReqQueryMissing : {
        msg : 'attribute query is a required attribute, pls check docs',
        code : 114,
        http : 400,
    },

    ReqSelectWrong : {
        msg : 'attribute select is invalid, pls check docs',
        code : 115,
        http : 400,
    },

    ReqSelectMissing : {
        msg : 'attribute select is a required attribute, pls check docs',
        code : 116,
        http : 400,
    },

    ReqCountWrong : {
        msg : 'attribute count is of select dataType, pls check docs',
        code : 117,
        http : 400,
    },

    ReqIndexWrong : {
        msg : 'attribute index is invalid, pls check docs',
        code : 118,
        http : 400,
    },

    EndpointMissing : {
        msg : 'endpoint does not exists, pls check docs',
        code : 119,
        http : 404,
    },

    ReqEmailLen : {
        msg : 'email attribute is not of valid length, pls check docs',
        code : 120,
        http : 400,
    },

    ReqTitleLen : {
        msg : 'title attribute is not of valid length, pls check docs',
        code : 121,
        http : 400,
    },

    ReqDescLen : {
        msg : 'Description attribute is not of valid length, pls check docs',
        code : 122,
        http : 400,
    },

    ReqCommLen : {
        msg : 'comment attribute is not of valid length, pls check docs',
        code : 123,
        http : 400,
    },

    ReqTitleMissing : {
        msg : 'title attribute is missing, pls check docs',
        code : 124,
        http : 400,
    },

    ReqDescMissing : {
        msg : 'Description attribute is missing, pls check docs',
        code : 125,
        http : 400,
    },

    ReqCommMissing : {
        msg : 'comment attribute is missing, pls check docs',
        code : 126,
        http : 400,
    },

    ReqTitleInvalid : {
        msg : 'title attribute is invalid, pls check docs',
        code : 127,
        http : 400,
    },

    ReqDescInvalid : {
        msg : 'Description attribute is invalid, pls check docs',
        code : 128,
        http : 400,
    },

    ReqCommInvalid : {
        msg : 'comment attribute is invalid, pls check docs',
        code : 129,
        http : 400,
    },

    UserNotAuthroized : {
        msg : 'you are not authorized',
        code : 130,
        http : 403
    },

    CommentLen : {
        msg : 'comment attribute is of invalid len, check docs',
        code : 131,
        http : 400,
    },

    EntityFailed : {
        msg : 'entity creation failed',
        code : 132,
        http : 500,
    },

    InvalidLikeValue : {
        msg : 'like attribute value is invalid',
        code : 133,
        http : 400,
    }

}