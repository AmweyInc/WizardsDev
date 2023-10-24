import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DataPopulationService } from './database/dataSeeder.service';

describe('AppController', () => {
  let appController: AppController;
  let appService: AppService;
  let dataPopulationService: DataPopulationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        {
          provide: AppService,
          useValue: {
            getAggregatedData: jest.fn(),
          },
        },
        {
          provide: DataPopulationService,
          useValue: {
            populateData: jest.fn(),
          },
        },
      ],
    }).compile();

    appController = module.get<AppController>(AppController);
    appService = module.get<AppService>(AppService);
    dataPopulationService = module.get<DataPopulationService>(DataPopulationService);
  });

  it('should be defined', () => {
    expect(appController).toBeDefined();
  });

  it('should call appService getAggregatedData method when calling getAggregatedData', async () => {
    const mockData = { cities_population: [], city_members: [] };
    appService.getAggregatedData = jest.fn().mockResolvedValueOnce(mockData);
    const req = { some: 'request' };
    const res = { send: jest.fn(), status: jest.fn()  };
    await appController.getAggregatedData(req, res);
    expect(appService.getAggregatedData).toHaveBeenCalled();
    expect(res.send).toHaveBeenCalledWith(mockData);
  });

  it('should call dataPopulationService populateData method when calling populateData', async () => {
    const mockResponse = 'Data population successful!';
    dataPopulationService.populateData = jest.fn().mockResolvedValueOnce({});
    const res = { send: jest.fn(), status: jest.fn() };
    await appController.populateData(res);
    expect(dataPopulationService.populateData).toHaveBeenCalled();
    expect(res.send).toHaveBeenCalledWith(mockResponse);
  });

  it('should handle error when populating data', async () => {
    const res = { send: jest.fn(), status: jest.fn() };
    await appController.populateData(res);
    expect(dataPopulationService.populateData).toHaveBeenCalled();

    expect(res.send).toHaveBeenCalledWith('Data population successful!');
  });
});
