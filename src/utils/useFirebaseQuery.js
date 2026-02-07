import { useQuery } from '@tanstack/react-query';
import { useEffect, useRef } from 'react';
import { useLoading } from './LoadingContext';

// Contador global para rastrear queries activas
let activeQueries = new Set();

// Callbacks registrados para actualizar el loading con contador de referencias
const loadingCallbacks = new Map();

const updateGlobalLoading = () => {
  const shouldBeLoading = activeQueries.size > 0;
  // Map.forEach signature: (value, key, map)
  // In our Map: key = setIsLoading (callback function), value = count
  // So forEach passes: (count, setIsLoading)
  loadingCallbacks.forEach((count, setIsLoadingCallback) => {
    if (count > 0) {
      setIsLoadingCallback(shouldBeLoading);
    }
  });
};

export const useFirebaseQuery = (queryKey, queryFn, options = {}) => {
  const { setIsLoading } = useLoading();
  const queryIdRef = useRef(Symbol('query-id'));
  const enabled = options.enabled !== false;

  const query = useQuery(queryKey, queryFn, {
    ...options,
    onSettled: (data, error) => {
      // Remover esta query del conjunto de queries activas
      activeQueries.delete(queryIdRef.current);
      updateGlobalLoading();

      if (options.onSettled) {
        options.onSettled(data, error);
      }
    },
  });

  // Registrar callback y manejar el estado de loading
  // Solo considerar loading las queries que están habilitadas; las disabled nunca llaman onSettled
  // y no deben sumar al indicador global para evitar que el BusyIndicator quede bloqueado (ej. nueva venta)
  useEffect(() => {
    // Capturar el ID de la query para el cleanup
    const queryId = queryIdRef.current;

    // Incrementar contador de referencias para este callback
    const currentCount = loadingCallbacks.get(setIsLoading) || 0;
    loadingCallbacks.set(setIsLoading, currentCount + 1);

    const isActuallyLoading = enabled && query.isLoading;
    if (isActuallyLoading) {
      activeQueries.add(queryId);
      updateGlobalLoading();
    }

    // Cleanup: remover del conjunto y decrementar contador cuando el componente se desmonta
    return () => {
      activeQueries.delete(queryId);
      const count = loadingCallbacks.get(setIsLoading) || 0;
      if (count > 1) {
        loadingCallbacks.set(setIsLoading, count - 1);
      } else {
        loadingCallbacks.delete(setIsLoading);
      }
      updateGlobalLoading();
    };
  }, [enabled, query.isLoading, setIsLoading]);

  return query;
};