// src/components/common/Input.tsx
import React from 'react';
import { TextInput, TextInputProps } from 'react-native';
import styled from 'styled-components/native';
import { useTheme } from '../../contexts/ThemeContext';

const StyledInput = styled.TextInput<{ theme: any; hasError?: boolean }>`
  background-color: ${({ theme }) => theme.colors.surface};
  border: 2px solid ${({ theme, hasError }) => 
    hasError ? theme.colors.error : theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md}px;
  padding: ${({ theme }) => theme.spacing.sm}px;
  font-size: ${({ theme }) => theme.typography.body.fontSize}px;
  color: ${({ theme }) => theme.colors.text};
  min-height: ${({ theme }) => theme.spacing.xl * 1.5}px;
`;

const ErrorText = styled.Text<{ theme: any }>`
  color: ${({ theme }) => theme.colors.error};
  font-size: ${({ theme }) => theme.typography.caption.fontSize}px;
  margin-top: ${({ theme }) => theme.spacing.xs}px;
`;

const Label = styled.Text<{ theme: any }>`
  color: ${({ theme }) => theme.colors.text};
  font-size: ${({ theme }) => theme.typography.body.fontSize}px;
  font-weight: 600;
  margin-bottom: ${({ theme }) => theme.spacing.xs}px;
`;

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({ label, error, ...props }) => {
  const theme = useTheme();

  return (
    <>
      {label && <Label theme={theme}>{label}</Label>}
      <StyledInput
        theme={theme}
        hasError={!!error}
        placeholderTextColor={theme.colors.placeholder}
        {...props}
      />
      {error && <ErrorText theme={theme}>{error}</ErrorText>}
    </>
  );
};