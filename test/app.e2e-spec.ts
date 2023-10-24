import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from '../src/app.controller';
import { AppService } from '../src/app.service';
import { DataPopulationService } from '../src/database/dataSeeder.service';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService, DataPopulationService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('getAggregatedData', () => {
    it('should return aggregated data', async () => {
      const result = {};
      expect(await appController.getAggregatedData({}, {
        send: (data) => {
          expect(data).toEqual(result);
        },
        status: (code) => {
          expect(code).toBe(200);
          return { send: () => {} };
        },
      }));
    });
  });

  describe('populateData', () => {
    it('should populate data', async () => {
      const result = 'Data population successful!';
      expect(await appController.populateData({
        send: (data) => {
          expect(data).toBe(result);
        },
        status: (code) => {
          expect(code).toBe(200);
          return { send: () => {} };
        },
      }));
    });
  });
});
