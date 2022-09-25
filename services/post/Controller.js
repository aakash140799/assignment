import appException from '../../utils/appException.js';
import checker from '../../utils/checker.js';
import pino from 'pino';


const logger = pino();
class Controller {

    constructor(service) {
        if(service == null || service == undefined) {
            throw new appException('InvalidArgument');
        }
        this.service = service;
        
        this.create = this.create.bind(this);
        this.get = this.get.bind(this);
        this.update = this.update.bind(this);
        this.delete = this.delete.bind(this);
        this.createMany = this.createMany.bind(this);
        this.getMany = this.getMany.bind(this);
        this.deleteMany = this.deleteMany.bind(this);
        this.search = this.search.bind(this);
        this.likePost = this.likePost.bind(this);
        this.disLikePost = this.disLikePost.bind(this);
        this.unLikePost = this.unLikePost.bind(this);
        this.countLikes = this.countLikes.bind(this);

        logger.info('post controller built');
    }

    async create(req, res, next) {
        try{
            await req.permit('CreatePost');

            const ires = await this.service.create(req.user.id, req.body);
            return checker.checkediRes(ires, req, res, next);
        } catch(err) {

            logger.error(err, 'post controller');
            err = appException.fromError(err);
            return next(err);
        }
    }

    async get(req, res, next) {
        try{
            await req.permit('GetPost');

            const ires = await this.service.get(req.params.postId);
            return checker.checkediRes(ires, req, res, next);
        } catch(err) {

            logger.error(err, 'post controller');
            err = appException.fromError(err);
            return next(err);
        }
    }

    async update(req, res, next) {
        try{
            await req.permit('UpdatePost');

            const ires = await this.service.update(req.user.id, req.params.postId, req.body);
            return checker.checkediRes(ires, req, res, next);
        } catch(err) {

            logger.error(err, 'post controller');
            err = appException.fromError(err);
            return next(err);
        }
    }

    async delete(req, res, next) {
        try{
            await req.permit('DeletePost');
            
            const ires = await this.service.delete(req.user.id, req.params.postId);

            if(ires.success) {
                return checker.checkediRes(undefined, req, res, next);
            }else{
                return res.json({success : false});
            }
            
        } catch(err) {

            logger.error(err, 'post controller');
            err = appException.fromError(err);
            return next(err);
        }
    }

    async createMany(req, res, next) {
        try{
            await req.permit('CreateManyPost');

            const ires = await this.service.createMany(req.user.id, req.body);
            return checker.checkediRes(ires, req, res, next);
        } catch(err) {

            logger.error(err, 'post controller');
            err = appException.fromError(err);
            return next(err);
        }
    }

    async getMany(req, res, next) {
        try{
            await req.permit('GetManyPost');

            const ires = await this.service.getMany(req.user.id, req.body);
            return checker.checkediRes(ires, req, res, next);
        } catch(err) {

            logger.error(err, 'post controller');
            err = appException.fromError(err);
            return next(err);
        }
    }

    async deleteMany(req, res, next) {
        try{
            await req.permit('DeleteManyPost');

            const ires = await this.service.deleteMany(req.user.id, req.body);
            return checker.checkediRes(ires, req, res, next);
        } catch(err) {

            logger.error(err, 'post controller');
            err = appException.fromError(err);
            return next(err);
        }
    }

    async search(req, res, next) {
        try{
            await req.permit('SearchManyPost');

            const ires = await this.service.search(req.body);
            return checker.checkediRes(ires, req, res, next);
        } catch(err) {

            logger.error(err, 'post controller');
            err = appException.fromError(err);
            return next(err);
        }
    }

    async likePost(req, res, next) {
        try{
            await req.permit('LikePost');

            const ires = await this.service.likePost(req.user.id, req.params.postId);
            return checker.checkediRes(ires, req, res, next);
        } catch(err) {

            logger.error(err, 'post controller');
            err = appException.fromError(err);
            return next(err);
        }
    }

    async disLikePost(req, res, next) {
        try{
            await req.permit('LikePost');

            const ires = await this.service.disLikePost(req.user.id, req.params.postId);
            return checker.checkediRes(ires, req, res, next);
        } catch(err) {

            logger.error(err, 'post controller');
            err = appException.fromError(err);
            return next(err);
        }
    }

    async unLikePost(req, res, next) {
        try{
            await req.permit('LikePost');

            const ires = await this.service.unLikePost(req.user.id, req.params.postId);
            return checker.checkediRes(ires, req, res, next);
        } catch(err) {

            logger.error(err, 'post controller');
            err = appException.fromError(err);
            return next(err);
        }
    }

    async countLikes(req, res, next) {
        try{
            await req.permit('LikePost');

            const ires = await this.service.countLikes(req.params.postId);
            return checker.checkediRes(ires, req, res, next);
        } catch(err) {

            logger.error(err, 'post controller');
            err = appException.fromError(err);
            return next(err);
        }
    }
};

export default Controller;