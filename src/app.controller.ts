import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from './modules/auth/jwtauth.guard';
import { UseGuards, Req, Ip } from '@nestjs/common';
@ApiTags('Welcoming')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  welcome(): string {
    return this.appService.welcome();
  }
  @UseGuards(AuthGuard)
  @Get()
  getHello(@Req() req, @Ip() ip: string) {
    console.log(`GetHello call from IP: ${ip}`);
    return this.appService.getHello();
  }
}
