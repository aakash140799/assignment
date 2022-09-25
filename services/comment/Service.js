import appException from '../../utils/appException.js';
import repoAdaptor from '../../utils/adaptor/postgresRepo.js';
import Constant from '../../utils/Constant.js';
import pIteration from 'p-iteration';
import pino from 'pino';
import checker from '../../utils/checker.js';



const logger = pino();
class Service {

    constructor(repo, configs) {
        if(!(repo instanceof repoAdaptor)) {
            throw new appException('InvalidArgument');
        }

        this.repo = repo;
        this.configs = configs;
        logger.info('comment service built');
    }

    createSanity(doc) {
        if(checker.isUndefined(doc)){throw new appException(Constant.ReqDataMissing);}
        if(!checker.isObject(doc)){throw new appException(Constant.ReqDescInvalid);}
        if(checker.isUndefined(doc.comment)){throw new appException(Constant.ReqCommMissing);}
        if(!checker.isString(doc.comment)){throw new appException(Constant.ReqCommInvalid);}
    }

    createTrans(doc) {
        doc.comment = doc.comment.trim();    
    }

    async create(userId, postId, body) {
        try{// sanity
            if(!checker.isString(userId) || !checker.isString(postId)){throw new appException(Constant.FuncArgWrong);}

            var doc = body.data;
            this.createSanity(doc);



            // trans
            this.createTrans(doc);
            doc.userId = userId;
            doc.postId = postId;



            // store in this.repo
            var res = await this.repo.create(doc);



            // return result
            return res;
        } catch(err) {

            logger.error(err, 'service error');
            throw appException.fromError(err);
        }
    }

    async get(commentId) {
        try{// sanity
            if(!checker.isString(commentId)){throw new appException(Constant.FuncArgWrong);}


            // find in this.repo
            var res = await this.repo.get({id : commentId});


            // return result
            return res;
        } catch(err) {

            logger.error(err, 'service error');
            throw appException.fromError(err);
        }
    }

    async checkOwner(userId, commentId) {
        try{// sanity
            if(!checker.isString(userId) || !checker.isString(commentId)){throw new appException(Constant.FuncArgWrong);}


            // find in this.repo
            var res = await this.repo.get({id : commentId});
            if(res.userId != userId) {throw new appException(Constant.UserNotAuthroized);}


            // return result
            return res;
        } catch(err) {

            logger.error(err, 'service error');
            throw appException.fromError(err);
        }
    }

    async update(userId, commentId, body) {
        try{// sanity
            if(!checker.isString(userId) || !checker.isString(commentId)){throw new appException(Constant.FuncArgWrong);}
            var doc = body.data;
            this.createSanity(doc);


            // trans
            this.createTrans(doc);

            // check permission
            await this.checkOwner(userId, commentId);

            // update in this.repo
            var res = await this.repo.update({id : commentId}, doc);

            // return result
            return res;
        } catch(err) {
            
            logger.error(err, 'service error');
            throw appException.fromError(err);
        }
    }

    async delete(userId, commentId) {
        try{
            // check permission
            await this.checkOwner(userId, commentId);


            // delete post
            var res = await this.repo.delete({id : commentId});

            
            // return result
            return res;
        } catch(err) {

            logger.error(err, 'service error');
            throw appException.fromError(err);
        }
    }

    async getMany(userId, body) {
        try {// sanity
            if(!checker.isString(userId)){throw new appException(Constant.FuncArgWrong);}
            var {query, select, exact, count, index} = checker.getManySanity(body);

            
            // transform
            query.userId = userId;

            
            // search in db
            var res = await this.repo.getMany(query, exact, select || null, index, count);


            return res;
        } catch(err) {
            
            logger.error(err, 'service error');
            throw appException.fromError(err);
        }
    }

    async deleteMany(userId, body) {
        try {// sanity
            if(!checker.isString(userId)){throw new appException(Constant.FuncArgWrong);}
            var {query, exact} = checker.deleteManySanity(body);
            


            // transform
            query.userId = userId;



            // delete in db
            const res = await this.repo.deleteMany(query, exact);
            return res;
        } catch(err) {
            
            logger.error(err, 'service error');
            throw appException.fromError(err);
        }
    }

    async seeComments(postId, body) {
        try {
            var {select, count, index} = checker.searchSanity(body);


            // find in db
            const res = await this.repo.getMany({postId}, true, select, index, count);
            return res;
        } catch(err) {
            
            logger.error(err, 'service error');
            throw appException.fromError(err);
        }
    }
};

export default Service;