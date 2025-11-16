// src/screens/auth/LanguageSelectionScreen.tsx
import React, { useState } from 'react';
import { View, Alert, ScrollView } from 'react-native';
import styled from 'styled-components/native';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import { Container } from '../../components/common/Container';
import { Header } from '../../components/common/Header';
import { Button } from '../../components/common/Button';

const LANGUAGES = [
  { id: 'english', name: 'English' },
  { id: 'hindi', name: 'Hindi' },
  { id: 'spanish', name: 'Spanish' },
  { id: 'french', name: 'French' },
  { id: 'german', name: 'German' },
  { id: 'japanese', name: 'Japanese' },
  { id: 'chinese', name: 'Chinese' },
];

const Content = styled.View<{ theme: any }>`
  flex: 1;
  padding-top: ${({ theme }) => theme.spacing.xl}px;
`;

const Title = styled.Text<{ theme: any }>`
  font-size: ${({ theme }) => theme.typography.h2.fontSize}px;
  font-weight: ${({ theme }) => theme.typography.h2.fontWeight};
  color: ${({ theme }) => theme.colors.text};
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing.md}px;
`;

const Subtitle = styled.Text<{ theme: any }>`
  font-size: ${({ theme }) => theme.typography.body.fontSize}px;
  color: ${({ theme }) => theme.colors.textSecondary};
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing.xl}px;
`;

const LanguageGrid = styled.View<{ theme: any }>`
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  margin-bottom: ${({ theme }) => theme.spacing.xl}px;
`;

const LanguageButton = styled.TouchableOpacity<{ theme: any; selected: boolean }>`
  background-color: ${({ theme, selected }) => 
    selected ? theme.colors.primary : theme.colors.surface};
  border: 2px solid ${({ theme, selected }) => 
    selected ? theme.colors.primary : theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md}px;
  padding: ${({ theme }) => theme.spacing.md}px;
  margin-bottom: ${({ theme }) => theme.spacing.sm}px;
  width: 48%;
  align-items: center;
`;

const LanguageText = styled.Text<{ theme: any; selected: boolean }>`
  color: ${({ theme, selected }) => 
    selected ? theme.colors.background : theme.colors.text};
  font-size: ${({ theme }) => theme.typography.body.fontSize}px;
  font-weight: 600;
`;

export const LanguageSelectionScreen: React.FC = () => {
  const theme = useTheme();
  const { completeProfile, isLoading } = useAuth();
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);

  const toggleLanguage = (languageId: string): void => {
    setSelectedLanguages(prev => {
      if (prev.includes(languageId)) {
        return prev.filter(id => id !== languageId);
      } else {
        return [...prev, languageId];
      }
    });
  };

  const handleCompleteProfile = async (): Promise<void> => {
    if (selectedLanguages.length === 0) {
      Alert.alert('Error', 'Please select at least one language');
      return;
    }

    try {
      await completeProfile(selectedLanguages);
      // Navigation is handled by the router based on auth state
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to complete profile');
    }
  };

  return (
    <Container>
      <Header title="Select Languages" />
      <ScrollView>
        <Content theme={theme}>
          <Title theme={theme}>Choose Your Languages</Title>
          <Subtitle theme={theme}>
            Select the languages you're comfortable speaking in during calls
          </Subtitle>

          <LanguageGrid theme={theme}>
            {LANGUAGES.map(language => (
              <LanguageButton
                key={language.id}
                theme={theme}
                selected={selectedLanguages.includes(language.id)}
                onPress={() => toggleLanguage(language.id)}
              >
                <LanguageText 
                  theme={theme} 
                  selected={selectedLanguages.includes(language.id)}
                >
                  {language.name}
                </LanguageText>
              </LanguageButton>
            ))}
          </LanguageGrid>

          <Button
            title="Continue"
            onPress={handleCompleteProfile}
            loading={isLoading}
            fullWidth
            disabled={selectedLanguages.length === 0}
          />
        </Content>
      </ScrollView>
    </Container>
  );
};