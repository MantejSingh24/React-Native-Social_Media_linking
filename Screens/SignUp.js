import React from 'react';
import firebase from '@react-native-firebase/app';
import '@react-native-firebase/auth';
import '@react-native-firebase/database';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  Button,
  Keyboard,
} from 'react-native';
import {LoginManager, AccessToken} from 'react-native-fbsdk';
import {GoogleSignin} from '@react-native-community/google-signin';

GoogleSignin.configure({
  webClientId:
    '253812716665-m5ak90qriiluuuagtqit6d12q9p9tnff.apps.googleusercontent.com',
});

export default class SignUp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      response: '',
    };

    this.handleSignUp = this.handleSignUp.bind(this);
  }

  async onFacebookButtonPress() {
    Keyboard.dismiss();
    // Attempt login with permissions
    const result = await LoginManager.logInWithPermissions([
      'public_profile',
      'email',
    ]);

    if (result.isCancelled) {
      throw 'User cancelled the login process';
    }

    // Once signed in, get the users AccesToken
    const data = await AccessToken.getCurrentAccessToken();

    if (!data) {
      throw 'Something went wrong obtaining access token';
    }

    // Create a Firebase credential with the AccessToken
    const facebookCredential = firebase.auth.FacebookAuthProvider.credential(
      data.accessToken,
    );
    console.log(data);
    // Sign-in the user with the credential

    try {
      return await firebase
        .auth()
        .signInWithCredential(facebookCredential)
        .then(() => this.props.navigation.navigate('Main'));
    } catch (error) {
      alert(error);
    }
  }

  async onGoogleButtonPress() {
    // Get the users ID token
    const {idToken} = await GoogleSignin.signIn();

    // Create a Google credential with the token
    const googleCredential = firebase.auth.GoogleAuthProvider.credential(
      idToken,
    );

    // Sign-in the user with the credential
    try {
      return await firebase
        .auth()
        .signInWithCredential(googleCredential)
        .then(() => this.props.navigation.navigate('Main'));
    } catch (error) {
      alert(error);
    }
  }

  async handleSignUp() {
    Keyboard.dismiss();

    try {
      await firebase
        .auth()
        .createUserWithEmailAndPassword(this.state.email, this.state.password)
        .then((authData) => {
          let account = {};
          account.email = authData.user.email.toLowerCase();
          account.uid = authData.user.uid;
          firebase
            .database()
            .ref('users/' + authData.user.uid)
            .set({
              account,
            })
            .then(() => this.props.navigation.navigate('Main'));
        })
        .catch((err) => console.log(err));
    } catch (error) {
      console.log(error);
    }
  }
  render() {
    return (
      <View style={styles.container}>
        <Text>Sign Up</Text>

        <TextInput
          placeholder="Email"
          autoCapitalize="none"
          style={styles.textInput}
          onChangeText={(email) => this.setState({email})}
          value={this.state.email}
        />
        <TextInput
          secureTextEntry
          placeholder="Password"
          autoCapitalize="none"
          style={styles.textInput}
          onChangeText={(password) => this.setState({password})}
          value={this.state.password}
        />
        <Button title="Sign Up" onPress={this.handleSignUp} />
        <Button
          title="Already have an account? Login"
          onPress={() => this.props.navigation.navigate('Login')}
        />
        <Button
          title="Facebook Sign-In"
          onPress={() =>
            this.onFacebookButtonPress().then(() =>
              console.log('Signed in with Facebook!'),
            )
          }
        />
        <Button
          title="Google Sign-In"
          onPress={() =>
            this.onGoogleButtonPress().then(() =>
              console.log('Signed in with Google!'),
            )
          }
        />
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
  textInput: {
    height: 40,
    width: '90%',
    borderColor: 'gray',
    borderWidth: 1,
    marginTop: 8,
  },
});
