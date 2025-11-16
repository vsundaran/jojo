// src/screens/main/CreateMomentScreen.tsx
import React, { useState } from 'react';
import { View, Alert, ScrollView } from 'react-native';
import styled from 'styled-components/native';
import { useTheme } from '../../contexts/ThemeContext';
import { Container } from '../../components/common/Container';
import { Header } from '../../components/common/Header';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { momentApi } from '../../services/api/momentApi';

const CATEGORIES = [
  { id: 'wishes', name: 'Wishes' },
  { id: 'motivation', name: 'Motivation' },
  { id: 'songs', name: 'Songs' },
  { id: 'blessings', name: 'Blessings' },
  { id: 'celebrations', name: 'Celebrations' },
];

const ACTIVE_TIMES = [
  { value: 30, label: '30 minutes' },
  { value: 60, label: '1 hour' },
  { value: 90, label: '1.5 hours' },
  { value: 120, label: '2 hours' },
];

const Content = styled.View<{ theme: any }>`
  flex: 1;
  padding-top: ${({ theme }) => theme.spacing.md}px;
`;

const Section = styled.View<{ theme: any }>`
  margin-bottom: ${({ theme }) => theme.spacing.lg}px;
`;

const SectionTitle = styled.Text<{ theme: any }>`
  font-size: ${({ theme }) => theme.typography.h3.fontSize}px;
  font-weight: ${({ theme }) => theme.typography.h3.fontWeight};
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: ${({ theme }) => theme.spacing.sm}px;
`;

const CategoryGrid = styled.View<{ theme: any }>`
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
`;

const CategoryButton = styled.TouchableOpacity<{ theme: any; selected: boolean }>`
  background-color: ${({ theme, selected }) => 
    selected ? theme.colors.primary : theme.colors.surface};
  border: 2px solid ${({ theme, selected }) => 
    selected ? theme.colors.primary : theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md}px;
  padding: ${({ theme }) => theme.spacing.sm}px;
  margin-bottom: ${({ theme }) => theme.spacing.sm}px;
  width: 48%;
  align-items: center;
`;

const CategoryText = styled.Text<{ theme: any; selected: boolean }>`
  color: ${({ theme, selected }) => 
    selected ? theme.colors.background : theme.colors.text};
  font-size: ${({ theme }) => theme.typography.body.fontSize}px;
  font-weight: 600;
`;

const TimeButton = styled.TouchableOpacity<{ theme: any; selected: boolean }>`
  background-color: ${({ theme, selected }) => 
    selected ? theme.colors.accent : theme.colors.surface};
  border: 2px solid ${({ theme, selected }) => 
    selected ? theme.colors.accent : theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md}px;
  padding: ${({ theme }) => theme.spacing.sm}px;
  margin-right: ${({ theme }) => theme.spacing.sm}px;
  margin-bottom: ${({ theme }) => theme.spacing.sm}px;
`;

const TimeText = styled.Text<{ theme: any; selected: boolean }>`
  color: ${({ theme, selected }) => 
    selected ? theme.colors.background : theme.colors.text};
  font-size: ${({ theme }) => theme.typography.body.fontSize}px;
  font-weight: 600;
`;

const ScheduleOption = styled.TouchableOpacity<{ theme: any; selected: boolean }>`
  background-color: ${({ theme, selected }) => 
    selected ? theme.colors.primary : theme.colors.surface};
  border: 2px solid ${({ theme, selected }) => 
    selected ? theme.colors.primary : theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md}px;
  padding: ${({ theme }) => theme.spacing.md}px;
  margin-bottom: ${({ theme }) => theme.spacing.sm}px;
  align-items: center;
`;

const ScheduleText = styled.Text<{ theme: any; selected: boolean }>`
  color: ${({ theme, selected }) => 
    selected ? theme.colors.background : theme.colors.text};
  font-size: ${({ theme }) => theme.typography.body.fontSize}px;
  font-weight: 600;
`;

