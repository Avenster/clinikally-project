import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { CartProvider } from './src/components/layout/CartContext';
import HomeScreen from './src/screens/HomeScreen';
import ProductList from './src/components/ProductList';
import Navbar from './src/components/layout/Navbar';
import Bottom from './src/components/Bottom';
import ProductDetail from './src/components/ProductDetail';

const Stack = createNativeStackNavigator();

// Define screen components with navigation prop
const DoctorConsultScreen = ({ navigation }) => null;
const OffersScreen = ({ navigation }) => null;
const QuizScreen = ({ navigation }) => null;
const WhatsappScreen = ({ navigation }) => null;
const ProfileScreen = ({ navigation }) => null;
const CartScreen = ({ navigation }) => null;

const ShopScreen = ({ navigation }) => {
  return (
    <ProductList navigation={navigation} />
  );
};

// Create a main layout component that includes Navbar and Bottom
const MainLayout = ({ children, navigation, route }) => {
  const [currentRoute, setCurrentRoute] = useState('Home');
  const [previousRoute, setPreviousRoute] = useState('Home');

  useEffect(() => {
    const unsubscribe = navigation.addListener('state', (e) => {
      // Get the current route from the navigation state
      const currentNav = e.data.state?.routes[e.data.state?.index];
      const nestedNav = currentNav?.state?.routes[currentNav?.state?.index];
      const newRoute = nestedNav?.name || currentNav?.name || 'Home';
      
      // If navigating to ProductDetail, maintain the previous main route
      if (newRoute === 'ProductDetail') {
        setPreviousRoute(currentRoute);
      } else {
        setPreviousRoute(newRoute);
      }
      
      // Set current route to either the new route or maintain previous route for ProductDetail
      setCurrentRoute(newRoute === 'ProductDetail' ? previousRoute : newRoute);
    });

    return unsubscribe;
  }, [navigation, previousRoute, currentRoute]);

  return (
    <SafeAreaView style={styles.container}>
      <Navbar navigation={navigation} />
      {children}
      <Bottom currentRoute={currentRoute} />
    </SafeAreaView>
  );
};

export default function App() {
  return (
    <SafeAreaProvider>
      <CartProvider>
        <NavigationContainer>
          <StatusBar style="auto" />
          <Stack.Navigator
            screenOptions={{
              headerShown: false,
            }}
          >
            <Stack.Screen name="MainScreen">
              {(props) => (
                <MainLayout {...props}>
                  <Stack.Navigator
                    screenOptions={{
                      headerShown: false,
                    }}
                    initialRouteName="Home"
                  >
                    <Stack.Screen 
                      name="Home" 
                      component={HomeScreen}
                      options={{ title: 'Home' }}
                    />
                    <Stack.Screen 
                      name="Shop" 
                      component={ShopScreen}
                      options={{ title: 'Shop' }}
                    />
                    <Stack.Screen 
                      name="ProductDetail" 
                      component={ProductDetail}
                      options={{ title: 'Product Detail' }}
                    />
                    <Stack.Screen 
                      name="DoctorConsult" 
                      component={DoctorConsultScreen}
                      options={{ title: 'Doctor Consult' }}
                    />
                    <Stack.Screen 
                      name="Offers" 
                      component={OffersScreen}
                      options={{ title: 'Offers' }}
                    />
                    <Stack.Screen 
                      name="Quiz" 
                      component={QuizScreen}
                      options={{ title: 'Quiz' }}
                    />
                    <Stack.Screen 
                      name="Whatsapp" 
                      component={WhatsappScreen}
                      options={{ title: 'Whatsapp' }}
                    />
                    <Stack.Screen 
                      name="Profile" 
                      component={ProfileScreen}
                      options={{ title: 'Profile' }}
                    />
                    <Stack.Screen 
                      name="Cart" 
                      component={CartScreen}
                      options={{ title: 'Cart' }}
                    />
                  </Stack.Navigator>
                </MainLayout>
              )}
            </Stack.Screen>
          </Stack.Navigator>
        </NavigationContainer>
      </CartProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  contentContainer: {
    flex: 1,
  },
});