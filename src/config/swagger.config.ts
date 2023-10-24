import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';

export function setupSwagger(app: INestApplication) {
    const options = new DocumentBuilder()
        .setTitle('WizardsDev')
        .setDescription('API for work with population')
        .setVersion('1.0')
        .addTag('Population')
        .build();
    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup('/api-docs', app, document);
}
