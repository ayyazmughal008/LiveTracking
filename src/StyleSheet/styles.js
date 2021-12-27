import { StyleSheet } from 'react-native'
import { widthPercentageToDP, heightPercentageToDP } from 'react-native-responsive-screen'

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        //backgroundColor: "red"
    },
    loading: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center'
    },
    centerContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        width: widthPercentageToDP(80),
        //backgroundColor:"yellow", 
        alignSelf: "center"
    },
    inputTxt: {
        fontSize: widthPercentageToDP(4),
        color: "#000",
        fontWeight: "bold",
    },
    btn: {
        width: "100%",
        height: heightPercentageToDP(7),
        marginTop: heightPercentageToDP(4),
        borderRadius: widthPercentageToDP(4),
        backgroundColor: "#000",
        justifyContent: "center",
        alignItems: "center"
    },
    btnTxt: {
        fontSize: widthPercentageToDP(4),
        color: "#ffffff",
        fontWeight: "bold",
    },
    manNews: {
        width: widthPercentageToDP(90),
        flex: 0,
        alignSelf: "center"
    },
    detail: {
        marginTop: heightPercentageToDP(2),
        fontSize: widthPercentageToDP(4),
        color: "#000000",
        fontWeight: "bold",
    },
    loading: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center'
      }
})