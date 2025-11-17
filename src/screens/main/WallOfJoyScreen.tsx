// src/screens/main/WallOfJoyScreen.tsx
import React, { useState, useEffect } from 'react';
import { View, Alert, ScrollView, RefreshControl } from 'react-native';
import styled from 'styled-components/native';
import { useTheme } from '../../contexts/ThemeContext';
import { Container } from '../../components/common/Container';
import { Header } from '../../components/common/Header';
import { wallOfJoyApi } from '../../services/api/wallOfJoyApi';
import { Moment } from '../../types';
import Icon from 'react-native-vector-icons/MaterialIcons';

const Content = styled.View<{ theme: any }>`
  flex: 1;
  padding-top: ${({ theme }) => theme.spacing.md}px;
`;

const MomentCard = styled.View<{ theme: any }>`
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.lg}px;
  padding: ${({ theme }) => theme.spacing.lg}px;
  margin-bottom: ${({ theme }) => theme.spacing.md}px;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.1;
  shadow-radius: 3px;
  elevation: 3;
`;

const UserInfo = styled.View<{ theme: any }>`
  flex-direction: row;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.sm}px;
`;

const Avatar = styled.View<{ theme: any }>`
  width: 40px;
  height: 40px;
  border-radius: 20px;
  background-color: ${({ theme }) => theme.colors.primary};
  justify-content: center;
  align-items: center;
  margin-right: ${({ theme }) => theme.spacing.sm}px;
`;

const AvatarText = styled.Text<{ theme: any }>`
  color: ${({ theme }) => theme.colors.background};
  font-size: ${({ theme }) => theme.typography.body.fontSize}px;
  font-weight: 600;
`;

const UserDetails = styled.View<{ theme: any }>`
  flex: 1;
`;

const UserName = styled.Text<{ theme: any }>`
  font-size: ${({ theme }) => theme.typography.h3.fontSize}px;
  font-weight: ${({ theme }) => theme.typography.h3.fontWeight};
  color: ${({ theme }) => theme.colors.text};
`;

const UserRating = styled.View<{ theme: any }>`
  flex-direction: row;
  align-items: center;
  margin-top: 2px;
`;

const RatingText = styled.Text<{ theme: any }>`
  font-size: ${({ theme }) => theme.typography.caption.fontSize}px;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-left: ${({ theme }) => theme.spacing.xs}px;
`;

const CategoryBadge = styled.View<{ theme: any }>`
  background-color: ${({ theme }) => theme.colors.accent};
  padding-horizontal: ${({ theme }) => theme.spacing.sm}px;
  padding-vertical: ${({ theme }) => theme.spacing.xs}px;
  border-radius: ${({ theme }) => theme.borderRadius.sm}px;
`;

const CategoryText = styled.Text<{ theme: any }>`
  color: ${({ theme }) => theme.colors.background};
  font-size: ${({ theme }) => theme.typography.caption.fontSize}px;
  font-weight: 600;
`;

const MomentContent = styled.Text<{ theme: any }>`
  font-size: ${({ theme }) => theme.typography.body.fontSize}px;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: ${({ theme }) => theme.spacing.sm}px;
  line-height: 20px;
`;

const MomentFooter = styled.View<{ theme: any }>`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-top: ${({ theme }) => theme.spacing.sm}px;
`;

const LanguageTags = styled.View<{ theme: any }>`
  flex-direction: row;
  flex-wrap: wrap;
  flex: 1;
`;

const LanguageTag = styled.Text<{ theme: any }>`
  background-color: ${({ theme }) => theme.colors.border};
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: ${({ theme }) => theme.typography.caption.fontSize}px;
  padding-horizontal: ${({ theme }) => theme.spacing.sm}px;
  padding-vertical: ${({ theme }) => theme.spacing.xs}px;
  border-radius: ${({ theme }) => theme.borderRadius.sm}px;
  margin-right: ${({ theme }) => theme.spacing.xs}px;
  margin-bottom: ${({ theme }) => theme.spacing.xs}px;
`;

const HeartButton = styled.TouchableOpacity<{ theme: any; hasHearted: boolean }>`
  flex-direction: row;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.xs}px;
  background-color: ${({ theme, hasHearted }) => 
    hasHearted ? 'rgba(236, 72, 153, 0.1)' : 'transparent'};
  border-radius: ${({ theme }) => theme.borderRadius.sm}px;
`;

const HeartCount = styled.Text<{ theme: any; hasHearted: boolean }>`
  color: ${({ theme, hasHearted }) => 
    hasHearted ? theme.colors.secondary : theme.colors.textSecondary};
  font-size: ${({ theme }) => theme.typography.body.fontSize}px;
  font-weight: 600;
  margin-left: ${({ theme }) => theme.spacing.xs}px;
`;

