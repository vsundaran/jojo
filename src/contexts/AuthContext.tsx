// src/contexts/AuthContext.tsx
import React, {
  createContext,
  useContext,
  useReducer,
  ReactNode,
  useEffect,
} from 'react';
import { AuthState, User } from '../types';
import { authApi } from '../services/api/authApi';
import { storageService, StorageKeys } from '../services/storage/storage';

type AuthAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'LOGIN_SUCCESS'; payload: { user: User; token: string } }
  | { type: 'UPDATE_USER'; payload: User }
  | { type: 'LOGOUT' }
  | { type: 'SET_AUTH_STATE'; payload: AuthState };

interface AuthContextType extends AuthState {
  login: (mobileNumber: string, otp: string) => Promise<void>;
  sendOTP: (mobileNumber: string) => Promise<boolean>;
  completeProfile: (languages: string[]) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
};

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        isLoading: false,
      };
    case 'UPDATE_USER':
      return { ...state, user: action.payload };
    case 'LOGOUT':
      return { ...initialState, isLoading: false };
    case 'SET_AUTH_STATE':
      return action.payload;
    default:
      return state;
  }
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    checkAuthState();
  }, []);

  const checkAuthState = async (): Promise<void> => {
    try {
      const [token, userData] = await Promise.all([
        storageService.getItem(StorageKeys.AUTH_TOKEN),
        storageService.getItem(StorageKeys.USER_DATA),
      ]);

      if (token && userData) {
        const user = JSON.parse(userData);
        dispatch({
          type: 'SET_AUTH_STATE',
          payload: {
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
          },
        });
      } else {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    } catch (error) {
      console.error('Error checking auth state:', error);
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const sendOTP = async (mobileNumber: string): Promise<boolean> => {
    try {
      const response = await authApi.sendOTP({ mobileNumber });
      // console.log('sendOTP response', response);
      return response.success;
    } catch (error) {
      console.error('Error sending OTP:', error);
      throw error;
    }
  };

  const login = async (mobileNumber: string, otp: string): Promise<void> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await authApi.verifyOTP({ mobileNumber, otp });

      if (response.success && response.token && response.user) {
        await Promise.all([
          storageService.setItem(StorageKeys.AUTH_TOKEN, response.token),
          storageService.setItem(
            StorageKeys.USER_DATA,
            JSON.stringify(response.user),
          ),
        ]);

        dispatch({
          type: 'LOGIN_SUCCESS',
          payload: { user: response.user, token: response.token },
        });
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const completeProfile = async (languages: string[]): Promise<void> => {
    try {
      const response = await authApi.completeProfile({ languages });
      if (response.success && response.user) {
        await storageService.setItem(
          StorageKeys.USER_DATA,
          JSON.stringify(response.user),
        );
        dispatch({ type: 'UPDATE_USER', payload: response.user });
      }
    } catch (error) {
      console.error('Complete profile error:', error);
      throw error;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await Promise.all([
        storageService.removeItem(StorageKeys.AUTH_TOKEN),
        storageService.removeItem(StorageKeys.USER_DATA),
        authApi.logout(),
      ]);
      dispatch({ type: 'LOGOUT' });
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  };

  const updateUser = (user: User): void => {
    dispatch({ type: 'UPDATE_USER', payload: user });
  };

  const value: AuthContextType = {
    ...state,
    sendOTP,
    login,
    completeProfile,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
