import { Injectable } from '@nestjs/common';
import { DbService } from './db.service';
import { faker } from '@faker-js/faker';

@Injectable()
export class DataPopulationService {
    constructor(private readonly dbService: DbService) {}

    async populateData() {
        for (let i = 0; i < 100; i++) {
            const cityName = faker.location.city();
            const cityDescription = faker.lorem.sentence();
            const cityQuery = 'INSERT INTO cities (name, description) VALUES ($1, $2)';
            await this.dbService.query(cityQuery, [cityName, cityDescription]);
        }

        for (let i = 0; i < 100000; i++) {
            const firstName = faker.person.firstName();
            const lastName = faker.person.lastName();
            const cityId = Math.floor(Math.random() * 100) + 1;
            const residentsQuery = 'INSERT INTO residents (first_name, last_name, city_id) VALUES ($1, $2, $3)';
            await this.dbService.query(residentsQuery, [firstName, lastName, cityId]);
        }
    }
}
