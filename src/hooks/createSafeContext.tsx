import { createContext, useContext } from 'react';

export function createSafeContext<ContextValue>(errorMessage: string) {
  const Context = createContext<ContextValue | null>(null);

  const useSafeContext = () => {
    const ctx = useContext(Context);

    if (ctx === null) {
      throw new Error(errorMessage);
    }

    return ctx;
  };

  const Provider = ({ children, ...props }: { children: React.ReactNode } & ContextValue) => (
    <Context.Provider value={props as ContextValue}>{children}</Context.Provider>
  );

  return [Provider, useSafeContext] as const;
}
