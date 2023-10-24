import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Pool, QueryResult } from 'pg';

@Injectable()
export class DbService {
    private pool: Pool;

    constructor(private configService: ConfigService) {
        this.pool = new Pool({
            user: this.configService.get<string>('DB_USER'),
            host: this.configService.get<string>('DB_HOST'),
            database: this.configService.get<string>('DB_DATABASE'),
            password: this.configService.get<string>('DB_PASSWORD'),
            port: this.configService.get<number>('DB_PORT'),
        });
    }

    async query(text: string, params: any[]): Promise<QueryResult> {
        return this.pool.query(text, params);
    }
}
