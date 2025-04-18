import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';

export const setupSwagger = (app: Express) => {
  const options = {
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'SSH API',
        version: '1.0.0',
        description: 'SSH 연결 API 문서입니다.',
      },
    },
    apis: ['./src/**/*.ts'], // Swagger가 주석을 파싱할 위치
  };

  const specs = swaggerJsdoc(options);
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
};