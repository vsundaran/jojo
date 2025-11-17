// src/screens/call/CallScreen.tsx
import React, { useState, useEffect } from 'react';
import { View, Alert, Vibration } from 'react-native';
import styled from 'styled-components/native';
import { useTheme } from '../../contexts/ThemeContext';
import { useCall } from '../../contexts/CallContext';
import { useAuth } from '../../contexts/AuthContext';
import { Container } from '../../components/common/Container';
import { Button } from '../../components/common/Button';
import { callApi } from '../../services/api/callApi';

import Icon from 'react-native-vector-icons/MaterialIcons';


const CallContainer = styled.View<{ theme: any }>`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background};
`;

const CallHeader = styled.View<{ theme: any }>`
  background-color: ${({ theme }) => theme.colors.primary};
  padding: ${({ theme }) => theme.spacing.xl}px;
  align-items: center;
`;

const CallTitle = styled.Text<{ theme: any }>`
  color: ${({ theme }) => theme.colors.background};
  font-size: ${({ theme }) => theme.typography.h1.fontSize}px;
  font-weight: ${({ theme }) => theme.typography.h1.fontWeight};
  margin-bottom: ${({ theme }) => theme.spacing.xs}px;
`;

const CallSubtitle = styled.Text<{ theme: any }>`
  color: ${({ theme }) => theme.colors.background};
  font-size: ${({ theme }) => theme.typography.body.fontSize}px;
  opacity: 0.9;
`;

const CallContent = styled.View<{ theme: any }>`
  flex: 1;
  justify-content: space-between;
  padding: ${({ theme }) => theme.spacing.xl}px;
`;

const UserInfo = styled.View<{ theme: any }>`
  align-items: center;
  margin-top: ${({ theme }) => theme.spacing.xl * 2}px;
`;

const UserAvatar = styled.View<{ theme: any }>`
  width: 120px;
  height: 120px;
  border-radius: 60px;
  background-color: ${({ theme }) => theme.colors.primary};
  justify-content: center;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.lg}px;
`;

const UserAvatarText = styled.Text<{ theme: any }>`
  color: ${({ theme }) => theme.colors.background};
  font-size: 48px;
  font-weight: bold;
`;

const UserName = styled.Text<{ theme: any }>`
  font-size: ${({ theme }) => theme.typography.h2.fontSize}px;
  font-weight: ${({ theme }) => theme.typography.h2.fontWeight};
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: ${({ theme }) => theme.spacing.xs}px;
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
  font-size: ${({ theme }) => theme.typography.body.fontSize}px;
  color: ${({ theme }) => theme.colors.textSecondary};
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing.sm}px;
`;

const LanguageTags = styled.View<{ theme: any }>`
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  margin-top: ${({ theme }) => theme.spacing.sm}px;
`;

const LanguageTag = styled.Text<{ theme: any }>`
  background-color: ${({ theme }) => theme.colors.border};
  color: ${({ theme }) => theme.colors.text};
  font-size: ${({ theme }) => theme.typography.caption.fontSize}px;
  padding-horizontal: ${({ theme }) => theme.spacing.sm}px;
  padding-vertical: ${({ theme }) => theme.spacing.xs}px;
  border-radius: ${({ theme }) => theme.borderRadius.sm}px;
  margin: ${({ theme }) => theme.spacing.xs}px;
`;

const CallTimer = styled.Text<{ theme: any }>`
  font-size: 48px;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.text};
  text-align: center;
  margin-vertical: ${({ theme }) => theme.spacing.xl}px;
`;

const CallControls = styled.View<{ theme: any }>`
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  padding-horizontal: ${({ theme }) => theme.spacing.xl}px;
`;

const ControlButton = styled.TouchableOpacity<{ theme: any; variant: 'end' | 'mute' | 'video' }>`
  width: 70px;
  height: 70px;
  border-radius: 35px;
  background-color: ${({ theme, variant }) => 
    variant === 'end' ? theme.colors.error : theme.colors.surface};
  justify-content: center;
  align-items: center;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.2;
  shadow-radius: 3px;
  elevation: 5;
`;

