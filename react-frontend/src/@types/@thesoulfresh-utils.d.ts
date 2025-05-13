declare module '@thesoulfresh/utils' {
  export class ServiceBase {
    client: any
    constructor(client: any, debug: boolean)
    debug(...args: any[]): void
    info(...args: any[]): void
    warn(...args: any[]): void
    error(...args: any[]): void
    emit(...args: any[]): void
  }

  export function loggerMixin(item: any, prefix: string, debug?: boolean): void
  export function combineClasses(...args: any[]): string
}
