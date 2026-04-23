import { createContext, useContext } from 'react';
import type { useProjectState } from './useProjectState.ts';

export const ProjectContext = createContext<ReturnType<typeof useProjectState> | null>(null);

export function useProjectContext() {
    const ctx = useContext(ProjectContext);
    if (!ctx) throw new Error('useProjectContext must be used inside ProjectContext.Provider');
    return ctx;
}