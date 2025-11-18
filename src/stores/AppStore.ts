import { createSelectorFunctions } from 'auto-zustand-selectors-hook';
import { create } from 'zustand';

export interface IAppStore {
  openSideBar: 'SHOW' | 'ZOOM-OUT' | 'HIDDEN';
  toggleSidebar: () => void;
  setOpenSideBar: (data: 'SHOW' | 'ZOOM-OUT' | 'HIDDEN') => void;
}

const useBaseAppStore = create<IAppStore>((set) => ({
  openSideBar: 'SHOW',
  setOpenSideBar: (data) => set(({ openSideBar }) => ({ openSideBar: data })),
  toggleSidebar: () =>
    set(({ openSideBar }) => {
      switch (openSideBar) {
        case 'SHOW':
          return { openSideBar: 'ZOOM-OUT' };
        case 'ZOOM-OUT':
          return { openSideBar: 'HIDDEN' };
        case 'HIDDEN':
          return { openSideBar: 'SHOW' };

        default:
          return { openSideBar: 'ZOOM-OUT' };
      }
    }),
}));

export const useAppStore = createSelectorFunctions(useBaseAppStore);
