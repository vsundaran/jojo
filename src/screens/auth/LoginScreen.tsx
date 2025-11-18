// // src/screens/auth/LoginScreen.tsx
// import React, { useState } from 'react';
// import {
//   View,
//   Alert,
//   KeyboardAvoidingView,
//   Platform,
//   ScrollView,
// } from 'react-native';
// import styled from 'styled-components/native';
// import { useTheme } from '../../contexts/ThemeContext';
// import { useAuth } from '../../contexts/AuthContext';
// import { Container } from '../../components/common/Container';
// import { Header } from '../../components/common/Header';
// import { Button } from '../../components/common/Button';
// import { Input } from '../../components/common/Input';

// const Content = styled.View<{ theme: any }>`
//   flex: 1;
//   justify-content: center;
//   padding-top: ${({ theme }) => theme.spacing.xl * 2}px;
// `;

// const Title = styled.Text<{ theme: any }>`
//   font-size: ${({ theme }) => theme.typography.h1.fontSize}px;
//   font-weight: ${({ theme }) => theme.typography.h1.fontWeight};
//   color: ${({ theme }) => theme.colors.text};
//   text-align: center;
//   margin-bottom: ${({ theme }) => theme.spacing.xs}px;
// `;

// const Subtitle = styled.Text<{ theme: any }>`
//   font-size: ${({ theme }) => theme.typography.body.fontSize}px;
//   color: ${({ theme }) => theme.colors.textSecondary};
//   text-align: center;
//   margin-bottom: ${({ theme }) => theme.spacing.xl}px;
// `;

// const FormContainer = styled.View<{ theme: any }>`
//   margin-bottom: ${({ theme }) => theme.spacing.lg}px;
// `;

// const OTPContainer = styled.View<{ theme: any }>`
//   margin-top: ${({ theme }) => theme.spacing.md}px;
//   align-items: center;
// `;

// // const OTPInput = styled.(Input)`
// //   flex: 1;
// //   margin-right: ${({ theme }) => theme.spacing.sm}px;
// // `;

// const OTPInput = styled(Input)`
//   flex: 1;
//   margin-right: ${({ theme }) => 10}px;
//   text-align: center;
//   align-items: center;
//   width: 100%;
// `;

// const ResendText = styled.Text<{ theme: any }>`
//   color: ${({ theme }) => theme.colors.primary};
//   font-size: ${({ theme }) => theme.typography.body.fontSize}px;
//   text-align: center;
//   margin-top: ${({ theme }) => theme.spacing.md}px;
// `;

// export const LoginScreen: React.FC = () => {
//   const theme = useTheme();
//   const { sendOTP, login, isLoading } = useAuth();

//   const [mobileNumber, setMobileNumber] = useState('');
//   const [otp, setOtp] = useState('');
//   const [otpSent, setOtpSent] = useState(true);
//   const [countdown, setCountdown] = useState(0);

//   const handleSendOTP = async (): Promise<void> => {
//     if (!mobileNumber.trim()) {
//       Alert.alert('Error', 'Please enter your mobile number');
//       return;
//     }

//     // const response = await apiClient.post('/auth/send-otp', { mobileNumber });
//     console.log(mobileNumber, 'mobileNumber');
//     try {
//       const success = await sendOTP(mobileNumber);
//       if (success) {
//         setOtpSent(true);
//         setCountdown(60);
//         startCountdown();
//         Alert.alert('Success', 'OTP sent to your mobile number');
//       }
//     } catch (error: any) {
//       console.log(error, 'error');
//       Alert.alert(
//         'Error',
//         error.response?.data?.message || 'Failed to send OTP',
//       );
//     }
//   };

//   const startCountdown = (): void => {
//     const timer = setInterval(() => {
//       setCountdown(prev => {
//         if (prev <= 1) {
//           clearInterval(timer);
//           return 0;
//         }
//         return prev - 1;
//       });
//     }, 1000);
//   };

//   const handleResendOTP = (): void => {
//     if (countdown === 0) {
//       handleSendOTP();
//     }
//   };

//   const handleVerifyOTP = async (): Promise<void> => {
//     if (!otp.trim() || otp.length !== 6) {
//       Alert.alert('Error', 'Please enter a valid 6-digit OTP');
//       return;
//     }

//     try {
//       await login(mobileNumber, otp);
//       // Navigation is handled by the router based on auth state
//     } catch (error: any) {
//       Alert.alert(
//         'Error',
//         error.response?.data?.message || 'Failed to verify OTP',
//       );
//     }
//   };

//   return (
//     <View style={{ flex: 1 }}>
//       <Header title="Login" />
//       <Container>
//         <KeyboardAvoidingView
//           behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//           style={{ flex: 1 }}
//         >
//           <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
//             <Content theme={theme}>
//               <Title theme={theme}>Join the Joy</Title>
//               <Subtitle theme={theme}>
//                 Connect with people through meaningful video calls
//               </Subtitle>

