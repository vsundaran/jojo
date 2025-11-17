// src/screens/call/IncomingCallScreen.tsx
import React, { useEffect } from 'react';
import { View, Vibration } from 'react-native';
import styled from 'styled-components/native';
import { useTheme } from '../../contexts/ThemeContext';
import { useCall } from '../../contexts/CallContext';
import { Button } from '../../components/common/Button';
import Icon from 'react-native-vector-icons/MaterialIcons';

const IncomingCallContainer = styled.View<{ theme: any }>`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.primary};
  justify-content: space-between;
  padding: ${({ theme }) => theme.spacing.xl}px;
`;

const CallInfo = styled.View<{ theme: any }>`
  align-items: center;
  margin-top: ${({ theme }) => theme.spacing.xl * 2}px;
`;

const UserAvatar = styled.View<{ theme: any }>`
  width: 120px;
  height: 120px;
  border-radius: 60px;
  background-color: ${({ theme }) => theme.colors.background};
  justify-content: center;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.lg}px;
`;

const UserAvatarText = styled.Text<{ theme: any }>`
  color: ${({ theme }) => theme.colors.primary};
  font-size: 48px;
  font-weight: bold;
`;

const CallTitle = styled.Text<{ theme: any }>`
  color: ${({ theme }) => theme.colors.background};
  font-size: ${({ theme }) => theme.typography.h1.fontSize}px;
  font-weight: ${({ theme }) => theme.typography.h1.fontWeight};
  margin-bottom: ${({ theme }) => theme.spacing.sm}px;
  text-align: center;
`;

const CallSubtitle = styled.Text<{ theme: any }>`
  color: ${({ theme }) => theme.colors.background};
  font-size: ${({ theme }) => theme.typography.h3.fontSize}px;
  opacity: 0.9;
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing.md}px;
`;

const CallDetails = styled.View<{ theme: any }>`
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.xl}px;
`;

const CategoryBadge = styled.View<{ theme: any }>`
  background-color: ${({ theme }) => theme.colors.accent};
  padding-horizontal: ${({ theme }) => theme.spacing.md}px;
  padding-vertical: ${({ theme }) => theme.spacing.sm}px;
  border-radius: ${({ theme }) => theme.borderRadius.md}px;
  margin-bottom: ${({ theme }) => theme.spacing.sm}px;
`;

const CategoryText = styled.Text<{ theme: any }>`
  color: ${({ theme }) => theme.colors.background};
  font-size: ${({ theme }) => theme.typography.body.fontSize}px;
  font-weight: 600;
`;

const DescriptionText = styled.Text<{ theme: any }>`
  color: ${({ theme }) => theme.colors.background};
  font-size: ${({ theme }) => theme.typography.body.fontSize}px;
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing.sm}px;
  opacity: 0.9;
`;

const CallControls = styled.View<{ theme: any }>`
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.xl}px;
`;

const ControlButton = styled.TouchableOpacity<{ theme: any; variant: 'accept' | 'reject' }>`
  width: 80px;
  height: 80px;
  border-radius: 40px;
  background-color: ${({ theme, variant }) => 
    variant === 'accept' ? theme.colors.success : theme.colors.error};
  justify-content: center;
  align-items: center;
  shadow-color: #000;
  shadow-offset: 0px 4px;
  shadow-opacity: 0.3;
  shadow-radius: 5px;
  elevation: 8;
`;

export const IncomingCallScreen: React.FC = () => {
  const theme = useTheme();
  const { incomingCall, acceptCall, rejectCall } = useCall();

  useEffect(() => {
    // Vibrate pattern for incoming call
    const vibrationPattern = [1000, 1000, 1000];
    Vibration.vibrate(vibrationPattern, true);

    return () => {
      Vibration.cancel();
    };
  }, []);

  if (!incomingCall) {
    return null;
  }

  const getUserInitials = (name: string): string => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <IncomingCallContainer theme={theme}>
      <CallInfo theme={theme}>
        <UserAvatar theme={theme}>
          <UserAvatarText theme={theme}>
            {getUserInitials(incomingCall.creator.name)}
          </UserAvatarText>
        </UserAvatar>
        
        <CallTitle theme={theme}>Incoming Call</CallTitle>
        <CallSubtitle theme={theme}>
          {incomingCall.creator.name}
        </CallSubtitle>

        <CallDetails theme={theme}>
          <CategoryBadge theme={theme}>
            <CategoryText theme={theme}>
              {incomingCall.category}
            </CategoryText>
          </CategoryBadge>
          <DescriptionText theme={theme}>
            {incomingCall.content}
          </DescriptionText>
        </CallDetails>
      </CallInfo>

      <CallControls theme={theme}>
        <ControlButton 
          theme={theme} 
          variant="reject"
          onPress={rejectCall}
        >
          <Icon name="call-end" size={32} color={theme.colors.background} />
        </ControlButton>

        <ControlButton 
          theme={theme} 
          variant="accept"
          onPress={acceptCall}
        >
          <Icon name="call" size={32} color={theme.colors.background} />
        </ControlButton>
      </CallControls>
    </IncomingCallContainer>
  );
};