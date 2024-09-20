import { useMutation, useQueryClient } from '@tanstack/react-query';
import * as topicService from '../service/topicService';

export const useCreateTopic = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data) => {
      if (data) {
        const headers = new Headers();
        headers.append('token', `Bearer ${data.get('accessToken')}`);
        data.delete('accessToken');
        return await topicService.createTopic(data, headers);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['get-all-topic'] });
    },
  });
};

export const useUpdateTopic = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data) => {
      if (data) {
        const headers = new Headers();
        headers.append('token', `Bearer ${data.get('accessToken')}`);
        data.delete('accessToken');
        return await topicService.updateTopic(data, headers);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['get-all-topic'] });
    },
  });
};

export const useUpdateTrashTopic = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ topicIds, accessToken, trash }) => {
      if (topicIds && accessToken) {
        return await topicService.updateTrashTopic(topicIds, accessToken, trash);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['get-all-topic'] });
    },
  });
};

export const useDeleteTopic = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ topicIds, accessToken }) => {
      if (topicIds && accessToken) {
        return await topicService.deleteTopic(topicIds, accessToken);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['get-all-topic'] });
    },
  });
};
