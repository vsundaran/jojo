// // App.tsx
// import React from 'react';
// import { SafeAreaProvider } from 'react-native-safe-area-context';
// import { ThemeProvider } from './src/contexts/ThemeContext';
// import { AuthProvider } from './src/contexts/AuthContext';
// import { AppNavigator } from './src/navigation/AppNavigator';
// import { Header } from '@components/common/Header';

// const App: React.FC = () => {
//   return (
//     <SafeAreaProvider>
//       <ThemeProvider>
//         <AuthProvider>
//           <AppNavigator />
//         </AuthProvider>
//       </ThemeProvider>
//     </SafeAreaProvider>
//   );
// };

// export default App;


// App.tsx
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider } from './src/contexts/ThemeContext';
import { AuthProvider } from './src/contexts/AuthContext';
import { CallProvider } from './src/contexts/CallContext';
import { AppNavigator } from './src/navigation/AppNavigator';

const App: React.FC = () => {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AuthProvider>
          <CallProvider>
            <AppNavigator />
          </CallProvider>
        </AuthProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
};

export default App;