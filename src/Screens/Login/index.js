import React, { useState, useEffect } from 'react'
import { View, Text, TouchableOpacity, PermissionsAndroid, Platform, ActivityIndicator } from 'react-native'
import { Input, Header } from 'react-native-elements'
import Contacts from 'react-native-contacts';
import { styles } from '../../StyleSheet/styles'
import geolocation from 'react-native-geolocation-service'
import { widthPercentageToDP, heightPercentageToDP } from 'react-native-responsive-screen'
import { NetworkInfo } from 'react-native-network-info';
import { userRegister, saveContacts } from '../../Redux/action'
import { useDispatch, useSelector } from 'react-redux';
import DeviceInfo from 'react-native-device-info';


const Login = (props) => {
    const [loading, setLoading] = useState(false)
    const [myIp, setMyIp] = useState('')
    const [asyncdeviceinfo, setAsyncdeviceinfo] = useState({})
    const [name, setName] = useState('')
    const dispatch = useDispatch()
    const AuthLoading = useSelector((state) => state.user.AuthLoading);
    const token = useSelector((state) => state.user.token);
    const myContacts = useSelector((state) => state.user.myContacts);

    useEffect(() => {
        askPermission()
        backgroundGranted()
    }, [])
    useEffect(() => {
        getMyIPAddress()
    }, [])
    useEffect(() => {
        getAllInfo()
    }, [asyncdeviceinfo])
    const askPermission = async () => {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                {
                    'title': 'LiveTracking App',
                    'message': 'LiveTracking App access to your location '
                }
            )
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                if (Platform.OS === "android") {
                    PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_CONTACTS, {
                        title: "Contacts",
                        message: "This app would like to view your contacts."
                    }).then(() => {
                        _getContacts();
                    });
                } else {
                    _getContacts();
                }
                //alert("You can use the location");
            } else {
                console.log("location permission denied")
                alert("Location permission denied");
            }
        } catch (err) {
            console.warn(err)
        }
    }
    const _getContacts = () => {
        setLoading(true)
        Contacts.getAll()
            .then(contacts => {
                let tempArr = []
                setLoading(false)
                contacts.forEach((item, index) => {
                    tempArr.push({
                        name: `${item.givenName} ${item.familyName}`,
                        phone: !item.phoneNumbers.length ? "" : item.phoneNumbers[0].number
                    })
                })
                dispatch(saveContacts(tempArr))
            })
            .catch(error => {
                setLoading(false)
                console.log(error)
            })
    }
    const getMyIPAddress = async () => {
        await NetworkInfo.getIPAddress().then(ipAddress => {
            console.log(ipAddress);
            setMyIp(ipAddress)
        });
    }
    const backgroundGranted = async () => {
        await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION,
            {
                title: 'Background Location Permission',
                message:
                    'We need access to your location ' +
                    'so you can get live quality updates.',
                buttonNeutral: 'Ask Me Later',
                buttonNegative: 'Cancel',
                buttonPositive: 'OK',
            },
        );
        if (PermissionsAndroid.RESULTS.GRANTED) {
            console.log('Permission granted')
        } else {
            console.log('Permission not granted')
        }
    }
    const getAllInfo = async () => {
        let deviceJSON = {};
        try {
            deviceJSON.brand = await DeviceInfo.getBrand();
            deviceJSON.carrier = await DeviceInfo.getCarrier();
            deviceJSON.deviceType = await DeviceInfo.getDeviceType();
        } catch (error) {
            console.log(error)
        }
        setAsyncdeviceinfo(deviceJSON)
    }



    return (
        <View style={styles.container}>
            <Header
                centerComponent={{
                    text: "LIVE TRACKING", style: {
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

            <View style={styles.centerContainer}>
                <Input
                    placeholder='User Name'
                    placeholderTextColor={"#000"}
                    inputStyle={[styles.inputTxt, { paddingLeft: 0 }]}
                    //inputContainerStyle={{alignSelf:"center"}}
                    onChangeText={text => setName(text)}
                    containerStyle={{ borderBottomColor: "#000", }}
                //style = {styles.inputTxt}
                />
                <TouchableOpacity
                    onPress={() => {
                        dispatch(userRegister(
                            name,
                            myIp,
                            token,
                            asyncdeviceinfo.brand,
                            asyncdeviceinfo.carrier,
                            asyncdeviceinfo.deviceType
                        ))
                        //props.navigation.navigate('DashBoard')
                    }}
                    style={styles.btn}>
                    <Text style={styles.btnTxt}>
                        {"Login"}
                    </Text>
                </TouchableOpacity>
            </View>
            {AuthLoading &&
                <ActivityIndicator
                    size="large"
                    color="#000000"
                    style={styles.loading}
                />
            }
        </View>
    )
}

export default Login;
