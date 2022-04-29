// @flow strict-local

import { StyleSheet } from "react-native";

import type { TextStyleProp, ImageStyleProp, ViewStyleProp } from "react-native/Libraries/StyleSheet/StyleSheet";
import { colors } from "../global";

const textStyles: { [string]: TextStyleProp } = StyleSheet.create( {

} );

const imageStyles: { [string]: ImageStyleProp } = StyleSheet.create( {

} );

const viewStyles: { [string]: ViewStyleProp } = StyleSheet.create( {
  container: {
    padding: 24
  },
  contentContainer: {
    alignItems: "center"
  }
} );

export {
  textStyles,
  imageStyles,
  viewStyles
};
