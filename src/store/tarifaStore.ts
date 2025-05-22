import { create } from 'zustand';

interface TarifaState {
  teRaw: string;
  tusdRaw: string;
  pis: string;
  cofins: string;
  icms: string;
  setTeRaw: (value: string) => void;
  setTusdRaw: (value: string) => void;
  setPis: (value: string) => void;
  setCofins: (value: string) => void;
  setIcms: (value: string) => void;
}

export const useTarifaStore = create<TarifaState>((set) => ({
  teRaw: "0,290190",
  tusdRaw: "0,339820",
  pis: "0,9700",
  cofins: "4,4400",
  icms: "19",
  setTeRaw: (value) => set({ teRaw: value }),
  setTusdRaw: (value) => set({ tusdRaw: value }),
  setPis: (value) => set({ pis: value }),
  setCofins: (value) => set({ cofins: value }),
  setIcms: (value) => set({ icms: value }),
})); 