import React from 'react';
import { Image } from 'react-native';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { AppStackNavigator } from './AppStackNavigator'
import BloodDonateScreen from '../screens/BloodDonateScreen';


export const AppTabNavigator = createBottomTabNavigator({
  DonateBlood : {
    screen: AppStackNavigator,
    navigationOptions :{
      tabBarIcon : <Image source={require("../assets/blood.png")} style={{width:30, height:30}}/>,
      tabBarLabel : "Request Blood",
    }
  },
  BookRequest: {
    screen: BloodDonateScreen,
    navigationOptions :{
      tabBarIcon : <Image source={require("../assets/blood2.png")} style={{width:30, height:30}}/>,
      tabBarLabel : "Donation Bank",
    }
  }
});
