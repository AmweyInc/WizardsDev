import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { lastValueFrom } from 'rxjs';
import { AppService } from "../app.service";

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
    constructor(private readonly appService: AppService) {}

    async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
        const start = new Date().getTime();
        const response = await lastValueFrom(next.handle());
        const duration = new Date().getTime() - start;
        const req = context.switchToHttp().getRequest();
        const res = context.switchToHttp().getResponse();
        this.appService.sendLogRequest(req, res, duration);
        return response;
    }
}
