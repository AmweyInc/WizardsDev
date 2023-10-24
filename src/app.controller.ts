import { Controller, Get, Post, Req, Res, UseInterceptors } from '@nestjs/common';
import { AppService } from './app.service';
import { LoggingInterceptor } from './logging/logging.interceptor';
import { DataPopulationService } from "./database/dataSeeder.service";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";

@ApiTags('Population')
@Controller()
@UseInterceptors(LoggingInterceptor)
export class AppController {
  constructor(private readonly appService: AppService, private readonly dataPopulationService: DataPopulationService) {}

  @Get('/get-population')
  @ApiOperation({ summary: 'Return Count of each city members sorted by count DESC and ' +
        'Count of members with same first_name  by every city' })
  @ApiResponse({ status: 200, description: 'All data was successfully returned.' })
  @ApiResponse({ status: 500, description: 'An error occurred on the server' })
  async getAggregatedData(@Req() req, @Res() res) {
    try {
      const data = await this.appService.getAggregatedData();
      res.status(200).send(data);
    } catch (error) {
      res.status(500).send('An error occurred on the server');
    }}

  @Post('/create-population')
  @ApiOperation({ summary: 'Generates random information to fill the database. (DB Seeder)' })
  @ApiResponse({ status: 200, description: 'The records in DB has been successfully created.' })
  @ApiResponse({ status: 500, description: 'The data was not created or was created with an error.' })
  async populateData(@Res() res) {
    try {
      await this.dataPopulationService.populateData();
      res.send('Data population successful!');
    } catch (error) {
      res.status(500).send('Error populating data');
    }
  }
}
