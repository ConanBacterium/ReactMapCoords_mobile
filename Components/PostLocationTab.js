import React, { useEffect } from 'react'
import { StyleSheet, Text, View, TextInput, Button  } from 'react-native';
import { useLocation } from '../hooks/useLocation';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    input: {
        width: 300,
        height: 40,
        borderWidth: 1,
        borderColor: "black",
        marginBottom: 20,
    }
})

// TODO refactor out of this file
function postLocation(altitude, latitude, longitude, poiname, descr) {
    fetch('http://5.180.182.41/poi', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            altitude: altitude,
            longitude: longitude,
            latitude: latitude,
            POIName: poiname,
            descr: descr,
        })
    })
    .then(res => res.json())
    .then(data => {
        console.log(data);
    })
    .catch(err => {
        console.log(err);
    })
}

export default function PostLocationTab() {
    const [status, setStatus] = React.useState("");
    const [location, updateLocation] = useLocation();
    const [name, setName] = React.useState("");
    const [description, setDescription] = React.useState("");

    async function post() {
        console.log("posting");
        await updateLocation(); // TODO this might not be set before next line is executed....... because it's a react state.
        postLocation(location.coords.altitude, location.coords.latitude, location.coords.longitude, name, description);
    }

    return (
    <View style={styles.container}>
        <TextInput style={styles.input} placeholder="name" onChangeText={(text) => setName(text)}/> 
        <TextInput style={styles.input} placeholder="description" onChangeText={(text) => {setDescription(text)}} />
        <Button title="Post Point-of-Interest" onPress={() => {post()}} />
    </View>
    )
}
