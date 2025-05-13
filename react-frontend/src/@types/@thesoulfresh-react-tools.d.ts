declare module '@thesoulfresh/react-tools' {
  export function useId(prefix?: any): string
  export function useTimeout(): (cb: any, ms?: number) => void
  export function userLocale(): string
  export function localeUnitIsPrefixed(): boolean
  export function useProcessEvent(): (cb: (e: any) => void) => () => void
  export function useMaybeControlled(
    isOpen: boolean,
    setIsOpen: any,
    defaultValue: boolean,
  ): [boolean, any]
}
