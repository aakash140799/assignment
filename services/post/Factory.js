import userFactory from '../user/Factory.js';
import commentFactory from '../comment/Factory.js';
import DbFactory from '../../utils/factory/postgresConn.js';
import cacheFactory from '../../utils/factory/redisConn.js';
import redisAdaptor from '../../utils/adaptor/Redis.js';
import Entity from './Entity.js';
import LikeEntity from './LikeEntity.js';
import Repo from '../../utils/adaptor/postgresRepo.js';
import Service from './Service.js';
import Controller from './Controller.js';
import Router from './Router.js';
import pino from 'pino';

var conn = null;
var userModel = null;
var entity = null;
var likeEntity = null;
var model = null;
var likeModel = null;
var redisConn = null;
var cache = null;
var repoConfigs = null;
var repo = null;
var likeRepoConfigs = null;
var likeRepo = null;
var commentService = null;
var service = null;
var controller = null;
var router = null;
var app = null;
var built = false;
const logger = pino();
class Factory
{
    static async build()
    {
        if(!built)
        {
            conn = await DbFactory.build();

            userModel = await userFactory.getModel();

            entity = new Entity(conn, userModel);

            model = await entity.build();

            likeEntity = new LikeEntity(conn, userModel);

            likeModel = await likeEntity.build();

            redisConn = await cacheFactory.build();

            cache = new redisAdaptor(redisConn, 'User');

            await cache.flush();

            repoConfigs = {keyColumns : new Set(['id']), cacheSingle : true, cacheMany : true};

            repo = new Repo(model, cache, 'User', repoConfigs);

            likeRepoConfigs = {keyColumns : new Set(['userId', 'postId']), cacheSingle : false, cacheMany : false}

            likeRepo = new Repo(likeModel, cache, 'Like', likeRepoConfigs);

            commentService = await commentFactory.getService();

            service = new Service(repo, likeRepo, commentService,cache, {}); 
            
            controller = new Controller(service);

            router = new Router(controller);

            app = router.getRouter();

            built = true;

            logger.info('post factory built');
        }

        return app;
    }

    static async getConnection() {
        await this.build();
        return conn;
    }

    static async getEntity() {
        await this.build();
        return entity;
    }

    static async getModel() {
        await this.build();
        return model;
    }

    static async getLikeEntity() {
        await this.build();
        return likeEntity;
    }

    static async getLikeModel() {
        await this.build();
        return likeModel;
    }

    static async getRedisConn() {
        await this.build();
        return redisConn;
    }

    static async getCache() {
        await this.build();
        return cache;
    }

    static async getRepoConf() {
        await this.build();
        return repoConfigs;
    }

    static async getRepo() {
        await this.build();
        return repo;
    }

    static async getLikeRepoConf() {
        await this.build();
        return likeRepoConfigs;
    }

    static async getLikeRepo() {
        await this.build();
        return likeRepo;
    }

    static async getService() {
        await this.build();
        return service;
    }

    static async getController() {
        await this.build();
        return controller;
    }

    static async getRouter() {
        await this.build();
        return router;
    }

    static async getApp() {
        return await this.build();
    }

    reset() {
        build = false;
    }
};

export default Factory;