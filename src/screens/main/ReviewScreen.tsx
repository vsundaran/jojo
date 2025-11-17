// src/screens/main/ReviewScreen.tsx
import React, { useState } from 'react';
import { View, Alert } from 'react-native';
import styled from 'styled-components/native';
import { useTheme } from '../../contexts/ThemeContext';
import { useCall } from '../../contexts/CallContext';
import { Container } from '../../components/common/Container';
import { Header } from '../../components/common/Header';
import { Button } from '../../components/common/Button';
import { reviewApi } from '../../services/api/reviewApi';
import Icon from 'react-native-vector-icons/MaterialIcons';

const Content = styled.View<{ theme: any }>`
  flex: 1;
  padding: ${({ theme }) => theme.spacing.xl}px;
  justify-content: center;
`;

const UserInfo = styled.View<{ theme: any }>`
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.xl}px;
`;

const UserAvatar = styled.View<{ theme: any }>`
  width: 80px;
  height: 80px;
  border-radius: 40px;
  background-color: ${({ theme }) => theme.colors.primary};
  justify-content: center;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.md}px;
`;

const UserAvatarText = styled.Text<{ theme: any }>`
  color: ${({ theme }) => theme.colors.background};
  font-size: 24px;
  font-weight: bold;
`;

const UserName = styled.Text<{ theme: any }>`
  font-size: ${({ theme }) => theme.typography.h2.fontSize}px;
  font-weight: ${({ theme }) => theme.typography.h2.fontWeight};
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: ${({ theme }) => theme.spacing.xs}px;
`;

const CallCategory = styled.Text<{ theme: any }>`
  font-size: ${({ theme }) => theme.typography.body.fontSize}px;
  color: ${({ theme }) => theme.colors.textSecondary};
  text-align: center;
`;

const RatingSection = styled.View<{ theme: any }>`
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.xl}px;
`;

const RatingTitle = styled.Text<{ theme: any }>`
  font-size: ${({ theme }) => theme.typography.h3.fontSize}px;
  font-weight: ${({ theme }) => theme.typography.h3.fontWeight};
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: ${({ theme }) => theme.spacing.lg}px;
  text-align: center;
`;

const StarsContainer = styled.View<{ theme: any }>`
  flex-direction: row;
  justify-content: center;
  margin-bottom: ${({ theme }) => theme.spacing.lg}px;
`;

const StarButton = styled.TouchableOpacity<{ theme: any }>`
  padding: ${({ theme }) => theme.spacing.sm}px;
`;

const FeedbackText = styled.Text<{ theme: any }>`
  font-size: ${({ theme }) => theme.typography.body.fontSize}px;
  color: ${({ theme }) => theme.colors.textSecondary};
  text-align: center;
  margin-top: ${({ theme }) => theme.spacing.md}px;
`;

export const ReviewScreen: React.FC = () => {
  const theme = useTheme();
  const { activeCall, endCall } = useCall();
  const [rating, setRating] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmitReview = async (): Promise<void> => {
    if (!activeCall || rating === 0) {
      Alert.alert('Error', 'Please select a rating');
      return;
    }

    setSubmitting(true);
    try {
      const response = await reviewApi.submitReview({
        callId: activeCall.id,
        rating: rating,
      });

      if (response.success) {
        Alert.alert('Success', 'Thank you for your feedback!');
        endCall();
      }
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSkip = (): void => {
    endCall();
  };

  if (!activeCall) {
    return null;
  }

  const otherUser = activeCall.participant.id ? activeCall.participant : activeCall.creator;

  const getUserInitials = (name: string): string => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <Container>
      <Header title="Rate Your Call" />
      <Content theme={theme}>
        <UserInfo theme={theme}>
          <UserAvatar theme={theme}>
            <UserAvatarText theme={theme}>
              {getUserInitials(otherUser.name)}
            </UserAvatarText>
          </UserAvatar>
          <UserName theme={theme}>{otherUser.name}</UserName>
          <CallCategory theme={theme}>
            {activeCall.category} • {activeCall.subCategory}
          </CallCategory>
        </UserInfo>

        <RatingSection theme={theme}>
          <RatingTitle theme={theme}>
            How was your call experience?
          </RatingTitle>
          
          <StarsContainer theme={theme}>
            {[1, 2, 3, 4, 5].map(star => (
              <StarButton
                key={star}
                theme={theme}
                onPress={() => setRating(star)}
              >
                <Icon
                  name={star <= rating ? "star" : "star-border"}
                  size={40}
                  color={star <= rating ? theme.colors.warning : theme.colors.border}
                />
              </StarButton>
            ))}
          </StarsContainer>

          <FeedbackText theme={theme}>
            {rating === 0 && 'Tap a star to rate'}
            {rating === 1 && 'Poor'}
            {rating === 2 && 'Fair'}
            {rating === 3 && 'Good'}
            {rating === 4 && 'Very Good'}
            {rating === 5 && 'Excellent'}
          </FeedbackText>
        </RatingSection>

        <Button
          title="Submit Review"
          onPress={handleSubmitReview}
          loading={submitting}
          disabled={rating === 0}
          fullWidth
          style={{ marginBottom: theme.spacing.md }}
        />
        
        <Button
          title="Skip"
          variant="outline"
          onPress={handleSkip}
          fullWidth
        />
      </Content>
    </Container>
  );
};