import React from 'react'
import {
  Text,
  View,
  StyleSheet,
  TouchableNativeFeedback,
  TouchableOpacity,
  Platform,
  ImageBackground,
  Button,
} from 'react-native'

import Colors from '../constants/Colors'
import ButtonComponent from '../components/ButtonComponent'

const Card = (props) => {
  let TouchableButton = TouchableOpacity
  if (Platform.OS === 'android' && Platform.Version >= 21) {
    TouchableButton = TouchableNativeFeedback
  }
  return (
    <View style={styles.container}>
      <TouchableButton onPress={props.onSelectLeftBtn}>
        <View style={styles.product}>
          <View style={styles.content}>
            <ImageBackground
              source={{ uri: props.imgUrl }}
              style={styles.bgImg}
            >
              <View style={styles.titleContainer}>
                <Text style={styles.title} numberOfLines={1}>
                  {props.title}
                </Text>
              </View>
            </ImageBackground>
          </View>
          <View style={styles.btnContainer}>
            <ButtonComponent
              onPress={props.onSelectLeftBtn}
              text={props.leftText}
            />
            <Text style={styles.price}>$ {props.price.toFixed(2)}</Text>
            <ButtonComponent
              onPress={props.onSelectRightBtn}
              text={props.rightText}
            />
          </View>
        </View>
      </TouchableButton>
    </View>
  )
}

const styles = StyleSheet.create({
  product: {
    elevation: 15,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    shadowOpacity: 0.26,
    backgroundColor: Colors.accent,
    // overflow: 'hidden',
    borderRadius: 15,
  },
  content: {
    flexDirection: 'row',
    height: '85%',
  },
  title: {
    fontSize: 18,
    color: Colors.accent,
    textAlign: 'center',
    fontFamily: 'open-sans-bold',
  },
  price: {
    color: Colors.highlight,
    textAlign: 'center',
  },
  btnContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  bgImg: {
    width: '100%',
    height: '100%',
    justifyContent: 'flex-end',
  },
  titleContainer: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingVertical: 5,
    paddingHorizontal: 12,
  },
  container: {
    overflow:
      Platform.OS === 'android' && Platform.Version >= 21
        ? 'hidden'
        : 'visible',
    flex: 1,
    height: 300,
    margin: 20,
    borderRadius: 20,
  },
})

export default Card
