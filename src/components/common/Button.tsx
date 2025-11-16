// src/components/common/Button.tsx
import React from 'react';
import { TouchableOpacity, TouchableOpacityProps, ActivityIndicator } from 'react-native';
import styled from 'styled-components/native';
import { useTheme } from '../../contexts/ThemeContext';

const StyledButton = styled.TouchableOpacity<{ 
  theme: any; 
  variant: 'primary' | 'secondary' | 'outline';
  disabled?: boolean;
  fullWidth?: boolean;
}>`
  background-color: ${({ theme, variant, disabled }) => {
    if (disabled) return theme.colors.border;
    if (variant === 'primary') return theme.colors.primary;
    if (variant === 'secondary') return theme.colors.secondary;
    return 'transparent';
  }};
  border: ${({ theme, variant }) => 
    variant === 'outline' ? `2px solid ${theme.colors.primary}` : 'none'};
  padding-vertical: ${({ theme }) => theme.spacing.sm}px;
  padding-horizontal: ${({ theme }) => theme.spacing.lg}px;
  border-radius: ${({ theme }) => theme.borderRadius.md}px;
  align-items: center;
  justify-content: center;
  min-height: ${({ theme }) => theme.spacing.xl * 1.5}px;
  width: ${({ fullWidth }) => fullWidth ? '100%' : 'auto'};
  opacity: ${({ disabled }) => disabled ? 0.6 : 1};
`;

const ButtonText = styled.Text<{ theme: any; variant: string }>`
  color: ${({ theme, variant }) => 
    variant === 'outline' ? theme.colors.primary : theme.colors.background};
  font-size: ${({ theme }) => theme.typography.button.fontSize}px;
  font-weight: ${({ theme }) => theme.typography.button.fontWeight};
  text-align: center;
`;

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: 'primary' | 'secondary' | 'outline';
  loading?: boolean;
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  title, 
  variant = 'primary', 
  loading = false, 
  disabled = false,
  fullWidth = false,
  ...props 
}) => {
  const theme = useTheme();

  return (
    <StyledButton
      theme={theme}
      variant={variant}
      disabled={disabled || loading}
      fullWidth={fullWidth}
      {...props}
    >
      {loading ? (
        <ActivityIndicator 
          color={variant === 'outline' ? theme.colors.primary : theme.colors.background} 
          size="small" 
        />
      ) : (
        <ButtonText theme={theme} variant={variant}>
          {title}
        </ButtonText>
      )}
    </StyledButton>
  );
};