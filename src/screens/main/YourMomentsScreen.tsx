// src/screens/main/YourMomentsScreen.tsx
import React, { useState, useEffect } from 'react';
import { View, Alert, ScrollView, RefreshControl } from 'react-native';
import styled from 'styled-components/native';
import { useTheme } from '../../contexts/ThemeContext';
import { Container } from '../../components/common/Container';
import { Header } from '../../components/common/Header';
import { Button } from '../../components/common/Button';
import { momentApi } from '../../services/api/momentApi';
import { Moment } from '../../types';
import Icon from 'react-native-vector-icons/MaterialIcons';

const Content = styled.View<{ theme: any }>`
  flex: 1;
  padding-top: ${({ theme }) => theme.spacing.md}px;
`;

const MomentCard = styled.View<{ theme: any; status: string }>`
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.lg}px;
  padding: ${({ theme }) => theme.spacing.lg}px;
  margin-bottom: ${({ theme }) => theme.spacing.md}px;
  border-left-width: 4px;
  border-left-color: ${({ theme, status }) => 
    status === 'active' ? theme.colors.success : 
    status === 'expired' ? theme.colors.error : theme.colors.warning};
`;

const MomentHeader = styled.View<{ theme: any }>`
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: ${({ theme }) => theme.spacing.sm}px;
`;

const CategoryBadge = styled.View<{ theme: any }>`
  background-color: ${({ theme }) => theme.colors.primary};
  padding-horizontal: ${({ theme }) => theme.spacing.sm}px;
  padding-vertical: ${({ theme }) => theme.spacing.xs}px;
  border-radius: ${({ theme }) => theme.borderRadius.sm}px;
`;

const CategoryText = styled.Text<{ theme: any }>`
  color: ${({ theme }) => theme.colors.background};
  font-size: ${({ theme }) => theme.typography.caption.fontSize}px;
  font-weight: 600;
`;

const StatusBadge = styled.View<{ theme: any; status: string }>`
  background-color: ${({ theme, status }) => 
    status === 'active' ? theme.colors.success : 
    status === 'expired' ? theme.colors.error : theme.colors.warning};
  padding-horizontal: ${({ theme }) => theme.spacing.sm}px;
  padding-vertical: ${({ theme }) => theme.spacing.xs}px;
  border-radius: ${({ theme }) => theme.borderRadius.sm}px;
`;

const StatusText = styled.Text<{ theme: any }>`
  color: ${({ theme }) => theme.colors.background};
  font-size: ${({ theme }) => theme.typography.caption.fontSize}px;
  font-weight: 600;
`;

const MomentContent = styled.Text<{ theme: any }>`
  font-size: ${({ theme }) => theme.typography.body.fontSize}px;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: ${({ theme }) => theme.spacing.sm}px;
`;

const MomentDetails = styled.View<{ theme: any }>`
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: ${({ theme }) => theme.spacing.sm}px;
`;

const DetailItem = styled.View<{ theme: any }>`
  flex-direction: row;
  align-items: center;
  margin-right: ${({ theme }) => theme.spacing.md}px;
`;

const DetailText = styled.Text<{ theme: any }>`
  font-size: ${({ theme }) => theme.typography.caption.fontSize}px;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-left: ${({ theme }) => theme.spacing.xs}px;
`;

