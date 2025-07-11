import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { HttpErrorHelper } from './services/http-helper/httpHelper.util';
import { HttpServiceWrapper } from './services/http-service-wrapper/http-service-wrapper.utils';

@Module({
  imports: [HttpModule],
  controllers: [],
  providers: [HttpServiceWrapper, HttpErrorHelper],
  exports: [HttpServiceWrapper, HttpErrorHelper],
})
export class HttpUtilsModule {}
