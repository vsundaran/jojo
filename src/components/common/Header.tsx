// src/components/common/Header.tsx
import React from 'react';
import { View, Image } from 'react-native';
import styled from 'styled-components/native';
import { useTheme } from '../../contexts/ThemeContext';

import LinearGradient from 'react-native-linear-gradient';

import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { StatusBar } from 'react-native';

import logo from '../../assets/logo.png';

const HeaderContainer = styled(LinearGradient)<{ theme: any }>`
  height: ${({ theme }) => theme.headerHeight}px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding-horizontal: ${({ theme }) => theme.spacing.md}px;
`;

// const HeaderTitle = styled.Text<{ theme: any }>`
//   color: ${({ theme }) => theme.colors.background};
//   font-size: ${({ theme }) => theme.typography.h2.fontSize}px;
//   font-weight: ${({ theme }) => theme.typography.h2.fontWeight};
// `;

// const HeaderButton = styled.TouchableOpacity<{ theme: any }>`
//   padding: ${({ theme }) => theme.spacing.xs}px;
// `;
const TopBar = styled.View<{ height: number; bg: string }>`
  height: ${({ height }) => height}px;
  background-color: ${({ bg }) => bg};
`;

const Avatar = styled.View<{ theme: any }>`
  width: 50px;
  height: 50px;
  border-radius: 20px;
  background-color: ${({ theme }) => theme.colors.background};
  justify-content: center;
  align-items: center;
  margin-right: ${({ theme }) => theme.spacing.sm}px;
  flex-direction: row;
  align-items: center;
  gap: 3px;
`;

const AvatarText = styled.Text<{ color: string }>`
  font-size: 24px;
  font-weight: bold;
  color: ${({ color }) => color};
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
      <StatusBar
        barStyle="dark-content"
        backgroundColor={theme.colors.statusBar}
      />
      <TopBar height={insets.top} bg={theme.colors.statusBar} />
      <HeaderContainer
        theme={theme}
        colors={theme.colors.gradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <View
          style={{ borderRadius: theme.borderRadius.lg, overflow: 'hidden' }}
        >
          <Image source={logo} style={{ width: 50, height: 50 }} />
        </View>
        {/* <HeaderButton theme={theme} onPress={onBack}>
          {onBack && (
            <Icon name="arrow-back" size={24} color={theme.colors.background} />
          )}
        </HeaderButton> */}

        {/* <HeaderTitle theme={theme}>{title}</HeaderTitle> */}

        {/* <View>{rightComponent || <View style={{ width: 24 }} />}</View> */}
        <Avatar theme={theme}>
          <AvatarText color={theme.colors.jojoLogoColor}>A</AvatarText>
          <AvatarText color={theme.colors.primary}>S</AvatarText>
        </Avatar>
      </HeaderContainer>
    </View>
  );
};
