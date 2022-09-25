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
        this.getMany = this.getMany.bind(this);
        this.deleteMany = this.deleteMany.bind(this);
        this.seeComments = this.seeComments.bind(this);

        logger.info('comment controller built');
    }

    async create(req, res, next) {
        try{
            await req.permit('CreateComment');

            const ires = await this.service.create(req.user.id, req.params.postId, req.body);
            return checker.checkediRes(ires, req, res, next);
        } catch(err) {

            logger.error(err, 'comment controller');
            err = appException.fromError(err);
            return next(err);
        }
    }

    async get(req, res, next) {
        try{
            await req.permit('GetComment');

            const ires = await this.service.get(req.params.commentId);
            return checker.checkediRes(ires, req, res, next);
        } catch(err) {

            logger.error(err, 'comment controller');
            err = appException.fromError(err);
            return next(err);
        }
    }

    async update(req, res, next) {
        try{
            await req.permit('UpdateComment');

            const ires = await this.service.update(req.user.id, req.params.commentId, req.body);
            return checker.checkediRes(ires, req, res, next);
        } catch(err) {

            logger.error(err, 'comment controller');
            err = appException.fromError(err);
            return next(err);
        }
    }

    async delete(req, res, next) {
        try{
            await req.permit('DeleteComment');
            
            const ires = await this.service.delete(req.user.id, req.params.commentId);

            if(ires.success) {
                return checker.checkediRes(undefined, req, res, next);
            }else{
                return res.json({success : false});
            }
            
        } catch(err) {

            logger.error(err, 'comment controller');
            err = appException.fromError(err);
            return next(err);
        }
    }

    async getMany(req, res, next) {
        try{
            await req.permit('GetManyComment');

            const ires = await this.service.getMany(req.user.id, req.body);
            return checker.checkediRes(ires, req, res, next);
        } catch(err) {

            logger.error(err, 'comment controller');
            err = appException.fromError(err);
            return next(err);
        }
    }

    async deleteMany(req, res, next) {
        try{
            await req.permit('DeleteManyComment');

            const ires = await this.service.deleteMany(req.user.id, req.body);
            return checker.checkediRes(ires, req, res, next);
        } catch(err) {

            logger.error(err, 'comment controller');
            err = appException.fromError(err);
            return next(err);
        }
    }

    async seeComments(req, res, next) {
        try{
            await req.permit('SearchManyComment');

            const ires = await this.service.seeComments(req.params.postId, req.body);
            return checker.checkediRes(ires, req, res, next);
        } catch(err) {

            logger.error(err, 'comment controller');
            err = appException.fromError(err);
            return next(err);
        }
    }
};

export default Controller;