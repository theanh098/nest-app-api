import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Hello world')
@Controller()
export class AppController {
  @Get()
  greeting() {
    return 'hello world';
  }
}
