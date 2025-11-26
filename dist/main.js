"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const app_module_1 = require("./app.module");
const swagger_1 = require("@nestjs/swagger");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    // Enable CORS
    app.enableCors({
        origin: process.env.FRONTEND_URL || 'http://localhost:3000',
        credentials: true,
    });
    // Enable validation
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
    }));
    // Swagger configuration
    const config = new swagger_1.DocumentBuilder()
        .setTitle('OnlineLoans.org API')
        .setDescription('API documentation for OnlineLoans.org server')
        .setVersion('1.0')
        .addTag('health', 'Health check endpoints')
        .addTag('contact', 'Contact form endpoints')
        .addTag('partner', 'Partner endpoints')
        .addTag('tracking', 'Visitor tracking endpoints')
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config, {
        operationIdFactory: (controllerKey, methodKey) => methodKey,
    });
    swagger_1.SwaggerModule.setup('api/docs', app, document, {
        swaggerOptions: {
            persistAuthorization: true,
        },
    });
    const port = process.env.PORT || 3001;
    await app.listen(port);
    console.log(`Application is running on: http://localhost:${port}`);
    console.log(`Swagger documentation: http://localhost:${port}/api/docs`);
}
bootstrap();
