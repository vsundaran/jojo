// src/screens/main/GiveJoyScreen.tsx
import React, { useState, useEffect } from 'react';
import { View, Alert, ScrollView, RefreshControl } from 'react-native';
import styled from 'styled-components/native';
import { useTheme } from '../../contexts/ThemeContext';
import { useCall } from '../../contexts/CallContext';
import { Container } from '../../components/common/Container';
import { Header } from '../../components/common/Header';
import { Button } from '../../components/common/Button';
import { momentApi } from '../../services/api/momentApi';
import { callApi } from '../../services/api/callApi';
import { Moment, CategoryCount } from '../../types';

const CATEGORIES = [
  { id: 'wishes', name: 'Wishes', icon: 'cake' },
  { id: 'motivation', name: 'Motivation', icon: 'fitness-center' },
  { id: 'songs', name: 'Songs', icon: 'music-note' },
  { id: 'blessings', name: 'Blessings', icon: 'favorite' },
  { id: 'celebrations', name: 'Celebrations', icon: 'celebration' },
];

const Content = styled.View<{ theme: any }>`
  flex: 1;
  padding-top: ${({ theme }) => theme.spacing.md}px;
`;

const CategoryGrid = styled.View<{ theme: any }>`
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
`;

const CategoryCard = styled.TouchableOpacity<{ theme: any }>`
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.lg}px;
  padding: ${({ theme }) => theme.spacing.lg}px;
  margin-bottom: ${({ theme }) => theme.spacing.md}px;
  width: 48%;
  align-items: center;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.1;
  shadow-radius: 3px;
  elevation: 3;
`;

const CategoryIcon = styled.Text<{ theme: any }>`
  font-size: 32px;
  margin-bottom: ${({ theme }) => theme.spacing.sm}px;
`;

const CategoryName = styled.Text<{ theme: any }>`
  font-size: ${({ theme }) => theme.typography.h3.fontSize}px;
  font-weight: ${({ theme }) => theme.typography.h3.fontWeight};
  color: ${({ theme }) => theme.colors.text};
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing.xs}px;
`;

const MomentCount = styled.Text<{ theme: any }>`
  font-size: ${({ theme }) => theme.typography.caption.fontSize}px;
  color: ${({ theme }) => theme.colors.textSecondary};
  text-align: center;
`;

const LoadingContainer = styled.View<{ theme: any }>`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const LoadingText = styled.Text<{ theme: any }>`
  font-size: ${({ theme }) => theme.typography.body.fontSize}px;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-top: ${({ theme }) => theme.spacing.md}px;
`;

export const GiveJoyScreen: React.FC = () => {
  const theme = useTheme();
  const { startCall } = useCall();
  const [categoryCounts, setCategoryCounts] = useState<CategoryCount[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [callLoading, setCallLoading] = useState<string | null>(null);

  const loadAvailableMoments = async (): Promise<void> => {
    try {
      const response = await momentApi.getAvailableMoments();
      if (response.success && response.data) {
        setCategoryCounts(response.data.categoryCounts);
      }
    } catch (error: any) {
      Alert.alert('Error', 'Failed to load available moments');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadAvailableMoments();
  }, []);

  const handleCategoryPress = async (categoryId: string): Promise<void> => {
    setCallLoading(categoryId);
    try {
      const response = await callApi.initiateCall({ category: categoryId });
      if (response.success && response.data) {
        startCall(response.data.call);
        // Navigation to call screen will be handled by the navigator
      } else {
        Alert.alert('Error', 'No available moments found for this category');
      }
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to initiate call');
    } finally {
      setCallLoading(null);
    }
  };

  const onRefresh = (): void => {
    setRefreshing(true);
    loadAvailableMoments();
  };

  const getCategoryCount = (categoryId: string): number => {
    const category = categoryCounts.find(c => c._id === categoryId);
    return category?.count || 0;
  };

  const getCategoryIcon = (categoryId: string): string => {
    const category = CATEGORIES.find(c => c.id === categoryId);
    return category?.icon || 'help';
  };

  if (loading) {
    return (
      <Container>
        <Header title="Give Joy" />
        <LoadingContainer theme={theme}>
          <LoadingText theme={theme}>Loading available moments...</LoadingText>
        </LoadingContainer>
      </Container>
    );
  }

  return (
    <Container>
      <Header title="Give Joy" />
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <Content theme={theme}>
          <CategoryGrid theme={theme}>
            {CATEGORIES.map(category => (
              <CategoryCard
                key={category.id}
                theme={theme}
                onPress={() => handleCategoryPress(category.id)}
                disabled={callLoading === category.id || getCategoryCount(category.id) === 0}
              >
                <CategoryIcon theme={theme}>{getCategoryIcon(category.id)}</CategoryIcon>
                <CategoryName theme={theme}>{category.name}</CategoryName>
                <MomentCount theme={theme}>
                  {getCategoryCount(category.id)} available
                </MomentCount>
                {callLoading === category.id && (
                  <LoadingText theme={theme}>Connecting...</LoadingText>
                )}
              </CategoryCard>
            ))}
          </CategoryGrid>
        </Content>
      </ScrollView>
    </Container>
  );
};