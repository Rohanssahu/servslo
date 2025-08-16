import { View, Text, Image, Keyboard, Platform, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import _routes from '../routes/routes';

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      Platform.OS === 'android' ? 'keyboardDidShow' : 'keyboardWillShow',
      () => setKeyboardVisible(true)
    );
    const keyboardDidHideListener = Keyboard.addListener(
      Platform.OS === 'android' ? 'keyboardDidHide' : 'keyboardWillHide',
      () => setKeyboardVisible(false)
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          display: isKeyboardVisible ? 'none' : 'flex',
          height: 70,
          paddingBottom: 10,
          paddingTop: 10,
          borderTopWidth: 0.5,
          borderTopColor: '#ddd',
          backgroundColor: '#ffffff',
        },
      }}
    >
      {_routes.BOTTOM_TAB.map((screen, index) => (
        <Tab.Screen
          key={screen.name}
          name={screen.name}
          component={screen.Component}
          options={{
            tabBarIcon: ({ focused }) => (
              <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                {screen.lable !== 'Help' ? (
                  <>
                    <Image
                      source={screen.logo}
                      style={{
                        width: 24,
                        height: 24,
                        resizeMode: 'contain',
                        tintColor: focused ? '#4d2b98' : '#9e9e9e',
                      }}
                    />
                    <Text
                      style={{
                        fontSize: 12,
                        marginTop: 4,
                        color: focused ? '#4d2b98' : '#777777',
                        fontWeight: focused ? '700' : '500',
                      }}
                    >
                      {screen.lable}
                    </Text>
                  </>
                ) : (
                  // Center circular help icon (like Floating Action Button)
                  <View
                    style={{
                      height: 58,
                      width: 58,
                      borderRadius: 29,
                      backgroundColor: '#4d2b98',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginTop: -20,
                      elevation: 5,
                      shadowColor: '#000',
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: 0.2,
                      shadowRadius: 3,
                    }}
                  >
                    <Image
                      source={screen.logo}
                      style={{ height: 28, width: 28, tintColor: '#fff' }}
                    />
                  </View>
                )}
              </View>
            ),
          }}
        />
      ))}
    </Tab.Navigator>
  );
}
