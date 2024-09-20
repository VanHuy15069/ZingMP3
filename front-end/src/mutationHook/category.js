import { useMutation, useQueryClient } from '@tanstack/react-query';
import * as categoryService from '../service/categoryService';

export const useCreateCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data) => {
      if (data) {
        const headers = new Headers();
        headers.append('token', `Bearer ${data.get('accessToken')}`);
        data.delete('accessToken');
        return await categoryService.createCategory(data, headers);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['get-all-category'] });
    },
  });
};

export const useUpdateCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data) => {
      if (data) {
        const headers = new Headers();
        headers.append('token', `Bearer ${data.get('accessToken')}`);
        data.delete('accessToken');
        return await categoryService.updateCategory(data, headers);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['get-all-category'] });
    },
  });
};

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ categoryIds, accessToken }) => {
      if (categoryIds && accessToken) {
        return await categoryService.deleteCategory(categoryIds, accessToken);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['get-all-category'] });
    },
  });
};

export const useUpdateTrashCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ categoryIds, accessToken, trash }) => {
      if (categoryIds && accessToken) {
        return await categoryService.updateTrashCategory(categoryIds, accessToken, trash);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['get-all-category'] });
    },
  });
};
