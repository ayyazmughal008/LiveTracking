import React, { useEffect } from 'react'
import { NavigationContainer } from '@react-navigation/native';
import { NavStack } from "./src/Navigator";
import { NavStack2 } from "./src/MainNavigator";
import { useSelector, useDispatch } from 'react-redux';
import messaging from '@react-native-firebase/messaging';
import { saveToken } from './src/Redux/action'

const App = () => {
    const dispatch = useDispatch();
    const login = useSelector((state) => state.user.login);

    useEffect(() => {
        updateData();
    }, [])
    const updateData = async () => {
        const authStatus = await messaging().requestPermission();
        const enabled =
            authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
            authStatus === messaging.AuthorizationStatus.PROVISIONAL;

        if (enabled) {
            getFcmToken();
            console.log('Authorization status:', authStatus);
        }
        messaging().onMessage(async remoteMessage => {
            console.log(remoteMessage.data.type)
        });
        messaging().setBackgroundMessageHandler(async remoteMessage => {
            console.log('Message handled in the background!', remoteMessage.data);
        });
        messaging().onNotificationOpenedApp(remoteMessage => {
            console.log(
                'Notification caused app to open from background state:',
                remoteMessage.data,
            );
        });
        // Check whether an initial notification is available
        messaging().getInitialNotification().then(remoteMessage => {
            if (remoteMessage) {
                console.log(
                    'Notification caused app to open from quit state:',
                    remoteMessage.data,
                );
            }
        });
    }
    const getFcmToken = async () => {
        const fcmToken = await messaging().getToken();
        if (fcmToken) {
            console.log("Your Firebase Token is:", fcmToken);
            dispatch(saveToken(fcmToken))
        } else {
            console.log("Failed", "No token received");
        }
    }


    return (
        <NavigationContainer>
            {!login ?
                <NavStack />
                : <NavStack2 />
            }
        </NavigationContainer>
    );
}

export default App;