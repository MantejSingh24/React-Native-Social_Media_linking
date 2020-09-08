import React from 'react';
import {View, Text, ActivityIndicator, StyleSheet} from 'react-native';
import firebase from '@react-native-firebase/app';
import '@react-native-firebase/auth';

export default class Loading extends React.Component {
  async componentDidMount() {
    await firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.props.navigation.navigate('Main');
      } else {
        this.props.navigation.navigate('Login');
      }
    });
  }
  render() {
    return (
      <View style={styles.container}>
        <Text>Loading</Text>
        <ActivityIndicator size="large" />
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
