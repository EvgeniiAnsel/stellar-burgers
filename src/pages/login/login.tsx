import { FC, SyntheticEvent, useState } from 'react';
import { LoginUI } from '@ui-pages';
import { useDispatch, useSelector } from '../../services/store';
import {
  getIsAuthChecked,
  loginUser
} from '../../services/slices/user/userSlice';
import store from '../../services/store';

export const Login: FC = () => {
  const dispatch = useDispatch();
  const emailLocalStorage = localStorage.getItem('email');
  const [email, setEmail] = useState(
    emailLocalStorage ? emailLocalStorage : ''
  );
  const [password, setPassword] = useState('');

  const errorText = useSelector((store) => store.user.error);

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    if (!email || !password) {
      return;
    }
    dispatch(loginUser({ email, password }));
  };

  return (
    <LoginUI
      errorText={errorText ? errorText : ''}
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
    />
  );
};