//               <FormContainer theme={theme}>
//                 <Input
//                   label="Mobile Number"
//                   placeholder="Enter your mobile number"
//                   keyboardType="phone-pad"
//                   value={mobileNumber}
//                   onChangeText={setMobileNumber}
//                   editable={!otpSent}
//                   maxLength={15}
//                 />

//                 {otpSent && (
//                   <View style={{ marginTop: theme.spacing.md }}>
//                     <OTPInput
//                       label="OTP"
//                       placeholder="000000"
//                       keyboardType="number-pad"
//                       value={otp}
//                       onChangeText={setOtp}
//                       maxLength={6}
//                     />
//                     <Button
//                       title="Verify"
//                       onPress={handleVerifyOTP}
//                       loading={isLoading}
//                       style={{ marginTop: theme.spacing.lg }}
//                     />
//                   </View>
//                 )}

//                 {!otpSent ? (
//                   <Button
//                     title="Send OTP"
//                     onPress={handleSendOTP}
//                     loading={isLoading}
//                     fullWidth
//                     style={{ marginTop: theme.spacing.lg }}
//                   />
//                 ) : (
//                   <ResendText
//                     theme={theme}
//                     onPress={handleResendOTP}
//                     disabled={countdown > 0}
//                   >
//                     {countdown > 0
//                       ? `Resend OTP in ${countdown}s`
//                       : 'Resend OTP'}
//                   </ResendText>
//                 )}
//               </FormContainer>
//             </Content>
//           </ScrollView>
//         </KeyboardAvoidingView>
//       </Container>
//     </View>
//   );
// };

// src/screens/auth/LoginScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  Text,
} from 'react-native';
import styled from 'styled-components/native';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import { Container } from '../../components/common/Container';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Header } from '@components/common/Header';
import { StatusBarComponent } from '@components/common/StatusBar';

const HeaderContainer = styled.View<{ theme: any }>`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.lg}px;
  padding-top: ${({ theme }) => theme.spacing.xl}px;
`;

const LogoContainer = styled.View<{ theme: any }>`
  align-items: center;
  margin-top: ${({ theme }) => theme.spacing.xl}px;
  margin-bottom: ${({ theme }) => theme.spacing.lg}px;
`;

const LogoBox = styled.View<{ theme: any }>`
  width: 80px;
  height: 80px;
  border-radius: 20px;
  background-color: #fafafa;
  justify-content: center;
  align-items: center;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.08);
  elevation: 3;
`;

const LogoText = styled.Text<{ theme: any }>`
  font-size: 32px;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.primary};
`;

const Content = styled.View<{ theme: any }>`
  flex: 1;
  justify-content: flex-start;
  padding-horizontal: ${({ theme }) => theme.spacing.lg}px;
  padding-top: ${({ theme }) => theme.spacing.md}px;
`;

const Title = styled.Text<{ theme: any }>`
  font-size: 32px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing.sm}px;
`;

const Subtitle = styled.Text<{ theme: any }>`
  font-size: 16px;
  color: ${({ theme }) => theme.colors.textSecondary};
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing.xl * 1.5}px;
  line-height: 24px;
`;

const FormContainer = styled.View<{ theme: any }>`
  margin-bottom: ${({ theme }) => theme.spacing.lg}px;
`;

const FormGroup = styled.View<{ theme: any }>`
  margin-bottom: ${({ theme }) => theme.spacing.lg}px;
`;

const PhoneInputContainer = styled.View<{ theme: any }>`
  flex-direction: row;
  align-items: center;
  border: 1px solid #d0d0d0;
  border-radius: 12px;
  padding-right: ${({ theme }) => theme.spacing.md}px;
  height: 56px;
`;

const CountryCodeButton = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  padding-left: ${10}px;
  padding-right: ${10}px;
  border-right-width: 1px;
  border-right-color: #d0d0d0;
  margin-right: ${10}px;
`;

const CountryCodeText = styled.Text<{ theme: any }>`
  font-size: 16px;
  color: ${({ theme }) => theme.colors.text};
  margin-right: ${({ theme }) => theme.spacing.xs}px;
`;

const PhoneNumberInput = styled.TextInput<{ theme: any }>`
  flex: 1;
  padding-horizontal: ${({ theme }) => theme.spacing.md}px;
  font-size: 16px;
  color: ${({ theme }) => theme.colors.text};
`;

const InputLabel = styled.Text<{ theme: any }>`
  font-size: 16px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: ${({ theme }) => theme.spacing.sm}px;
`;

const SendOTPButton = styled(Button)<{ theme: any }>`
  margin-top: ${({ theme }) => theme.spacing.lg}px;
  margin-bottom: ${({ theme }) => theme.spacing.lg}px;
