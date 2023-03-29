/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useEffect} from 'react';
import {
  Button,
  PermissionsAndroid,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';

import {Colors} from 'react-native/Libraries/NewAppScreen';
import messaging from '@react-native-firebase/messaging';

const FIREBASE_SERVER_KEY =
  'AAAAGyacEv4:APA91bH-ihUHU9g8Bt4WF2qS5ctwff1PhHUh-yQZMcQI4Foru3l8Ef98f3JsfiEAWfzIhiBW8-BeWXvIoiLDjaR4Ac6q1une3aaeJ7jsmqGHBOdazBbQD0z6KkKOUEZJ_xrRRTwyXL6I';

const iOSFCM =
  'esWR9AgQykgPmC7S0KLR36:APA91bGRg9mloqR48fLGTRr0O42eCuRznVQQOi46n6AThEyDv34MiDqDcUTRut5R90jKZYGQjnvu7rKSqLwCwuupRbWSv1jctOoY-l1YMA8n0E8CSwHscBXX2i6qYlti791CiC_Sy9PP';
const androidFCM =
  'eKmRpM1VS6yEN4bP20xVIC:APA91bFmpDJy5h_MzDC40_HRijrk0IKN-ITasgk6C0EOGM-uwX7FmFTvxWng8Sfahla8OSjQupcEOiwrSUDtubpzvQob_YDniAhcH8aIZzMwll4zLqc6TnyF150atQuk0LWz6jwlxKOC';

messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('Message handled in the background!', remoteMessage);
});

function requestAndroidPermission() {
  PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
}

async function requestUserPermission() {
  const authorizationStatus = await messaging().requestPermission();

  if (authorizationStatus) {
    console.log('Permission status:', authorizationStatus);
  }
}
// Reference link: https://www.inkoop.io/blog/how-to-send-push-notifications-to-specific-devices-in-react-native-using-firebase/
// https://firebase.google.com/docs/cloud-messaging/http-server-ref
async function sendMessage(token: string) {
  const message = {
    registration_ids: [token],
    notification: {
      title: 'Hello',
      body:
        Platform.OS == 'ios'
          ? 'Send a message from iOS'
          : 'Send a message from Android',
      vibrate: 1,
      sound: 1,
      image:
        'https://yt3.googleusercontent.com/ytc/AL5GRJVhQ4VfaYk7tLNMPDyNkgjTqWKnOXhA-NQZ1FFDUA=s176-c-k-c0x00ffffff-no-rj',
      priority: 'high',
      show_in_foreground: true,
      content_available: true,
    },
    data: {
      title: 'data_title',
      body: 'data_body',
      extra: 'data_extra',
    },
  };

  let headers = new Headers({
    'Content-Type': 'application/json',
    Authorization: 'key=' + FIREBASE_SERVER_KEY,
  });

  let response = await fetch('https://fcm.googleapis.com/fcm/send', {
    method: 'POST',
    headers,
    body: JSON.stringify(message),
  });
  response = await response.json();
  console.log(response);
}

function App(): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  if (Platform.OS == 'android') {
    requestAndroidPermission();
  }

  useEffect(() => {
    const setUpCloudMessaging = async () => {
      requestUserPermission();

      const token = await messaging().getToken();
      console.log('token is ' + token);
    };
    setUpCloudMessaging();
  }, []);

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
        <Text
          style={[
            styles.titleStyle,
            {color: isDarkMode ? Colors.lighter : Colors.darker},
          ]}>
          Cloud Messaging Test
        </Text>
        <View style={styles.buttonStyle}>
          <Button
            title="Send to iOS"
            onPress={() => {
              sendMessage(iOSFCM);
            }}
          />
        </View>

        <View style={styles.buttonStyle}>
          <Button
            title="Send to Android"
            onPress={() => {
              sendMessage(androidFCM);
            }}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  titleStyle: {
    textAlign: 'center',
    fontSize: 20,
    marginTop: 18,
  },
  buttonStyle: {
    margin: 16,
  },
});

export default App;
