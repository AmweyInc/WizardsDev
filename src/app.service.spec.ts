import { Test, TestingModule } from '@nestjs/testing';
import { AppService } from './app.service';
import { HttpService } from '@nestjs/axios';
import { DbService } from './database/db.service';

describe('AppService', () => {
    let appService: AppService;
    let dbService: DbService;
    let httpService: HttpService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AppService,
                {
                    provide: DbService,
                    useValue: {
                        query: jest.fn(),
                    },
                },
                {
                    provide: HttpService,
                    useValue: {},
                },
            ],
        }).compile();

        appService = module.get<AppService>(AppService);
        dbService = module.get<DbService>(DbService);
        httpService = module.get<HttpService>(HttpService);
    });

    it('should be defined', () => {
        expect(appService).toBeDefined();
    });

    it('should call dbService query with correct SQL for getCitiesPopulation', async () => {
        await appService.getCitiesPopulation();
        expect(dbService.query).toHaveBeenCalledWith(
            'SELECT cities.name AS city, COUNT(residents.id) AS count FROM cities LEFT JOIN residents ON cities.id = residents.city_id GROUP BY cities.id ORDER BY count DESC',
            [],
        );
    });

    it('should call dbService query with correct SQL for getCityMembers', async () => {
        await appService.getCityMembers();
        expect(dbService.query).toHaveBeenCalledWith(
            'SELECT cities.name AS city, residents.first_name, COUNT(residents.id) AS count FROM cities LEFT JOIN residents ON cities.id = residents.city_id GROUP BY cities.id, residents.first_name',
            [],
        );
    });

    it('should call httpService post method for sendLogRequest', async () => {
        const req = { body: { data: 'sample request data' } };
        const res = { body: { data: 'sample response data' }, statusCode: 200 };
        httpService.post = jest.fn().mockResolvedValueOnce({});
        await appService.sendLogRequest(req, res, 100);
        expect(httpService.post).toHaveBeenCalledWith('http://localhost:8765/logging', {
            requestDuration: 100,
            requestData: undefined, // Need to use JSON.stringify(req.body) on prod
            responseData: undefined, // Need to use JSON.stringify(res.body) on prod
            httpStatus: res.statusCode,
        });
    });
});
