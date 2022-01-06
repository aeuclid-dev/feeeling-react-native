import React from 'react';
import {View,Text,Dimensions,Image,StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import CI_LOGO_COLOR from '../resource/images/feeeling_ci_coral.png'; // -> in circle btn
const {height, width} = Dimensions.get('window');

export default function ScreenHeader(props){
  return(
    <View style={[styles.screenHader]}>
      {props.backBtn?(
        <Icon
          name="ios-arrow-back"
          size={40}
          color={'black'}
          style={styles.headerBackBtn}
          onPress={() => {
            props.location === undefined ?
            props.navigation.goBack():
            props.navigation.navigate(props.location);
          }}
        />
        ):(
          <View style={styles.emptyView}/>
        )}
      <Image 
        source={CI_LOGO_COLOR}
        style={styles.headerLogo}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  screenHader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: width,
    height: height / 12,
  },
  headerBackBtn:{
    marginRight: 3,
    marginLeft: 20,
    marginBottom: -3,
    color: '#000',
  },
  headerLogo:{
    marginRight: 10,
    marginTop: 5,
  },
  emptyView:{
    width:10,
  }
});