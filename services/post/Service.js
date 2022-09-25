import appException from '../../utils/appException.js';
import repoAdaptor from '../../utils/adaptor/postgresRepo.js';
import redisAdaptor from '../../utils/adaptor/Redis.js';
import pIteration from 'p-iteration';
import Constant from '../../utils/Constant.js';
import pino from 'pino';
import checker from '../../utils/checker.js';



const logger = pino();
class Service {

    constructor(repo, likeRepo, commentService, cache, configs) {
        if(!(repo instanceof repoAdaptor) || !(likeRepo instanceof repoAdaptor) || !(cache instanceof redisAdaptor)) {
            throw new appException('InvalidArgument');
        }

        this.repo = repo;
        this.likeRepo = likeRepo;
        this.commentService = commentService;
        this.cache = cache;
        this.configs = configs;
        logger.info('post service built');
    }

    createSanity(doc) {
        if(checker.isUndefined(doc)){throw new appException(Constant.ReqDataMissing);}
        if(!checker.isObject(doc)){throw new appException(Constant.ReqDescInvalid);}
        if(checker.isUndefined(doc.title)){throw new appException(Constant.ReqTitleMissing);}
        if(checker.isUndefined(doc.description)){throw new appException(Constant.ReqDescMissing);}
        if(!checker.isString(doc.title)){throw new appException(Constant.ReqTitleInvalid);}
        if(!checker.isString(doc.description)){throw new appException(Constant.ReqDescInvalid);}
    }

    updateSanity(doc) {
        if(checker.isUndefined(doc)){throw new appException(Constant.ReqDataMissing);}
        if(!checker.isObject(doc)){throw new appException(Constant.ReqDescInvalid);}
        if(!checker.isUndefined(doc.title) && !checker.isString(doc.title)){throw new appException(Constant.ReqTitleInvalid);}
        if(!checker.isUndefined(doc.description) && !checker.isString(doc.description)){throw new appException(Constant.ReqDescInvalid);}
    }

    createTrans(doc) {
        if(doc.title !== undefined){ doc.title = doc.title.trim();}
        if(doc.description !== undefined){ doc.description = doc.description.trim(); }
    }

    async create(userId, body) {
        try{
            // sanity checks
            var doc = body.data;
            this.createSanity(doc);
            if(!checker.isString(userId)){throw new appException(Constant.FuncArgWrong)};


            
            // transform
            this.createTrans(doc);
            doc.userId = userId;



            // store in this.repo
            var res = await this.repo.create(doc);

            
            // return result
            return res;
        } catch(err) {

            logger.error(err, 'service error');
            throw appException.fromError(err);
        }
    }

    async checkOwner(userId, postId) {
        try{// sanity
            if(!checker.isString(userId) || !checker.isString(postId)){throw new appException(Constant.FuncArgWrong);}

            
            
            // find in this.repo
            var res = await this.repo.get({id : postId});
            if(res.userId != userId) {throw new appException(Constant.UserNotAuthroized);}



            // return result
            return res;
        } catch(err) {

            logger.error(err, 'service error');
            throw appException.fromError(err);
        }
    }

    async get(postId) {
        try{// sanity
            if(!checker.isString(postId)){throw new appException(Constant.FuncArgWrong);}
            


            // find in this.repo
            var res = await this.repo.get({id : postId});



            // return result
            return res;
        } catch(err) {

            logger.error(err, 'service error');
            throw appException.fromError(err);
        }
    }

    async update(userId, postId, body) {
        try{// sanity
            var doc = body.data;
            this.updateSanity(doc);
            if(!checker.isString(userId) || !checker.isString(postId)){throw new appException(Constant.FuncArgWrong);}



            // trans
            doc.userId = userId;



            // check permission
            await this.checkOwner(userId, postId);



            // update in this.repo
            var res = await this.repo.update({id : postId}, doc);



            // return result
            return res;
        } catch(err) {
            
            logger.error(err, 'service error');
            throw appException.fromError(err);
        }
    }

