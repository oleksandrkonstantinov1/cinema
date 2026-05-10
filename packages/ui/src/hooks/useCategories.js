import { useQuery } from '@tanstack/react-query';
import { getCategories, getCountries } from '@/api/categories.api';

export function useCategories() {
  return useQuery({ queryKey: ['categories'], queryFn: getCategories, staleTime: Infinity });
}

export function useCountries() {
  return useQuery({ queryKey: ['countries'], queryFn: getCountries, staleTime: Infinity });
}
