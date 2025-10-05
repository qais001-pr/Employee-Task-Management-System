/* eslint-disable comma-dangle */
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    safeAreaView: {
        flex: 1,
        backgroundColor: 'rgba(255, 255, 255, 1)'
    },
    imageContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
        width: '100%',
        height: '25%',
    },
    image: {
        marginTop: 19,
        width: 250,
        height: 200,
        borderTopLeftRadius: 70,
        borderBottomRightRadius: 70,
    },
    header: {
        padding: 15,
        marginTop: 5,
    },
    headerText: {
        textAlign: 'center',
        fontSize: 35,
        fontWeight: '900',
        color: 'rgba(54, 6, 138, 1)'
    },
    subtitleContainer: {
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    subtitleText: {
        fontSize: 18,
        color: 'rgba(6, 27, 148, 1)'
    },
    loginContainer: {
        flex: 1,
        position: 'relative',
        bottom: 0,
        padding: 4,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(62, 62, 158, 0.99)',
        borderTopLeftRadius: 100,
        borderBottomStartRadius: 100,
        borderLeftWidth: 10,
        borderLeftColor: 'rgba(27, 138, 186, 1)',
        borderTopWidth: 6,
        borderTopColor: 'rgba(14, 195, 235, 1)',
        paddingTop: 90,
    },
    labelContainer: {
        // backgroundColor: 'black',
        paddingLeft: 10,
        paddingBottom: 3,
    },
    labelText: {
        fontSize: 19,
        color: 'white',
    },
    textInputContainer: {
        paddingLeft: 8,
        width: '98%',
        height: 60,
    },
    textInput: {
        backgroundColor: 'white',
        borderRadius: 2,
        height: 50,
        color: 'black',
        fontSize: 14,
        paddingLeft: 14,
    },
    buttonContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        backgroundColor: 'rgba(17, 17, 110, 1)',
        padding: 4,
        borderRadius: 100,
        width: '40%',
        marginTop: 10,
    },
    buttonText: {
        color: 'white',
        fontSize: 25,
        padding: 4,
    },
});