    async delete(userId, postId) {
        try{// sanity
            if(!checker.isString(userId) || !checker.isString(postId)){throw new appException(Constant.FuncArgWrong);}



            // check permission
            await this.checkOwner(userId, postId);




            // delete post
            var res = await this.repo.delete({id : postId});



            // return result
            return res;
        } catch(err) {

            logger.error(err, 'service error');
            throw appException.fromError(err);
        }
    }

    async createMany(userId, body) {
        try {// sanity
            if(!checker.isString(userId)){throw new appException(Constant.FuncArgWrong);}

            var docs = body.data;
            if(checker.isUndefined(docs)){throw new appException(Constant.ReqDataMissing);}
            if(!(docs instanceof Array)){throw new appException(Constant.ReqDataWrong);}


            var errDict = {}
            for(var i = 0; i < docs.length; i++) {
                var doc = docs[i];
                try{this.createSanity(doc)} catch(err) {errDict[i] = err;}
            }
            if(Object.keys(errDict).length > 0) {
                throw new appException(Constant.ReqMultiErr, errDict);
            }



            // transform
            await pIteration.forEach(docs, async (doc) => {
                doc.userId = userId;
            });




            // create in db
            var res = await this.repo.createMany(docs);



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
            var res = await this.repo.getMany(query, exact, select, index, count);



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

    async search(body) {
        try {// sanity
            var {query, select, exact, count, index} = checker.getManySanity(body);




            // find in db
            var res = await this.repo.getMany(query, exact, [ 'id', ... select] , index, count);

            // fill data
            await pIteration.forEach(res, async (doc) => {
                console.log(doc);
                doc.likes = this.countLikes(doc.id);
                doc.comments = await this.commentService.seeComments(doc.id, {select : ['id', 'userId', 'comment', 'createdAt'], count : 1000, index : 1});
                doc.likes = await doc.likes;
            });


            return res;
        } catch(err) {
            
            logger.error(err, 'service error');
            throw appException.fromError(err);
        }
    }

    async likePost(userId, postId) {
        try {// sanity
            if(!checker.isString(userId) || !checker.isString(postId)){throw new appException(Constant.FuncArgWrong);}



            // update in db
            const res = await this.likeRepo.upsert({userId, postId, like : 1});



            return res;
        } catch(err) {
            
            logger.error(err, 'service error');
            throw appException.fromError(err);
        }
    }

    async disLikePost(userId, postId) {
        try {// sanity
            if(!checker.isString(userId) || !checker.isString(postId)){throw new appException(Constant.FuncArgWrong);}



            // update in db
            const res = await this.likeRepo.upsert({userId, postId, like : -1});
            return res;
        } catch(err) {
            
            logger.error(err, 'service error');
            throw appException.fromError(err);
        }
    }

    async unLikePost(userId, postId) {
        try {// sanity
            if(!checker.isString(userId) || !checker.isString(postId)){throw new appException(Constant.FuncArgWrong);}



            // update in db
            const res = await this.likeRepo.upsert({userId, postId, like : 0});
            return res;
        } catch(err) {
            
            logger.error(err, 'service error');
            throw appException.fromError(err);
        }
    }

    async countLikes(postId) {
        try {// sanity
            if(!checker.isString(postId)){throw new appException(Constant.FuncArgWrong);}



            // check in cache
            var key = 'LIKES_'+postId;
            const cres = await this.cache.getKey(key);
            if(cres.success){return {count : cres.response};}

            
            
            // get from db
            var res = await (this.likeRepo.getConn()).aggregate('like', 'sum', {where : {postId}, plain: true});



            // set in cache with exp
            await this.cache.setKeyWithExp(key, res, 120);


            
            return {count : res};
        } catch(err) {
            
            logger.error(err, 'service error');
            throw appException.fromError(err);
        }
    }
};

export default Service;