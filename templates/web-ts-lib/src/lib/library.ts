import { Options } from './types';

export default class <%= projectCodeName %> {
  private options: Options;

  private version: string = process.env.VERSION || '0.0.1';

  constructor(options: Options) {
    this.options = options;
  }
}