`;

const FooterText = styled.Text<{ theme: any }>`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textSecondary};
  text-align: center;
  line-height: 20px;
`;

const HighlightText = styled.Text<{ theme: any }>`
  color: ${({ theme }) => theme.colors.primary};
  font-weight: 500;
`;

const ResendContainer = styled.View<{ theme: any }>`
  align-items: center;
  margin-top: ${({ theme }) => theme.spacing.lg}px;
`;

const ResendText = styled.Text<{ theme: any }>`
  color: ${({ theme }) => theme.colors.primary};
  font-size: 14px;
  font-weight: 500;
`;

export const LoginScreen: React.FC = () => {
  const theme = useTheme();
  const { sendOTP, login, isLoading } = useAuth();

  const [userName, setUserName] = useState('');
  const [countryCode, setCountryCode] = useState('+91');
  const [mobileNumber, setMobileNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const handleSendOTP = async (): Promise<void> => {
    if (!userName.trim()) {
      Alert.alert('Error', 'Please enter your name or nickname');
      return;
    }
    if (!mobileNumber.trim()) {
      Alert.alert('Error', 'Please enter your mobile number');
      return;
    }

    const fullPhoneNumber = `${countryCode}${mobileNumber}`;
    console.log(fullPhoneNumber, 'fullPhoneNumber');
    try {
      const success = await sendOTP(fullPhoneNumber);
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

    const fullPhoneNumber = `${countryCode}${mobileNumber}`;
    try {
      await login(fullPhoneNumber, otp);
      // Navigation is handled by the router based on auth state
    } catch (error: any) {
      Alert.alert(
        'Error',
        error.response?.data?.message || 'Failed to verify OTP',
      );
    }
  };

  const handleClose = (): void => {
    // Handle close button - you can navigate back or close the modal
    console.log('Close button pressed');
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <StatusBarComponent />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <Content theme={theme}>
            <LogoContainer theme={theme}>
              <LogoBox theme={theme}>
                <LogoText theme={theme}>🎉</LogoText>
              </LogoBox>
            </LogoContainer>

            <Title theme={theme}>Welcome to JoJo</Title>
            <Subtitle theme={theme}>
              Sign up to create moments and spread joy
            </Subtitle>

            <FormContainer theme={theme}>
              <FormGroup theme={theme}>
                <InputLabel theme={theme}>How may we address you?</InputLabel>
                <Input
                  placeholder="name or nick name"
                  value={userName}
                  onChangeText={setUserName}
                  editable={!otpSent}
                  placeholderTextColor="#ccc"
                />
              </FormGroup>

              <FormGroup theme={theme}>
                <InputLabel theme={theme}>
                  Where should we send your OTP?
                </InputLabel>
                <PhoneInputContainer theme={theme}>
                  <CountryCodeButton
                    onPress={() => console.log('Country code selector')}
                  >
                    <CountryCodeText theme={theme}>
                      {countryCode}
                    </CountryCodeText>
                    <Text style={{ fontSize: 16, color: '#999' }}>▼</Text>
                  </CountryCodeButton>
                  <PhoneNumberInput
                    theme={theme}
                    placeholder="1234 567890"
                    keyboardType="phone-pad"
                    value={mobileNumber}
                    onChangeText={setMobileNumber}
                    editable={!otpSent}
                    maxLength={15}
                    placeholderTextColor="#ccc"
                  />
                </PhoneInputContainer>
              </FormGroup>

              {otpSent && (
                <FormGroup theme={theme}>
                  <InputLabel theme={theme}>Enter OTP</InputLabel>
                  <Input
                    placeholder="000000"
                    keyboardType="number-pad"
                    value={otp}
                    onChangeText={setOtp}
                    maxLength={6}
                    placeholderTextColor="#ccc"
                  />
                  <Button
                    title="Verify OTP"
                    onPress={handleVerifyOTP}
                    loading={isLoading}
                    style={{ marginTop: theme.spacing.lg }}
                  />
                  <ResendContainer theme={theme}>
                    <TouchableOpacity
                      onPress={handleResendOTP}
                      disabled={countdown > 0}
                    >
                      <ResendText theme={theme}>
                        {countdown > 0
                          ? `Resend OTP in ${countdown}s`
                          : 'Resend OTP'}
                      </ResendText>
                    </TouchableOpacity>
                  </ResendContainer>
                </FormGroup>
              )}

              {!otpSent && (
                <SendOTPButton
                  theme={theme}
                  title="Send OTP"
                  onPress={handleSendOTP}
                  loading={isLoading}
                  fullWidth
                />
              )}

              <FooterText theme={theme}>
                By continuing, you agree to our{' '}
                <HighlightText theme={theme}>Terms of Service</HighlightText>{' '}
                and <HighlightText theme={theme}>Privacy Policy</HighlightText>
              </FooterText>
            </FormContainer>
          </Content>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};
