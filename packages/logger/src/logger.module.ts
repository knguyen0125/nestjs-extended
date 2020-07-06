import { Module, DynamicModule } from '@nestjs/common';
import { Logger } from './logger.service';
import { WINSTON_LOGGER, WINSTON_LOGGER_OPTIONS } from './logger.constants';
import { LoggerModuleOptions } from './logger-module-options.interface';
import { createLogger, Logger as WinstonLogger } from 'winston';

@Module({
  providers: [Logger],
  exports: [Logger],
})
export class LoggerModule {
  forRoot(options: LoggerModuleOptions): DynamicModule {
    return {
      module: LoggerModule,
      providers: [
        {
          provide: WINSTON_LOGGER_OPTIONS,
          useValue: options,
        },
        {
          provide: WINSTON_LOGGER,
          useFactory: (options: LoggerModuleOptions) => {
            return createLogger(options);
          },
          inject: [WINSTON_LOGGER_OPTIONS],
        },
        {
          provide: Logger,
          useFactory: (logger: WinstonLogger) => {
            return new Logger(logger);
          },
          inject: [WINSTON_LOGGER],
        },
      ],
    };
  }

  forRootAsync() {}

  createLogger() {}
}
