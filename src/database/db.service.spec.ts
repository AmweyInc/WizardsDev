import { ConfigService } from '@nestjs/config';
import { DbService } from './db.service';
import { Pool, QueryResult } from 'pg';

describe('DbService', () => {
    let dbService: DbService;
    let configService: ConfigService;
    let mockPool: Pool;

    beforeEach(() => {
        configService = new ConfigService();
        dbService = new DbService(configService);
        mockPool = new Pool();
        dbService['pool'] = mockPool;
    });

    it('should create a new DbService', () => {
        expect(dbService).toBeDefined();
    });

    it('should call pool.query when calling query method', async () => {
        const mockQueryResult: QueryResult = {
            rows: [],
            rowCount: 0,
            command: '',
            oid: 0,
            fields: [],
        };
        mockPool.query = jest.fn().mockResolvedValueOnce(mockQueryResult);
        const text = 'SELECT * FROM some_table';
        const params = [];
        const result = await dbService.query(text, params);
        expect(mockPool.query).toHaveBeenCalledWith(text, params);
        expect(result).toEqual(mockQueryResult);
    });
});
