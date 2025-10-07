import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {
  constructor(private readonly configService: ConfigService) {}
  welcome(): string {
    return `This is Backend Api`;
  }
  getHello(): string {
    return `Application Name from Custom configurations: ${this.configService.get<string>('app.name')}`;
  }
}
