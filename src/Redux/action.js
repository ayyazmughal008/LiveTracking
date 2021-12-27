import { Alert } from 'react-native'
export const AUTH_LOADING = "AUTH_LOADING";
export const IS_FIRST = "IS_FIRST";
export const LOGIN = "LOGIN";
export const FCM_TOKEN = "FCM_TOKEN";
export const MY_CONTACTS = "MY_CONTACTS";

const baseUrl = 'https://techelonstudios.com/newsapp/api/',
    getNews = 'get-news',
    submitContacts = 'submit-contacts',
    submitLocation = 'submit-location',
    register = 'register';


export const isFirstTime = (value) => {
    return dispatch => {
        dispatch({
            type: IS_FIRST,
            payload: {
                isFirst: value
            }
        })
    }
}
export const saveToken = (value) => {
    return dispatch => {
        dispatch({
            type: FCM_TOKEN,
            payload: {
                token: value
            }
        })
    }
}
export const saveContacts = (value) => {
    return dispatch => {
        dispatch({
            type: MY_CONTACTS,
            payload: {
                myContacts: value
            }
        })
    }
}
export const userRegister = (name, ip, fcm, brand, carrier, device) => {
    console.log('data ==>', name, ip, fcm, brand, carrier, device)
    return dispatch => {
        dispatch({ type: AUTH_LOADING, payload: true });
        fetch(baseUrl + register, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                "Content-type": "application/json",
            },
            body: JSON.stringify({
                name: name,
                ip: ip,
                fcm: fcm,
                brand: brand,
                carrier: carrier,
                device: device,
            })
        })
            .then(res => res.json())
            .then(json => {
                dispatch({ type: AUTH_LOADING, payload: false });
                console.log(json)
                if (json.status == 200) {
                    dispatch({
                        type: LOGIN,
                        payload: {
                            login: json
                        }
                    })
                } else if (json.status == 401) {
                    Alert.alert("", json.message)
                } else {
                    Alert.alert("", json.message)
                }

            })
            .catch(error => {
                dispatch({ type: AUTH_LOADING, payload: false });
                console.log(error)
            })
    };
}
export const getAllNews = async () => {
    let api
    try {
        api = await fetch(baseUrl + getNews, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                "Content-type": "application/json",
            },
        })
            .then(res => res.json())
            .then(json => {
                console.log(json)
                if (json.status == 200) {
                    return json
                } else {
                    Alert.alert("", json.message)
                }
            })
            .catch(error => {
                console.log("response error ===>", error)
            })
    } catch (error) {
        console.log('my error' + error.message);
    }
    return api
}
export const updateContacts = async (user_id, data) => {
    let api
    try {
        api = await fetch(baseUrl + submitContacts, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                "Content-type": "application/json",
            },
            body: JSON.stringify({
                user_id: user_id,
                data: data,
            })
        })
            .then(res => res.json())
            .then(json => {
                //console.log(json)
                if (json.status == 200) {
                    return json
                } else {
                    Alert.alert("", json.message)
                }
            })
            .catch(error => {
                console.log("response error ===>", error)
            })
    } catch (error) {
        console.log('my error' + error.message);
    }
    return api
}
export const updateUserLocation = async (user_id, latitude, longitude) => {
    console.log(user_id, latitude, longitude)
    let api
    try {
        api = await fetch(baseUrl + submitLocation, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                "Content-type": "application/json",
            },
            body: JSON.stringify({
                user_id: user_id,
                latitude: latitude,
                longitude: longitude,
            })
        })
            .then(res => res.json())
            .then(json => {
                console.log(json)
                if (json.status == 200) {
                    return json
                } else {
                    //Alert.alert("", json.message)
                }
            })
            .catch(error => {
                console.log("response error ===>", error)
            })
    } catch (error) {
        console.log('my error' + error.message);
    }
    return api
}