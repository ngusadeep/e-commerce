import { Injectable } from '@nestjs/common';
import configuration from 'src/config/configuration';

@Injectable()
export class AppService {
  welcome(): string {
    const appName: string | undefined = configuration().app.name;
    return `Welcome to ${appName}`;
  }
}
