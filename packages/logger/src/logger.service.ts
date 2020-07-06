import { Injectable, LoggerService, Scope } from '@nestjs/common';
import { Logger as WinstonLogger } from 'winston';
import PrettyError from 'pretty-error';

@Injectable({ scope: Scope.TRANSIENT })
export class Logger implements LoggerService {
  private context?: string;
  private pe?: PrettyError;

  constructor(private readonly logger: WinstonLogger) {
    if (__DEV__) {
      this.pe = new PrettyError();
      this.pe.skipNodeFiles();
      this.pe.skipPackage('express', '@nestjs/common', '@nestjs/core');
    }
  }

  setContext(context: string) {
    this.context = context;
  }

  log(message: any, context?: string | undefined) {
    return this.logger.info(message, { context: context || this.context });
  }

  error(
    message: any,
    error?: Error | string | undefined,
    context?: string | undefined,
  ) {
    this.logger.error(message, {
      error,
      context: context || this.context,
    });

    if (__DEV__ && this.pe && error instanceof Error) {
      this.pe.render(error);
    }
  }

  warn(message: any, context?: string | undefined) {
    return this.logger.warn(message, {
      context: context || this.context,
    });
  }

  debug?(message: any, context?: string | undefined) {
    return this.logger.debug(message, {
      context: context || this.context,
    });
  }

  verbose?(message: any, context?: string | undefined) {
    return this.logger.verbose(message, {
      context: context || this.context,
    });
  }
}
