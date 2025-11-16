// src/components/common/Container.tsx
import React from 'react';
import { View, ViewProps } from 'react-native';
import styled from 'styled-components/native';
import { useTheme } from '../../contexts/ThemeContext';

const StyledContainer = styled.View<{ theme: any }>`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background};
  padding-horizontal: ${({ theme }) => theme.spacing.md}px;
`;

interface ContainerProps extends ViewProps {
  children: React.ReactNode;
}

export const Container: React.FC<ContainerProps> = ({ children, ...props }) => {
  const theme = useTheme();
  return (
    <StyledContainer theme={theme} {...props}>
      {children}
    </StyledContainer>
  );
};