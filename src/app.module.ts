import { Module } from '@nestjs/common';
import { HttpModule } from "@nestjs/axios";
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DbService } from "./database/db.service";
import { DataPopulationService } from "./database/dataSeeder.service";

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: ['.env'],
            load: [],
        }),
        HttpModule],
    controllers: [AppController],
    providers: [AppService, DbService, DataPopulationService],
})

export class AppModule {}