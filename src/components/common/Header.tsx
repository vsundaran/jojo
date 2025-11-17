// src/components/common/Header.tsx
import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import styled from 'styled-components/native';
import { useTheme } from '../../contexts/ThemeContext';
import Icon from 'react-native-vector-icons/MaterialIcons';

import LinearGradient from 'react-native-linear-gradient';

import { useSafeAreaInsets } from 'react-native-safe-area-context';

const HeaderContainer = styled(LinearGradient)<{ theme: any }>`
  height: ${({ theme }) => theme.headerHeight}px;
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
const TopBar = styled.View<{ height: number; bg: string }>`
  height: ${({ height }) => height}px;
  background-color: ${({ bg }) => bg};
`;

interface HeaderProps {
  title: string;
  onBack?: () => void;
  rightComponent?: React.ReactNode;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  onBack,
  rightComponent,
}) => {
  const theme = useTheme();
  const insets = useSafeAreaInsets(); // ← gets status bar height

  return (
    <View>
      <TopBar height={insets.top} bg={theme.colors.statusBar} />
      <HeaderContainer
        theme={theme}
        colors={theme.colors.gradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <HeaderButton theme={theme} onPress={onBack}>
          {onBack && (
            <Icon name="arrow-back" size={24} color={theme.colors.background} />
          )}
        </HeaderButton>

        <HeaderTitle theme={theme}>{title}</HeaderTitle>

        <View>{rightComponent || <View style={{ width: 24 }} />}</View>
      </HeaderContainer>
    </View>
  );
};
