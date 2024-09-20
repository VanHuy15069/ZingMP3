import { useMutation, useQueryClient } from '@tanstack/react-query';
import * as sliderService from '../service/sliderService';

export const useCreateSlider = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data) => {
      if (data) {
        const headers = new Headers();
        headers.append('token', `Bearer ${data.get('accessToken')}`);
        data.delete('accessToken');
        return await sliderService.createSlider(data, headers);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['slider'] });
    },
  });
};

export const useUpdateSlider = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data) => {
      if (data) {
        const headers = new Headers();
        headers.append('token', `Bearer ${data.get('accessToken')}`);
        data.delete('accessToken');
        return await sliderService.updateSlider(data, headers);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['slider'] });
    },
  });
};

export const useUpdateTrashSlider = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ sliderIds, accessToken, trash }) => {
      if (sliderIds && accessToken) {
        return await sliderService.updateTrashSlider(sliderIds, accessToken, trash);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['slider'] });
    },
  });
};

export const useDeleteSlider = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ sliderIds, accessToken }) => {
      if (sliderIds && accessToken) {
        return await sliderService.deleteSlider(sliderIds, accessToken);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['slider'] });
    },
  });
};
