'use strict';

const router = require('koa-router')();
const koaBody = require('koa-body');
const uploadDir = `${__dirname}/public/img`;

router.post(
  '/asset',
  koaBody({
    multipart: true,
    formLimit: '10mb',
    formidable: {
      uploadDir,
      keepExtensions: true
    }
  }),
  function *assetUploadEndpoint() {
    const path = this.request.body.files.asset.path.replace(`${__dirname}/public`, '');
    const pluginId = this.request.body.fields.pluginId;
    this.body = {
      pluginId,
      path
    };
  }
);

module.exports = router.routes();
