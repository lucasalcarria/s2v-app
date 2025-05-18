import React, { createContext, useContext, useReducer, ReactNode } from 'react';

interface TarifaState {
  teRaw: string;
  tusdRaw: string;
  pis: string;
  cofins: string;
  icms: string;
  tarifaFinal: string;
}

type TarifaAction = 
  | { type: 'SET_TARIFA'; payload: TarifaState }
  | { type: 'RESET_TARIFA' };

const initialState: TarifaState = {
  teRaw: '0,290190',
  tusdRaw: '0,339820',
  pis: '0,9700',
  cofins: '4,4400',
  icms: '19',
  tarifaFinal: '',
};

const TarifaContext = createContext<{
  state: TarifaState;
  dispatch: React.Dispatch<TarifaAction>;
} | undefined>(undefined);

function tarifaReducer(state: TarifaState, action: TarifaAction): TarifaState {
  switch (action.type) {
    case 'SET_TARIFA':
      return {
        ...state,
        ...action.payload,
      };
    case 'RESET_TARIFA':
      return initialState;
    default:
      return state;
  }
}

export function TarifaProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(tarifaReducer, initialState);

  return (
    <TarifaContext.Provider value={{ state, dispatch }}>
      {children}
    </TarifaContext.Provider>
  );
}

export function useTarifa() {
  const context = useContext(TarifaContext);
  if (context === undefined) {
    throw new Error('useTarifa must be used within a TarifaProvider');
  }
  return context;
} 