const ActionButtons = styled.View<{ theme: any }>`
  flex-direction: row;
  justify-content: flex-end;
  margin-top: ${({ theme }) => theme.spacing.sm}px;
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

export const YourMomentsScreen: React.FC = () => {
  const theme = useTheme();
  const [moments, setMoments] = useState<Moment[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<'active' | 'expired' | 'all'>('active');

  const loadMoments = async (): Promise<void> => {
    try {
      const status = activeTab === 'all' ? undefined : activeTab;
      const response = await momentApi.getUserMoments(status);
      if (response.success && response.data) {
        setMoments(response.data.moments);
      }
    } catch (error: any) {
      Alert.alert('Error', 'Failed to load your moments');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadMoments();
  }, [activeTab]);

  const handleDeleteMoment = async (momentId: string): Promise<void> => {
    try {
      const response = await momentApi.deleteMoment(momentId);
      if (response.success) {
        Alert.alert('Success', 'Moment deleted successfully');
        loadMoments();
      }
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to delete moment');
    }
  };

  const onRefresh = (): void => {
    setRefreshing(true);
    loadMoments();
  };

  const filteredMoments = moments.filter(moment => {
    if (activeTab === 'all') return true;
    return moment.status === activeTab;
  });

  const formatTime = (dateString: string): string => {
    return new Date(dateString).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  if (loading && moments.length === 0) {
    return (
      <Container>
        <Header title="Your Moments" />
        <EmptyState theme={theme}>
          <EmptyText theme={theme}>Loading your moments...</EmptyText>
        </EmptyState>
      </Container>
    );
  }

  return (
    <Container>
      <Header title="Your Moments" />
      
      {/* Tab Bar */}
      <View style={{ 
        flexDirection: 'row', 
        paddingHorizontal: theme.spacing.md,
        marginBottom: theme.spacing.md 
      }}>
        {['active', 'expired', 'all'].map(tab => (
          <Button
            key={tab}
            title={tab.charAt(0).toUpperCase() + tab.slice(1)}
            variant={activeTab === tab ? 'primary' : 'outline'}
            onPress={() => setActiveTab(tab as any)}
            style={{ flex: 1, marginHorizontal: theme.spacing.xs }}
          />
        ))}
      </View>

      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <Content theme={theme}>
          {filteredMoments.length === 0 ? (
            <EmptyState theme={theme}>
              <Icon name="collections" size={64} color={theme.colors.textSecondary} />
              <EmptyText theme={theme}>
                {activeTab === 'active' 
                  ? 'No active moments' 
                  : activeTab === 'expired'
                  ? 'No expired moments'
                  : 'No moments created yet'}
              </EmptyText>
              <Button
                title="Create Your First Moment"
                onPress={() => {/* Navigate to create moment */}}
                style={{ marginTop: theme.spacing.lg }}
              />
            </EmptyState>
          ) : (
            filteredMoments.map(moment => (
              <MomentCard key={moment._id} theme={theme} status={moment.status}>
                <MomentHeader theme={theme}>
                  <CategoryBadge theme={theme}>
                    <CategoryText theme={theme}>
                      {moment.category}
                    </CategoryText>
                  </CategoryBadge>
                  <StatusBadge theme={theme} status={moment.status}>
                    <StatusText theme={theme}>
                      {moment.status}
                    </StatusText>
                  </StatusBadge>
                </MomentHeader>

                <MomentContent theme={theme}>
                  {moment.content}
                </MomentContent>

                <MomentDetails theme={theme}>
                  <DetailItem theme={theme}>
                    <Icon name="access-time" size={16} color={theme.colors.textSecondary} />
                    <DetailText theme={theme}>
                      {formatTime(moment.expiresAt)}
                    </DetailText>
                  </DetailItem>
                  <DetailItem theme={theme}>
                    <Icon name="favorite" size={16} color={theme.colors.textSecondary} />
                    <DetailText theme={theme}>
                      {moment.hearts}
                    </DetailText>
                  </DetailItem>
                  <DetailItem theme={theme}>
                    <Icon name="call" size={16} color={theme.colors.textSecondary} />
                    <DetailText theme={theme}>
                      {moment.callCount}
                    </DetailText>
                  </DetailItem>
                </MomentDetails>

                <MomentDetails theme={theme}>
                  <DetailItem theme={theme}>
                    <Icon name="language" size={16} color={theme.colors.textSecondary} />
                    <DetailText theme={theme}>
                      {moment.languages.join(', ')}
                    </DetailText>
                  </DetailItem>
                </MomentDetails>

                {moment.status === 'active' && (
                  <ActionButtons theme={theme}>
                    <Button
                      title="Edit"
                      variant="outline"
                      onPress={() => {/* Navigate to edit */}}
                      style={{ marginRight: theme.spacing.sm }}
                    />
                    <Button
                      title="Delete"
                      variant="outline"
                      onPress={() => handleDeleteMoment(moment._id)}
                    />
                  </ActionButtons>
                )}
              </MomentCard>
            ))
          )}
        </Content>
      </ScrollView>
    </Container>
  );
};