import { create } from 'zustand';

interface UC {
  id: string;
  consumos: string[];
}

interface UCStore {
  ucs: UC[];
  consumoTotal: number; // Nova propriedade para armazenar o consumo total
  addUC: (uc: UC) => void;
  setUCs: (ucs: UC[]) => void;
  removeUC: (id: string) => void;
  clearUCs: () => void;
  setConsumoTotal: (total: number) => void; // Função para atualizar o consumo total
}

export const useUCStore = create<UCStore>((set) => ({
  ucs: [],
  consumoTotal: 0, // Inicializando o consumo total como 0
  addUC: (uc) => set((state) => ({ ucs: [...state.ucs, uc] })),
  setUCs: (ucs) => set({ ucs }),
  removeUC: (id) =>
    set((state) => ({ ucs: state.ucs.filter((uc) => uc.id !== id) })),
  clearUCs: () => set({ ucs: [] }),
  setConsumoTotal: (total) => set({ consumoTotal: total }), // Atualizando o consumo total
}));
