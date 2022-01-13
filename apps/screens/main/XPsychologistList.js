import React, {useState, useEffect} from 'react';
import { View, Text, FlatList } from 'react-native';
import XPsychologistView from './XPsychologistView';

const data = [ 1, 2, 3, 4, 5 ];

export default function XPsychologistList(props) {

    const renderItem = (o) => (<XPsychologistView>

    </XPsychologistView>);

    return (<FlatList data={data}
        renderItem={renderItem}
        keyExtractor={item => item.userid}>
    </FlatList>);
}

const styles = {
    helloworld: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    }
}
