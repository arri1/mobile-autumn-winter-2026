import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import WelcomeScreen from './src/screens/WelcomeScreen';
import CounterScreen from './src/screens/CounterScreen';
import AboutScreen from './src/screens/AboutScreen';
import NameScreen from './src/screens/NameScreen';
import TimerScreen from './src/screens/TimerScreen';

const Tab = createBottomTabNavigator();

export default function App() {
    return (
        <NavigationContainer>
            <Tab.Navigator>
                <Tab.Screen name="Welcome" component={WelcomeScreen} />
                <Tab.Screen name="Counter" component={CounterScreen} />
                <Tab.Screen name="About" component={AboutScreen} />
                <Tab.Screen name="Name" component={NameScreen} />
                <Tab.Screen name="Timer" component={TimerScreen} />
            </Tab.Navigator>
        </NavigationContainer>
    );
}