import { createContext, useState } from 'react';

export const Context = createContext();

function Provider({ children }) {
  const [isReload, setIsReload] = useState(false);
  return <Context.Provider value={[isReload, setIsReload]}>{children}</Context.Provider>;
}

export default Provider;
