import React from 'react'
import {
  View,
  Text,
  Platform,
  TouchableNativeFeedback,
  TouchableOpacity,
  StyleSheet,
} from 'react-native'
import Colors from '../constants/Colors'

const ButtonComponent = (props) => {
  let ButtonCmp = TouchableOpacity
  if (Platform.OS === 'android' && Platform.Version >= 21) {
    ButtonCmp = TouchableNativeFeedback
  }
  let stylingBtn = styles.btnContainer
  if (props.disabled) {
    stylingBtn = styles.btnContainerDisabled
  }
  return (
    <View style={styles.mainContainer}>
      <ButtonCmp onPress={props.onPress} disabled={props.disabled}>
        <View style={stylingBtn}>
          <Text style={styles.content}>{props.text}</Text>
        </View>
      </ButtonCmp>
    </View>
  )
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    overflow:
      Platform.OS === 'android' && Platform.Version >= 21
        ? 'hidden'
        : 'visible',
    borderRadius: 10,
    margin: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnContainer: {
    paddingVertical: 2.5,
    width: '100%',
    backgroundColor: Colors.primary,
  },
  content: {
    color: Colors.accent,
    textAlign: 'center',
    fontFamily: 'open-sans',
  },
  btnContainerDisabled: {
    paddingVertical: 2.5,
    width: '100%',
    backgroundColor: Colors.highlight,
  },
})

export default ButtonComponent
