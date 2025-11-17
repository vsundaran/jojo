// src/screens/auth/LoginScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import styled from 'styled-components/native';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import { Container } from '../../components/common/Container';
import { Header } from '../../components/common/Header';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { apiClient } from '@services/api/apiClient';

const Content = styled.View<{ theme: any }>`
  flex: 1;
  justify-content: center;
  padding-top: ${({ theme }) => theme.spacing.xl * 2}px;
`;

const Title = styled.Text<{ theme: any }>`
  font-size: ${({ theme }) => theme.typography.h1.fontSize}px;
  font-weight: ${({ theme }) => theme.typography.h1.fontWeight};
  color: ${({ theme }) => theme.colors.text};
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing.xs}px;
`;

const Subtitle = styled.Text<{ theme: any }>`
  font-size: ${({ theme }) => theme.typography.body.fontSize}px;
  color: ${({ theme }) => theme.colors.textSecondary};
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing.xl}px;
`;

const FormContainer = styled.View<{ theme: any }>`
  margin-bottom: ${({ theme }) => theme.spacing.lg}px;
`;

const OTPContainer = styled.View<{ theme: any }>`
  margin-top: ${({ theme }) => theme.spacing.md}px;
  align-items: center;
`;

// const OTPInput = styled.(Input)`
//   flex: 1;
//   margin-right: ${({ theme }) => theme.spacing.sm}px;
// `;

const OTPInput = styled(Input)`
  flex: 1;
  margin-right: ${({ theme }) => 10}px;
  text-align: center;
  align-items: center;
  width: 100%;
`;

const ResendText = styled.Text<{ theme: any }>`
  color: ${({ theme }) => theme.colors.primary};
  font-size: ${({ theme }) => theme.typography.body.fontSize}px;
  text-align: center;
  margin-top: ${({ theme }) => theme.spacing.md}px;
`;

export const LoginScreen: React.FC = () => {
  const theme = useTheme();
  const { sendOTP, login, isLoading } = useAuth();

  const [mobileNumber, setMobileNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(true);
  const [countdown, setCountdown] = useState(0);

  const handleSendOTP = async (): Promise<void> => {
    if (!mobileNumber.trim()) {
      Alert.alert('Error', 'Please enter your mobile number');
      return;
    }

    // const response = await apiClient.post('/auth/send-otp', { mobileNumber });
    console.log(mobileNumber, 'mobileNumber');
    try {
      const success = await sendOTP(mobileNumber);
      if (success) {
        setOtpSent(true);
        setCountdown(60);
        startCountdown();
        Alert.alert('Success', 'OTP sent to your mobile number');
      }
    } catch (error: any) {
      console.log(error, 'error');
      Alert.alert(
        'Error',
        error.response?.data?.message || 'Failed to send OTP',
      );
    }
  };

  const startCountdown = (): void => {
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleResendOTP = (): void => {
    if (countdown === 0) {
      handleSendOTP();
    }
  };

  const handleVerifyOTP = async (): Promise<void> => {
    if (!otp.trim() || otp.length !== 6) {
      Alert.alert('Error', 'Please enter a valid 6-digit OTP');
      return;
    }

    try {
      await login(mobileNumber, otp);
      // Navigation is handled by the router based on auth state
    } catch (error: any) {
      Alert.alert(
        'Error',
        error.response?.data?.message || 'Failed to verify OTP',
      );
    }
  };

  return (
    <Container>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <Content theme={theme}>
            <Title theme={theme}>Join the Joy</Title>
            <Subtitle theme={theme}>
              Connect with people through meaningful video calls
            </Subtitle>

            <FormContainer theme={theme}>
              <Input
                label="Mobile Number"
                placeholder="Enter your mobile number"
                keyboardType="phone-pad"
                value={mobileNumber}
                onChangeText={setMobileNumber}
                editable={!otpSent}
                maxLength={15}
              />

              {otpSent && (
                <View style={{ marginTop: theme.spacing.md }}>
                  <OTPInput
                    label="OTP"
                    placeholder="000000"
                    keyboardType="number-pad"
                    value={otp}
                    onChangeText={setOtp}
                    maxLength={6}
                  />
                  <Button
                    title="Verify"
                    onPress={handleVerifyOTP}
                    loading={isLoading}
                    style={{ marginTop: theme.spacing.lg }}
                  />
                </View>
              )}

              {!otpSent ? (
                <Button
                  title="Send OTP"
                  onPress={handleSendOTP}
                  loading={isLoading}
                  fullWidth
                  style={{ marginTop: theme.spacing.lg }}
                />
              ) : (
                <ResendText
                  theme={theme}
                  onPress={handleResendOTP}
                  disabled={countdown > 0}
                >
                  {countdown > 0 ? `Resend OTP in ${countdown}s` : 'Resend OTP'}
                </ResendText>
              )}
            </FormContainer>
          </Content>
        </ScrollView>
      </KeyboardAvoidingView>
    </Container>
  );
};
