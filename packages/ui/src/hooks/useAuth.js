import { useMutation } from '@tanstack/react-query';
import { login as loginApi, register as registerApi } from '@/api/auth.api';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/components/Toaster';

function extractMessage(err) {
  return err?.error ?? err?.message ?? 'Something went wrong';
}

export function useLogin() {
  const { login } = useAuth();
  const navigate = useNavigate();
  return useMutation({
    mutationFn: loginApi,
    onSuccess: (data) => {
      login(data);
      navigate('/');
    },
    onError: (err) => toast.error(extractMessage(err)),
  });
}

export function useRegister() {
  const { login } = useAuth();
  const navigate = useNavigate();
  return useMutation({
    mutationFn: registerApi,
    onSuccess: (data) => {
      login(data);
      navigate('/');
    },
    onError: (err) => toast.error(extractMessage(err)),
  });
}
