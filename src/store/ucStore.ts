import { create } from 'zustand';

interface UC {
  id: string;
  numeroUC: string;
  consumos: string[];
  tipoUc: string;
  fornecimento: string;
  consumoNoturno: string;
  iluminacao: string;
  tarifaFinal: string; // Salvo do TarifaModal já calculado
}

interface UCStore {
  ucs: UC[];
  consumoTotal: number;
  addUC: (uc: UC) => void;
  updateUC: (id: string, data: Partial<UC>) => void;
  setUCs: (ucs: UC[]) => void;
  removeUC: (id: string) => void;
  clearUCs: () => void;
  setConsumoTotal: (total: number) => void;
}

export const useUCStore = create<UCStore>((set) => ({
  ucs: [],
  consumoTotal: 0,
  addUC: (uc) => set((state) => ({ ucs: [...state.ucs, uc] })),
  updateUC: (id, data) =>
    set((state) => ({
      ucs: state.ucs.map((uc) => (uc.id === id ? { ...uc, ...data } : uc)),
    })),
  setUCs: (ucs) => set({ ucs }),
  removeUC: (id) =>
    set((state) => ({ ucs: state.ucs.filter((uc) => uc.id !== id) })),
  clearUCs: () => set({ ucs: [] }),
  setConsumoTotal: (total) => set({ consumoTotal: total }),
}));
