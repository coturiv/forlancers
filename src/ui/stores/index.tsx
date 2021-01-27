import React, { createContext, useContext } from 'react';
import FeedStore from './FeedStore';
import WinStore from './WinStore';

export const stores = {
  winStore: new WinStore(),
  feedStore: new FeedStore()
};

const StoreContext = createContext<typeof stores>(stores);

export const StoreProvider = ({ children }: React.PropsWithChildren<{}>) => {
  return <StoreContext.Provider value={stores}>{children}</StoreContext.Provider>;
};

export const useStore = () => useContext(StoreContext);
