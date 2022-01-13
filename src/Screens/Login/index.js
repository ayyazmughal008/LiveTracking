import React, { useState, useEffect } from 'react'
import { View, Text, TouchableOpacity, PermissionsAndroid, Platform, ActivityIndicator, Alert, Modal } from 'react-native'
import { Input, Header } from 'react-native-elements'
import Contacts from 'react-native-contacts';
import { styles } from '../../StyleSheet/styles'
import geolocation from 'react-native-geolocation-service'
import { widthPercentageToDP, heightPercentageToDP } from 'react-native-responsive-screen'
import { NetworkInfo } from 'react-native-network-info';
import { userRegister, saveContacts, isFirstTime } from '../../Redux/action'
import { useDispatch, useSelector } from 'react-redux';
import DeviceInfo from 'react-native-device-info';
import FastImage from 'react-native-fast-image';
import { openSettings, checkLocationAccuracy, check, PERMISSIONS, RESULTS } from 'react-native-permissions';
import AppIntroSlider from 'react-native-app-intro-slider';



const Login = (props) => {
    const [loading, setLoading] = useState(false)
    const [myIp, setMyIp] = useState('')
    const [asyncdeviceinfo, setAsyncdeviceinfo] = useState({})
    const [name, setName] = useState('')
    const dispatch = useDispatch()
    const AuthLoading = useSelector((state) => state.user.AuthLoading);
    const isFirst = useSelector((state) => state.user.isFirst);
    const token = useSelector((state) => state.user.token);
    const myContacts = useSelector((state) => state.user.myContacts);
    const [isGranted, setGranted] = useState(false)
    //const [isFirst, setFirst] = useState(true)
    const sliderData = [
        require('../../Images/slider1.png'),
        require('../../Images/slider2.png'),
        require('../../Images/slider3.png'),
    ]

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
                    'title': 'Bimsis TIK DJP',
                    'message': 'Bimsis TIK DJP App access to your location '
                }
            )
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                if (Platform.OS === "android") {
                    PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_CONTACTS, {
                        title: "Bimsis TIK DJP",
                        message: "This app would like to view your contacts."
                    }).then(() => {
                        _getContacts();
                    })
                        .catch(error => {
                            //Alert.alert('','Anda belum mengaktifkan contacts. Aplikasi tidak berjalan maksimal.')
                        })
                } else {
                    _getContacts();
                }
                //alert("You can use the location");
            } else {
                console.log("Aplikasi tidak berjalan maksimal...")
                Alert.alert('Untuk mendukung demo aplikasi, Anda harus mengizinkan aplikasi untuk mengakses lokasi. Lakukan perizinan aplikasi di Pengaturan => Aplikasi => Pilih Bimsis TIK DJP => Perizinan => Perizinan Lokasi ')
            }
        } catch (err) {
            console.warn(err)
        }
    }
    const _getContacts = () => {
        setLoading(true)
        Contacts.checkPermission().then(permission => {
            // Contacts.PERMISSION_AUTHORIZED || Contacts.PERMISSION_UNDEFINED || Contacts.PERMISSION_DENIED
            if (permission === 'undefined') {
                Contacts.requestPermission().then(permission => {
                    // ...
                    console.log('a')
                    setLoading(false)
                })
            }
            if (permission === 'authorized') {
                setGranted(true)
                console.log('goooooooooooooos')
                setLoading(false)
                Contacts.getAll()
                    .then(contacts => {
                        console.log('all contacts ==>', contacts)
                        let tempArr = []
                        setLoading(false)
                        contacts.forEach((item, index) => {
                            tempArr.push({
                                name: `${item.givenName} ${item.familyName}`,
                                phone: !item.phoneNumbers.length ? "" : item.phoneNumbers[0].number
                            })
                        })
                        console.log('all contacts ==>', tempArr)
                        dispatch(saveContacts(tempArr))
                    })
                    .catch(error => {
                        setLoading(false)
                        console.log(error)
                    })
                // yay!
            }
            if (permission === 'denied') {
                Alert.alert('', 'Anda belum mengaktifkan contacts. Aplikasi tidak berjalan maksimal.')
                setLoading(false)
                // x.x
            }
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

    const _renderDoneButton = () => {
        return (
            <Text style={[styles.btnTxt, {
                color: "#000",
                marginTop:heightPercentageToDP(3)
            }]}>
                {"Lanjutkan"}
            </Text>
        );
    };
    const _renderNextButton = () => {
        return (
            <Text style={[styles.btnTxt, {
                color: "#000",
                marginTop:heightPercentageToDP(3)
            }]}>
                {"Lanjutkan"}
            </Text>
        );
    };

    const _renderItem = ({ item, index }) => {
        return (
            <View style={{ flex: 1,  alignItems: "center",backgroundColor:"#f3f3f3" }}>
                <FastImage
                    source={item}
                    resizeMode={FastImage.resizeMode.contain}
                    style={{
                        width: widthPercentageToDP(100),
                        height: heightPercentageToDP(88),
                        marginTop: heightPercentageToDP(2)
                    }}
                />
            </View>

        );
    }

    const _onDone = () => {
        dispatch(isFirstTime(true)),
            openSettings().catch(() => console.warn('cannot open settings'));
    }

    if (!isFirst) {
        return (
            <View style={{ flex: 1 }}>
                <AppIntroSlider
                    renderItem={_renderItem}
                    data={sliderData}
                    onDone={_onDone}
                    renderDoneButton={_renderDoneButton}
                    renderNextButton={_renderNextButton}
                    showNextButton = {true}
                    showDoneButton
                    dotStyle={{ width: "30%" }}
                    dotClickEnabled={false}
                    dotStyle={{ backgroundColor: "#cccccc", marginTop:heightPercentageToDP(3) }}
                    activeDotStyle={{ backgroundColor: "red",marginTop:heightPercentageToDP(3) }}
                />
            </View>
        )
    } else {
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

                <View style={styles.centerContainer}>
                    <Input
                        placeholder='Masukkan Nama Samaran Anda!'
                        placeholderTextColor={"#000"}
                        inputStyle={[styles.inputTxt, { paddingLeft: 0 }]}
                        //inputContainerStyle={{alignSelf:"center"}}
                        onChangeText={text => setName(text)}
                        containerStyle={{ borderBottomColor: "#000", }}
                    //style = {styles.inputTxt}
                    />
                    <TouchableOpacity
                        onPress={() => {
                            if (isGranted) {
                                //_checkAccuracy()
                                dispatch(userRegister(
                                    name,
                                    myIp,
                                    token,
                                    asyncdeviceinfo.brand,
                                    asyncdeviceinfo.carrier,
                                    asyncdeviceinfo.deviceType
                                ))
                            } else {
                                askPermission();
                                backgroundGranted()
                            }

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
                {/* {isFirst &&
                    <Modal
                        visible={isFirst}
                        animationType='slide'
                        onRequestClose={() => console.log('close')}
                        transparent={true}
                    >
                        <View style={{
                            flex: 1,
                            alignItems: "center",
                            backgroundColor: "#ffff"
                        }}>
                            <FastImage
                                source={require('../../Images/SShoot.jpg')}
                                resizeMode={FastImage.resizeMode.contain}
                                style={{
                                    width: "100%",
                                    height: "78%",
                                    marginTop: heightPercentageToDP(5)
                                }}
                            />
    
                            <TouchableOpacity
                                onPress={() => {
                                    setFirst(false),
                                        openSettings().catch(() => console.warn('cannot open settings'));
                                }}
                                style={[styles.btn, {
                                    width: widthPercentageToDP(85),
                                    alignSelf: "center"
                                }]}>
                                <Text style={styles.btnTxt}>
                                    {"Lanjutkan"}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </Modal>
                } */}
            </View>
        )
    }

}

export default Login;
