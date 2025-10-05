/* eslint-disable quotes */
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    SafeAreaView: {
        flex: 1,
        backgroundColor: 'white',
        padding: 10,
        flexDirection: 'column',
    },
    ImageContainer: {
        marginTop: 30,
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '40%',
        borderRadius: 50,
    },
    Image: {
        height: 250,
        width: 200,
    },
    HeaderContainer: {
        marginTop: 30,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '20%',
    },
    HeaderText: {
        paddingLeft: 19,
        color: 'black',
        fontSize: 25,
        fontWeight: '900',
    },
    ButtonContainer: {
        marginTop: 30,
        flex: 0.3,
        padding: 30,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignContent: 'center',
        alignItems: 'center',
        // backgroundColor: 'rgba(114, 177, 219, 1)',
    },
    Button: {
        padding: 10,
        borderRadius: 30,
        textAlign: 'center',
        height: '100%',
        width: '45%',
        backgroundColor: 'rgba(44, 119, 170, 1)',

    },
    ButtonText: { marginTop: 9, textAlign: 'center', fontSize: 15, color: 'white' },
});
