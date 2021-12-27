import 'react-native-gesture-handler';
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import DashBoard from '../Screens/DashBoard'

const Stack = createStackNavigator();
export const NavStack2 = () => {

    return (
        <Stack.Navigator>
            <Stack.Screen
                name="DashBoard"
                component={DashBoard}
                options={{ headerShown: false }}
            />
        </Stack.Navigator>
    )
}