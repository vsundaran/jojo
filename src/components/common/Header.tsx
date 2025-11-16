// src/components/common/Header.tsx
import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import styled from 'styled-components/native';
import { useTheme } from '../../contexts/ThemeContext';
import Icon from 'react-native-vector-icons/MaterialIcons';

const HeaderContainer = styled.View<{ theme: any }>`
  height: ${({ theme }) => theme.headerHeight}px;
  background-color: ${({ theme }) => theme.colors.primary};
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding-horizontal: ${({ theme }) => theme.spacing.md}px;
`;

const HeaderTitle = styled.Text<{ theme: any }>`
  color: ${({ theme }) => theme.colors.background};
  font-size: ${({ theme }) => theme.typography.h2.fontSize}px;
  font-weight: ${({ theme }) => theme.typography.h2.fontWeight};
`;

const HeaderButton = styled.TouchableOpacity<{ theme: any }>`
  padding: ${({ theme }) => theme.spacing.xs}px;
`;

interface HeaderProps {
  title: string;
  onBack?: () => void;
  rightComponent?: React.ReactNode;
}

export const Header: React.FC<HeaderProps> = ({ title, onBack, rightComponent }) => {
  const theme = useTheme();

  return (
    <HeaderContainer theme={theme}>
      <HeaderButton theme={theme} onPress={onBack}>
        {onBack && <Icon name="arrow-back" size={24} color={theme.colors.background} />}
      </HeaderButton>
      
      <HeaderTitle theme={theme}>{title}</HeaderTitle>
      
      <View>
        {rightComponent || <View style={{ width: 24 }} />}
      </View>
    </HeaderContainer>
  );
};