export const CreateMomentScreen: React.FC = () => {
  const theme = useTheme();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    category: '',
    subCategory: '',
    content: '',
    languages: [] as string[],
    scheduleType: 'immediate' as 'immediate' | 'later',
    activeTime: 60,
  });

  const handleCreateMoment = async (): Promise<void> => {
    if (!formData.category || !formData.subCategory || !formData.content) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    if (formData.languages.length === 0) {
      Alert.alert('Error', 'Please select at least one language');
      return;
    }

    setLoading(true);
    try {
      const response = await momentApi.createMoment(formData);
      if (response.success) {
        Alert.alert('Success', 'Moment created successfully!');
        // Reset form or navigate back
        setFormData({
          category: '',
          subCategory: '',
          content: '',
          languages: [],
          scheduleType: 'immediate',
          activeTime: 60,
        });
      }
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to create moment');
    } finally {
      setLoading(false);
    }
  };

  const toggleLanguage = (language: string): void => {
    setFormData(prev => ({
      ...prev,
      languages: prev.languages.includes(language)
        ? prev.languages.filter(l => l !== language)
        : [...prev.languages, language],
    }));
  };

  return (
    <Container>
      <Header title="Create Moment" />
      <ScrollView>
        <Content theme={theme}>
          <Section theme={theme}>
            <SectionTitle theme={theme}>Category</SectionTitle>
            <CategoryGrid theme={theme}>
              {CATEGORIES.map(category => (
                <CategoryButton
                  key={category.id}
                  theme={theme}
                  selected={formData.category === category.id}
                  onPress={() => setFormData(prev => ({ ...prev, category: category.id }))}
                >
                  <CategoryText 
                    theme={theme} 
                    selected={formData.category === category.id}
                  >
                    {category.name}
                  </CategoryText>
                </CategoryButton>
              ))}
            </CategoryGrid>
          </Section>

          <Section theme={theme}>
            <Input
              label="Sub-category"
              placeholder="e.g., Birthday, Wedding, Fitness"
              value={formData.subCategory}
              onChangeText={(text) => setFormData(prev => ({ ...prev, subCategory: text }))}
            />
          </Section>

          <Section theme={theme}>
            <Input
              label="Description"
              placeholder="Tell us about your moment..."
              value={formData.content}
              onChangeText={(text) => setFormData(prev => ({ ...prev, content: text }))}
              multiline
              numberOfLines={4}
              style={{ height: 100, textAlignVertical: 'top' }}
            />
          </Section>

          <Section theme={theme}>
            <SectionTitle theme={theme}>Languages</SectionTitle>
            <CategoryGrid theme={theme}>
              {CATEGORIES.slice(0, 4).map(lang => (
                <CategoryButton
                  key={lang.id}
                  theme={theme}
                  selected={formData.languages.includes(lang.id)}
                  onPress={() => toggleLanguage(lang.id)}
                >
                  <CategoryText 
                    theme={theme} 
                    selected={formData.languages.includes(lang.id)}
                  >
                    {lang.name}
                  </CategoryText>
                </CategoryButton>
              ))}
            </CategoryGrid>
          </Section>

          <Section theme={theme}>
            <SectionTitle theme={theme}>Schedule</SectionTitle>
            <ScheduleOption
              theme={theme}
              selected={formData.scheduleType === 'immediate'}
              onPress={() => setFormData(prev => ({ ...prev, scheduleType: 'immediate' }))}
            >
              <ScheduleText 
                theme={theme} 
                selected={formData.scheduleType === 'immediate'}
              >
                Start Immediately
              </ScheduleText>
            </ScheduleOption>
            <ScheduleOption
              theme={theme}
              selected={formData.scheduleType === 'later'}
              onPress={() => setFormData(prev => ({ ...prev, scheduleType: 'later' }))}
            >
              <ScheduleText 
                theme={theme} 
                selected={formData.scheduleType === 'later'}
              >
                Schedule for Later
              </ScheduleText>
            </ScheduleOption>
          </Section>

          <Section theme={theme}>
            <SectionTitle theme={theme}>Active Time</SectionTitle>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
              {ACTIVE_TIMES.map(time => (
                <TimeButton
                  key={time.value}
                  theme={theme}
                  selected={formData.activeTime === time.value}
                  onPress={() => setFormData(prev => ({ ...prev, activeTime: time.value }))}
                >
                  <TimeText 
                    theme={theme} 
                    selected={formData.activeTime === time.value}
                  >
                    {time.label}
                  </TimeText>
                </TimeButton>
              ))}
            </View>
          </Section>

          <Button
            title="Create Moment"
            onPress={handleCreateMoment}
            loading={loading}
            fullWidth
          />
        </Content>
      </ScrollView>
    </Container>
  );
};