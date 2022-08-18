import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  greeting() {
    return 'hello world';
  }
}
