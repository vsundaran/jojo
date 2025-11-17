// src/contexts/CallContext.tsx
import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { CallSession, Moment, User } from '../types';

interface CallState {
  activeCall: CallSession | null;
  incomingCall: Moment | null;
  isInCall: boolean;
  callStatus: 'idle' | 'connecting' | 'connected' | 'ending' | 'completed';
}

type CallAction =
  | { type: 'SET_ACTIVE_CALL'; payload: CallSession | null }
  | { type: 'SET_INCOMING_CALL'; payload: Moment | null }
  | { type: 'SET_CALL_STATUS'; payload: CallState['callStatus'] }
  | { type: 'END_CALL' };

interface CallContextType extends CallState {
  startCall: (callSession: CallSession) => void;
  receiveIncomingCall: (moment: Moment) => void;
  acceptCall: () => void;
  rejectCall: () => void;
  endCall: () => void;
  updateCallStatus: (status: CallState['callStatus']) => void;
}

const CallContext = createContext<CallContextType | undefined>(undefined);

const initialState: CallState = {
  activeCall: null,
  incomingCall: null,
  isInCall: false,
  callStatus: 'idle',
};

const callReducer = (state: CallState, action: CallAction): CallState => {
  switch (action.type) {
    case 'SET_ACTIVE_CALL':
      return {
        ...state,
        activeCall: action.payload,
        isInCall: !!action.payload,
        incomingCall: null,
      };
    case 'SET_INCOMING_CALL':
      return {
        ...state,
        incomingCall: action.payload,
      };
    case 'SET_CALL_STATUS':
      return {
        ...state,
        callStatus: action.payload,
      };
    case 'END_CALL':
      return {
        ...initialState,
      };
    default:
      return state;
  }
};

export const CallProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(callReducer, initialState);

  const startCall = (callSession: CallSession): void => {
    dispatch({ type: 'SET_ACTIVE_CALL', payload: callSession });
    dispatch({ type: 'SET_CALL_STATUS', payload: 'connecting' });
  };

  const receiveIncomingCall = (moment: Moment): void => {
    dispatch({ type: 'SET_INCOMING_CALL', payload: moment });
  };

  const acceptCall = (): void => {
    if (state.incomingCall) {
      // Here you would typically create a call session
      const callSession: CallSession = {
        id: 'temp-id',
        callId: `call-${Date.now()}`,
        moment: state.incomingCall,
        creator: state.incomingCall.creator,
        participant: {} as User, // This would be the current user
        category: state.incomingCall.category,
        subCategory: state.incomingCall.subCategory,
        languages: state.incomingCall.languages,
        status: 'connected',
        startTime: new Date().toISOString(),
        duration: 0,
      };
      dispatch({ type: 'SET_ACTIVE_CALL', payload: callSession });
      dispatch({ type: 'SET_CALL_STATUS', payload: 'connected' });
    }
  };

  const rejectCall = (): void => {
    dispatch({ type: 'SET_INCOMING_CALL', payload: null });
  };

  const endCall = (): void => {
    dispatch({ type: 'END_CALL' });
  };

  const updateCallStatus = (status: CallState['callStatus']): void => {
    dispatch({ type: 'SET_CALL_STATUS', payload: status });
  };

  const value: CallContextType = {
    ...state,
    startCall,
    receiveIncomingCall,
    acceptCall,
    rejectCall,
    endCall,
    updateCallStatus,
  };

  return <CallContext.Provider value={value}>{children}</CallContext.Provider>;
};

export const useCall = (): CallContextType => {
  const context = useContext(CallContext);
  if (!context) {
    throw new Error('useCall must be used within a CallProvider');
  }
  return context;
};