const EmptyState = styled.View<{ theme: any }>`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding-top: ${({ theme }) => theme.spacing.xl * 2}px;
`;

const EmptyText = styled.Text<{ theme: any }>`
  font-size: ${({ theme }) => theme.typography.h3.fontSize}px;
  color: ${({ theme }) => theme.colors.textSecondary};
  text-align: center;
  margin-top: ${({ theme }) => theme.spacing.md}px;
`;

export const WallOfJoyScreen: React.FC = () => {
  const theme = useTheme();
  const [moments, setMoments] = useState<Moment[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [heartsLoading, setHeartsLoading] = useState<string | null>(null);

  const loadMoments = async (): Promise<void> => {
    try {
      const response = await wallOfJoyApi.getActiveMoments();
      if (response.success && response.data) {
        setMoments(response.data.moments);
      }
    } catch (error: any) {
      Alert.alert('Error', 'Failed to load moments');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadMoments();
  }, []);

  const handleHeartPress = async (moment: Moment): Promise<void> => {
    if (heartsLoading) return;
    
    setHeartsLoading(moment._id);
    try {
      if (moment.hasHearted) {
        await wallOfJoyApi.removeHeart(moment._id);
        setMoments(prev => prev.map(m => 
          m._id === moment._id 
            ? { ...m, hasHearted: false, hearts: m.hearts - 1 }
            : m
        ));
      } else {
        await wallOfJoyApi.addHeart(moment._id);
        setMoments(prev => prev.map(m => 
          m._id === moment._id 
            ? { ...m, hasHearted: true, hearts: m.hearts + 1 }
            : m
        ));
      }
    } catch (error: any) {
      Alert.alert('Error', 'Failed to update heart');
    } finally {
      setHeartsLoading(null);
    }
  };

  const onRefresh = (): void => {
    setRefreshing(true);
    loadMoments();
  };

  const getUserInitials = (name: string): string => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  if (loading && moments.length === 0) {
    return (
      <Container>
        <Header title="Wall of Joy" />
        <EmptyState theme={theme}>
          <EmptyText theme={theme}>Loading moments...</EmptyText>
        </EmptyState>
      </Container>
    );
  }

  return (
    <Container>
      <Header title="Wall of Joy" />
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <Content theme={theme}>
          {moments.length === 0 ? (
            <EmptyState theme={theme}>
              <Icon name="dashboard" size={64} color={theme.colors.textSecondary} />
              <EmptyText theme={theme}>
                No active moments available
              </EmptyText>
            </EmptyState>
          ) : (
            moments.map(moment => (
              <MomentCard key={moment._id} theme={theme}>
                <UserInfo theme={theme}>
                  <Avatar theme={theme}>
                    <AvatarText theme={theme}>
                      {getUserInitials(moment.creator.name)}
                    </AvatarText>
                  </Avatar>
                  <UserDetails theme={theme}>
                    <UserName theme={theme}>{moment.creator.name}</UserName>
                    <UserRating theme={theme}>
                      <Icon name="star" size={16} color={theme.colors.warning} />
                      <RatingText theme={theme}>
                        {moment.creator.rating} • {moment.creator.callCount} calls
                      </RatingText>
                    </UserRating>
                  </UserDetails>
                  <CategoryBadge theme={theme}>
                    <CategoryText theme={theme}>
                      {moment.category}
                    </CategoryText>
                  </CategoryBadge>
                </UserInfo>

                <MomentContent theme={theme}>
                  {moment.content}
                </MomentContent>

                <LanguageTags theme={theme}>
                  {moment.languages.map(language => (
                    <LanguageTag key={language} theme={theme}>
                      {language}
                    </LanguageTag>
                  ))}
                </LanguageTags>

                <MomentFooter theme={theme}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Icon 
                      name="call" 
                      size={16} 
                      color={theme.colors.textSecondary} 
                    />
                    <RatingText theme={theme} style={{ marginLeft: 4 }}>
                      {moment.callCount} calls
                    </RatingText>
                  </View>
                  
                  <HeartButton
                    theme={theme}
                    hasHearted={!!moment.hasHearted}
                    onPress={() => handleHeartPress(moment)}
                    disabled={heartsLoading === moment._id}
                  >
                    <Icon 
                      name={moment.hasHearted ? "favorite" : "favorite-border"} 
                      size={20} 
                      color={moment.hasHearted ? theme.colors.secondary : theme.colors.textSecondary} 
                    />
                    <HeartCount 
                      theme={theme} 
                      hasHearted={!!moment.hasHearted}
                    >
                      {moment.hearts}
                    </HeartCount>
                  </HeartButton>
                </MomentFooter>
              </MomentCard>
            ))
          )}
        </Content>
      </ScrollView>
    </Container>
  );
};