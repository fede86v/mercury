import { useQuery } from '@tanstack/react-query';
import { useLoading } from './LoadingContext';

export const useFirebaseQuery = (queryKey, queryFn, options = {}) => {
  const { setIsLoading } = useLoading();

  return useQuery(queryKey, queryFn, {
    ...options,
    onSettled: (data, error) => {
      setIsLoading(false);
      if (options.onSettled) {
        options.onSettled(data, error);
      }
    },
  });
};