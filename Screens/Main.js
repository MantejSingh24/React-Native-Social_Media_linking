import React, {Component} from 'react';
import {Text, StyleSheet, View, Button} from 'react-native';
import firebase from '@react-native-firebase/app';
import '@react-native-firebase/auth';

export default class Main extends Component {
  signOutUser = async () => {
    try {
      await firebase
        .auth()
        .signOut()
        .then(() => this.props.navigation.navigate('Login'));
    } catch (e) {
      console.log(e);
    }
  };

  render() {
    return (
      <View>
        <Button
          title={'SignOut'}
          onPress={() => {
            this.signOutUser();
          }}></Button>
      </View>
    );
  }
}

const styles = StyleSheet.create({});
