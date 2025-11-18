import { useTheme } from '@contexts/ThemeContext';
import { StatusBar, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import styled from 'styled-components/native';

const TopBar = styled.View<{ height: number; bg: string }>`
  height: ${({ height }) => height}px;
  background-color: ${({ bg }) => bg};
`;

export const StatusBarComponent: React.FC = () => {
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={theme.colors.statusBar}
      />
      <TopBar height={insets.top} bg={theme.colors.statusBar} />
    </View>
  );
};
