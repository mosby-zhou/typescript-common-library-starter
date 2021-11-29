import { EventEmitter } from 'events';

/**
 * Syslog UDP options.
 */
export type <%= projectCodeName %>Options = {
  /**
   * Enable debug log. Defaults to `false`.
   */
  debug: boolean;
};

const default<%= projectCodeName %>Options: <%= projectCodeName %>Options = {
  debug: false,
};

/**
 * A <%= projectCodeName %> library.
 */
export class <%= projectCodeName %> extends EventEmitter {
  private options: <%= projectCodeName %>Options;

  constructor(options?: <%= projectCodeName %>Options) {
    super();
    this.options = {
      ...default<%= projectCodeName %>Options,
      ...options,
    };
  }
}
