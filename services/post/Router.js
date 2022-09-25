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
        router.get('/postsearch', controller.search);
        router.post('/post', controller.create);
        router.get('/post/:postId', controller.get);
        router.put('/post/:postId', controller.update);
        router.delete('/post/:postId', controller.delete);
        router.get('/postBulk', controller.getMany);
        router.delete('/postBulk', controller.deleteMany);
        router.post('/post/like/:postId', controller.likePost);
        router.post('/post/dislike/:postId', controller.disLikePost);
        router.post('/post/unlike/:postId', controller.unLikePost);
        router.get('/post/countlikes/:postId', controller.countLikes);

        this.router = router;
        this.getRouter = this.getRouter.bind(this);

        logger.info('post router built');
    }

    getRouter() {
        return this.router;
    }
};

export default Router;