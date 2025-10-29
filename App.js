import { Nunito_400Regular, Nunito_700Bold, Nunito_800ExtraBold, useFonts } from '@expo-google-fonts/nunito';
import { Quicksand_600SemiBold } from '@expo-google-fonts/quicksand';
import { Ionicons } from '@expo/vector-icons';
import { DarkTheme, DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Pressable, useColorScheme, View } from 'react-native';
import AnimatedBackground from './src/components/AnimatedBackground';
import { FavoritesProvider } from './src/context/FavoritesContext';
import DetailsScreen from './src/screens/DetailsScreen';
import FavoritesScreen from './src/screens/FavoritesScreen';
import ForecastScreen from './src/screens/ForecastScreen';
import HomeScreen from './src/screens/HomeScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import { ThemeContext, ThemeProvider } from './src/theme/ThemeContext';

const Stack = createNativeStackNavigator();

export default function App() {
  const scheme = useColorScheme();
  const [fontsLoaded] = useFonts({
    Nunito_400Regular,
    Nunito_700Bold,
    Nunito_800ExtraBold,
    Quicksand_600SemiBold,
  });

  const FuturisticDarkTheme = {
    ...DarkTheme,
    colors: {
      ...DarkTheme.colors,
      background: '#0B0F14',
      card: '#0F1621',
      text: '#E6EDF3',
      border: '#1B2837',
      primary: '#5EE1FF',
      notification: '#7D5CFF',
    },
  };

  if (!fontsLoaded) return null;
  return (
    <FavoritesProvider>
      <ThemeProvider>
      <ThemeContext.Consumer>
        {({ isDark, accent }) => (
          <NavigationContainer theme={isDark ? FuturisticDarkTheme : DefaultTheme}>
            <AnimatedBackground accent={accent} />
            <Stack.Navigator
              screenOptions={{
                headerStyle: { backgroundColor: isDark ? '#0F1621' : '#FFFFFF' },
                headerTitleStyle: { fontFamily: 'Nunito_700Bold', letterSpacing: 0.5 },
                headerTintColor: isDark ? '#E6EDF3' : '#0B0F14',
                contentStyle: { backgroundColor: isDark ? '#0B0F14' : '#F7F9FC' },
              }}
            >
              <Stack.Screen 
                name="pocetna" 
                component={HomeScreen} 
                options={({ navigation }) => ({
                  title: 'Vrijeme',
                  headerRight: () => (
                    <View style={{ flexDirection: 'row', marginRight: 8 }}>
                      <Pressable
                        onPress={() => navigation.navigate('omiljeni')}
                        style={{ marginRight: 16, padding: 4 }}
                      >
                        <Ionicons
                          name="heart"
                          size={24}
                          color={isDark ? '#E6EDF3' : '#0B0F14'}
                        />
                      </Pressable>
                      <Pressable
                        onPress={() => navigation.navigate('postavke')}
                        style={{ marginRight: 16, padding: 4 }}
                      >
                        <Ionicons
                          name="settings"
                          size={24}
                          color={isDark ? '#E6EDF3' : '#0B0F14'}
                        />
                      </Pressable>
                    </View>
                  ),
                })}
              />
              <Stack.Screen name="detalji" component={DetailsScreen} options={{ title: 'Detalji' }} />
              <Stack.Screen name="prognoza" component={ForecastScreen} options={{ title: 'Prognoza' }} />
              <Stack.Screen name="postavke" component={SettingsScreen} options={{ title: 'Postavke' }} />
              <Stack.Screen name="omiljeni" component={FavoritesScreen} options={{ title: 'Omiljeni' }} />
            </Stack.Navigator>
          </NavigationContainer>
        )}
      </ThemeContext.Consumer>
      </ThemeProvider>
    </FavoritesProvider>
  );
}