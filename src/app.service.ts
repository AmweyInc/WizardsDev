import {Injectable} from '@nestjs/common';
import {HttpService} from '@nestjs/axios'
import {DbService} from './database/db.service';
import {LogData} from "./app.dto";
import circularReplacer from './utils/circularReplacer';

@Injectable()
export class AppService {
    constructor(private readonly dbService: DbService, private readonly httpService: HttpService) {}

    async getAggregatedData() {
        const citiesPopulationQuery = `
            SELECT cities.name AS city, COUNT(residents.id) AS count 
            FROM cities 
            LEFT JOIN residents ON cities.id = residents.city_id 
            GROUP BY cities.id 
            ORDER BY count DESC
          `;
        const citiesPopulationResult = await this.dbService.query(citiesPopulationQuery, []);

        const cityMembersQuery = `
            SELECT cities.name AS city, residents.first_name, COUNT(residents.id) AS count 
            FROM cities 
            LEFT JOIN residents ON cities.id = residents.city_id 
            GROUP BY cities.id, residents.first_name
          `;
        const cityMembersResult = await this.dbService.query(cityMembersQuery, []);

        const citiesPopulationFormatted = citiesPopulationResult.rows.map((row: any) => {
            return { city: row.city, count: parseInt(row.count) };
        });

        const cityMembersFormatted: any = {};
        cityMembersResult.rows.forEach((row: any) => {
            const { city, first_name, count } = row;
            if (!cityMembersFormatted[city]) {
                cityMembersFormatted[city] = [];
            }
            cityMembersFormatted[city].push({ first_name, count: parseInt(count) });
        });

        return {
            cities_population: citiesPopulationFormatted,
            city_members: Object.keys(cityMembersFormatted).map((city) => {
                return { city, members: cityMembersFormatted[city] };
            }),
        };
    }

    async getCitiesPopulation() {
        const sql: string = 'SELECT cities.name AS city, COUNT(residents.id) AS count FROM cities LEFT JOIN residents ON cities.id = residents.city_id GROUP BY cities.id ORDER BY count DESC';
        return await this.dbService.query(sql, []);
    }

    async getCityMembers() {
        const sql: string = 'SELECT cities.name AS city, residents.first_name, COUNT(residents.id) AS count FROM cities LEFT JOIN residents ON cities.id = residents.city_id GROUP BY cities.id, residents.first_name';
        return await this.dbService.query(sql, []);
    }

    async sendLogRequest(req: any, res: any, duration: number) {
        const logData: LogData = {
            requestDuration: duration,
            requestData: JSON.stringify(req.body, circularReplacer),
            responseData: JSON.stringify(res.body, circularReplacer),
            httpStatus: res.statusCode,
        };

        try {
            return await this.httpService.post('http://localhost:8765/logging', logData);
        } catch (error) {
            return console.log('Error while sending log request:', error.message);
        }
    }
}
