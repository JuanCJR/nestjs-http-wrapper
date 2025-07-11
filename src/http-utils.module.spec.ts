import { Test, TestingModule } from '@nestjs/testing';
import { HttpModule } from '@nestjs/axios';
import { HttpUtilsModule } from './http-utils.module';
import { HttpErrorHelper } from './services/http-helper/httpHelper.util';
import { HttpServiceWrapper } from './services/http-service-wrapper/http-service-wrapper.utils';

describe('HttpUtilsModule', () => {
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [HttpUtilsModule],
    }).compile();
  });

  afterEach(async () => {
    await module.close();
  });

  it('should be defined', () => {
    expect(module).toBeDefined();
  });

  it('should provide HttpErrorHelper', () => {
    const httpErrorHelper = module.get<HttpErrorHelper>(HttpErrorHelper);
    expect(httpErrorHelper).toBeDefined();
    expect(httpErrorHelper).toBeInstanceOf(HttpErrorHelper);
  });

  it('should provide HttpServiceWrapper', () => {
    const httpServiceWrapper =
      module.get<HttpServiceWrapper>(HttpServiceWrapper);
    expect(httpServiceWrapper).toBeDefined();
    expect(httpServiceWrapper).toBeInstanceOf(HttpServiceWrapper);
  });

  it('should export HttpErrorHelper', () => {
    const exportedProviders =
      Reflect.getMetadata('exports', HttpUtilsModule) || [];
    expect(exportedProviders).toContain(HttpErrorHelper);
  });

  it('should export HttpServiceWrapper', () => {
    const exportedProviders =
      Reflect.getMetadata('exports', HttpUtilsModule) || [];
    expect(exportedProviders).toContain(HttpServiceWrapper);
  });

  it('should import HttpModule', () => {
    const imports = Reflect.getMetadata('imports', HttpUtilsModule) || [];
    expect(imports).toContain(HttpModule);
  });

  it('should have correct providers configuration', () => {
    const providers = Reflect.getMetadata('providers', HttpUtilsModule) || [];
    expect(providers).toContain(HttpServiceWrapper);
    expect(providers).toContain(HttpErrorHelper);
    expect(providers).toHaveLength(2);
  });

  it('should have empty controllers array', () => {
    const controllers =
      Reflect.getMetadata('controllers', HttpUtilsModule) || [];
    expect(controllers).toEqual([]);
  });

  it('should properly inject dependencies', () => {
    const httpErrorHelper = module.get<HttpErrorHelper>(HttpErrorHelper);
    const httpServiceWrapper =
      module.get<HttpServiceWrapper>(HttpServiceWrapper);

    expect(httpErrorHelper).toBeDefined();
    expect(httpServiceWrapper).toBeDefined();

    // Verify that HttpServiceWrapper receives HttpErrorHelper as dependency
    expect(httpServiceWrapper['httpErrorHelper']).toBeDefined();
    expect(httpServiceWrapper['httpErrorHelper']).toBeInstanceOf(
      HttpErrorHelper,
    );
  });
});
