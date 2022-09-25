import express from 'express';
import appException from '../../utils/appException.js';
import pino from 'pino';


const logger = pino();
class Router {

    constructor(controller) {
        if(controller == null || controller == undefined) {
            throw new appException('InvalidArgument')
        }

        var router = express.Router();
        router.post('/user', controller.create);
        router.get('/user', controller.get);
        router.put('/user', controller.update);
        router.delete('/user', controller.delete);
        router.post('/authenticate', controller.login);
        router.post('/userBulk', controller.createMany);
        router.get('/userBulk', controller.getMany);
        router.put('/userbulk', controller.updateMany);
        router.delete('/userBulk', controller.deleteMany);
        router.get('/checkEmail', controller.checkEmail);
        router.post('/follow/:followeeId', controller.followUser);
        router.post('/unfollow/:followeeId', controller.unFollowUser);
        router.get('/user/follower', controller.getFollowers);
        router.get('/user/followee', controller.getFollowees);

        this.router = router;
        this.getRouter = this.getRouter.bind(this);

        logger.info('user router built');
    }

    getRouter() {
        return this.router;
    }
};

export default Router;