export const CallScreen: React.FC = () => {
  const theme = useTheme();
  const { activeCall, endCall, callStatus } = useCall();
  const { user } = useAuth();
  const [callDuration, setCallDuration] = useState(0);
  const [timer, setTimer] = useState<any>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(true);

  useEffect(() => {
    if (callStatus === 'connected' && activeCall) {
      // Start call timer
      const startTime = new Date(activeCall.startTime).getTime();
      const updateTimer = (): void => {
        const now = new Date().getTime();
        const duration = Math.floor((now - startTime) / 1000);
        setCallDuration(duration);
        
        // Auto-end call after 30 seconds
        if (duration >= 30) {
          handleEndCall();
        }
      };

      setTimer(setInterval(updateTimer, 1000));
      updateTimer();

      return () => {
        if (timer) clearInterval(timer);
      };
    }
  }, [callStatus, activeCall]);

  useEffect(() => {
    if (callStatus === 'connecting') {
      // Vibrate when call is connecting
      Vibration.vibrate([500, 500, 500]);
    }
  }, [callStatus]);

  const handleEndCall = async (): Promise<void> => {
    if (timer) clearInterval(timer);
    
    try {
      if (activeCall) {
        await callApi.endCall(activeCall.callId);
      }
    } catch (error) {
      console.error('Error ending call:', error);
    } finally {
      endCall();
    }
  };

  const handleToggleMute = (): void => {
    setIsMuted(!isMuted);
    // Implement mute functionality with Azure ACS
  };

  const handleToggleVideo = (): void => {
    setIsVideoOn(!isVideoOn);
    // Implement video toggle functionality with Azure ACS
  };

  if (!activeCall) {
    return (
      <Container>
        <CallHeader theme={theme}>
          <CallTitle theme={theme}>Call Ended</CallTitle>
        </CallHeader>
        <CallContent theme={theme}>
          <UserInfo theme={theme}>
            <CallSubtitle theme={theme}>
              The call has been completed
            </CallSubtitle>
          </UserInfo>
          <Button
            title="Back to Home"
            onPress={endCall}
            fullWidth
          />
        </CallContent>
      </Container>
    );
  }

  const otherUser = user?.id === activeCall.creator.id 
    ? activeCall.participant 
    : activeCall.creator;

  const getUserInitials = (name: string): string => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <CallContainer theme={theme}>
      <CallHeader theme={theme}>
        <CallTitle theme={theme}>
          {callStatus === 'connecting' ? 'Connecting...' : 'Live Call'}
        </CallTitle>
        <CallSubtitle theme={theme}>
          {activeCall.category} • {activeCall.subCategory}
        </CallSubtitle>
      </CallHeader>

      <CallContent theme={theme}>
        <UserInfo theme={theme}>
          <UserAvatar theme={theme}>
            <UserAvatarText theme={theme}>
              {getUserInitials(otherUser.name)}
            </UserAvatarText>
          </UserAvatar>
          <UserName theme={theme}>{otherUser.name}</UserName>
          
          <CallDetails theme={theme}>
            <CategoryBadge theme={theme}>
              <CategoryText theme={theme}>
                {activeCall.category}
              </CategoryText>
            </CategoryBadge>
            <DescriptionText theme={theme}>
              {activeCall.moment.content}
            </DescriptionText>
            <LanguageTags theme={theme}>
              {activeCall.languages.map(language => (
                <LanguageTag key={language} theme={theme}>
                  {language}
                </LanguageTag>
              ))}
            </LanguageTags>
          </CallDetails>

          {callStatus === 'connected' && (
            <CallTimer theme={theme}>
              {formatTime(callDuration)}
            </CallTimer>
          )}
        </UserInfo>

        <CallControls theme={theme}>
          <ControlButton 
            theme={theme} 
            variant="mute"
            onPress={handleToggleMute}
          >
            <Icon 
              name={isMuted ? "mic-off" : "mic"} 
              size={24} 
              color={theme.colors.text} 
            />
          </ControlButton>

          <ControlButton 
            theme={theme} 
            variant="video"
            onPress={handleToggleVideo}
          >
            <Icon 
              name={isVideoOn ? "videocam" : "videocam-off"} 
              size={24} 
              color={theme.colors.text} 
            />
          </ControlButton>

          <ControlButton 
            theme={theme} 
            variant="end"
            onPress={handleEndCall}
          >
            <Icon name="call-end" size={24} color={theme.colors.background} />
          </ControlButton>
        </CallControls>
      </CallContent>
    </CallContainer>
  );
};