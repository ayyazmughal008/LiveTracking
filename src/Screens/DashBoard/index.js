import React, { useState, useEffect } from 'react'
import { View, Text, TouchableOpacity, PermissionsAndroid, Platform, FlatList, Alert, ActivityIndicator, AppState } from 'react-native'
import { Input, Header } from 'react-native-elements'
import Contacts from 'react-native-contacts';
import { styles } from '../../StyleSheet/styles'
import geolocation from 'react-native-geolocation-service'
import { widthPercentageToDP, heightPercentageToDP } from 'react-native-responsive-screen'
import YoutubePlayer from "react-native-youtube-iframe";
import FastImage from 'react-native-fast-image';
import BackgroundJob from "react-native-background-job";
import { getAllNews, updateContacts, updateUserLocation } from '../../Redux/action'
import { useDispatch, useSelector } from 'react-redux';
import ReactNativeForegroundService from '@supersami/rn-foreground-service';
import RNLocation from 'react-native-location';
import Webview from 'react-native-webview'



let locationSubscription = null;
let locationTimeout = null;


const DashBoard = (props) => {
    const myContacts = useSelector((state) => state.user.myContacts);
    const login = useSelector((state) => state.user.login);
    const [loading, setLoading] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [playing, setPlaying] = useState(false);
    const [activeIndex, setIndex] = useState(0)
    const [region, setRegion] = useState({
        latitude: 0,
        longitude: 0,
    })
    const [response, setResponse] = useState('')
    const scalesPageToFit = Platform.OS === 'android';

    useEffect(() => {
        getApiData()
    }, [])

    useEffect(() => {
        RNLocation.configure({
            distanceFilter: 100, // Meters
            desiredAccuracy: {
                ios: 'best',
                android: 'balancedPowerAccuracy',
            },
            // Android only
            androidProvider: 'auto',
            interval: 5000, // Milliseconds
            fastestInterval: 10000, // Milliseconds
            maxWaitTime: 5000, // Milliseconds
            // iOS Only
            activityType: 'other',
            allowsBackgroundLocationUpdates: false,
            headingFilter: 1, // Degrees
            headingOrientation: 'portrait',
            pausesLocationUpdatesAutomatically: false,
            showsBackgroundLocationIndicator: false,
        });
        ReactNativeForegroundService.add_task(
            () => {
                RNLocation.requestPermission({
                    ios: 'whenInUse',
                    android: {
                        detail: 'fine',
                    },
                }).then((granted) => {
                    //console.log('Location Permissions: ', granted);
                    // if has permissions try to obtain location with RN location
                    if (granted) {
                        locationSubscription && locationSubscription();
                        locationSubscription = RNLocation.subscribeToLocationUpdates(
                            ([locations]) => {
                                locationSubscription();
                                locationTimeout && clearTimeout(locationTimeout);
                                //console.log(locations);
                                updateUserLocation(login.data.id, locations.latitude, locations.longitude)
                            },
                        );
                    } else {
                        locationSubscription && locationSubscription();
                        locationTimeout && clearTimeout(locationTimeout);
                        console.log('no permissions to obtain location');
                    }
                });
            },
            {
                delay: 1000,
                onLoop: true,
                taskId: 'taskid',
                onError: (e) => console.log('Error logging:', e),
            },
        );
        ReactNativeForegroundService.start({
            id: 144,
            title: 'Selamat Datang di Sosialisasi Keamanan Data dan Informasi TIK DJP',
            message: 'Demo keamanan aplikasi mobile TIK DJP',
        });
        //getCurrentLocation()
    }, [])

    // useEffect(() => {
    //     AppState.addEventListener('change', _handleAppStateChange);
    //     return () => {
    //         AppState.removeEventListener('change', _handleAppStateChange);
    //     }
    // }, [])
    // useEffect(() => {
    //     updateLatLong()
    // }, [])

    const _handleAppStateChange = (nextAppState) => {
        console.log('app state ===>', nextAppState)
    }

    const updateLatLong = async (lat, long) => {
        setInterval(() => {
            updateUserLocation(login.data.id, lat, long)
        }, 5000)
    }

    const getCurrentLocation = () => {
        geolocation.watchPosition(
            (position) => {
                console.log('updated ==>', position)
                setRegion({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                })
                //updateLatLong(position.coords.latitude,position.coords.longitude)
            },
            (error) => {
                console.log(JSON.stringify(error));
            },
            {
                enableHighAccuracy: true,
                timeout: 20000,
                maximumAge: 1000,
                distanceFilter: 10
            },
        );
    }
    const onViewRef = React.useRef((viewableItems) => {
        //console.log('========>',viewableItems.changed[0].index)
        setIndex(viewableItems.changed[0].index)
    })
    const viewConfigRef = React.useRef({ viewAreaCoveragePercentThreshold: 50 })

    const getApiData = async () => {
        setIsLoading(true)
        //const result = await getAllNews()
        await updateContacts(login.data.id, myContacts)
        //await setResponse(result)
        await setIsLoading(false)
    }

    const ActivityIndicatorLoadingView = () => {
        //making a view to show to while loading the webpage
        return (
            <ActivityIndicator
                color="#009688"
                size="large"
                style={styles.loading}
            />
        );
    }

    return (
        <View style={styles.container}>
            <Header
                centerComponent={{
                    text: "Bimsis TIK DJP", style: {
                        color: "#000",
                        fontSize: widthPercentageToDP(5),
                        fontWeight: "bold",
                    }
                }}
                containerStyle={{
                    backgroundColor: 'transparent',
                    //borderBottomWidth: 1,
                    //height: heightPercentageToDP(17)
                }}
                statusBarProps={{
                    backgroundColor: "#ffffff"
                }}
                barStyle="dark-content"
            />
            <Webview
                style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
                source={{
                    uri: `https://www.webb.re/test.php`,
                    //uri: 'http://95.179.208.227/acadmy/public/googleChart',
                    //html: '<meta name="viewport" content="initial-scale=1.0, maximum-scale=1.0">',
                    // method: 'GET'
                }}
                //Enable Javascript support
                javaScriptEnabled={true}
                //For the Cache
                domStorageEnabled={true}
                //View to show while loading the webpage
                renderLoading={ActivityIndicatorLoadingView}
                //Want to show the view or not
                startInLoadingState={true}
                scalesPageToFit={scalesPageToFit}
                bounces={false}
                scrollEnabled={false}
            >
            </Webview>
            {/* {!response || !response.data.length ?
                <View />
                : <FlatList
                    data={response.data}
                    showsVerticalScrollIndicator={false}
                    onViewableItemsChanged={onViewRef.current}
                    viewabilityConfig={viewConfigRef.current}
                    style={{ marginTop: heightPercentageToDP(5), }}
                    keyExtractor={(item, index) => 'key' + index}
                    renderItem={({ item, index }) => (
                        <View style={styles.manNews}>
                            {item.type === 'image' ?
                                <FastImage
                                    source={{ uri: "https://techelonstudios.com/newsapp/" + item.image }}
                                    resizeMode={FastImage.resizeMode.cover}
                                    style={{
                                        width: widthPercentageToDP(90),
                                        height: heightPercentageToDP(24)
                                    }}
                                />
                                : <YoutubePlayer
                                    height={300}
                                    play={activeIndex == index ? playing : false}
                                    videoId={item.youtube_link}
                                    onChangeState={state => {
                                        if (index === activeIndex) {
                                            if (state === "ended") {
                                                if (playing) {
                                                    setPlaying(false)
                                                } else {
                                                    setPlaying(true)
                                                }
                                            }
                                        }
                                    }}
                                />
                            }
                            <Text style={styles.detail}>
                                {item.description}
                            </Text>
                        </View>
                    )}
                />} */}
            {loading &&
                <ActivityIndicator
                    size="large"
                    color="#000000"
                    style={styles.loading}
                />
            }
            {isLoading &&
                <ActivityIndicator
                    size="large"
                    color="#000000"
                    style={styles.loading}
                />
            }
        </View>
    )
}

export default DashBoard;
