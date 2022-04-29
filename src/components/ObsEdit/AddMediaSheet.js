// @flow

import React, { useCallback, useEffect, useMemo, useRef } from "react";
import { View, Text, Button } from "react-native";
import type { Node } from "react";
import {
  BottomSheetModal,
  BottomSheetModalProvider
} from "@gorhom/bottom-sheet";

import { viewStyles } from "../../styles/obsEdit/addMediaSheet";

const AddMediaSheet = ( ): Node => {
  // ref
  const bottomSheetModalRef = useRef( null );
  // variables
  const snapPoints = useMemo( () => ["25%", "50%"], [] );

  // callbacks
  const handlePresentModalPress = useCallback( () => {
    bottomSheetModalRef.current?.present();
  }, [] );
  const handleSheetChanges = useCallback( ( index: number ) => {
    console.log( "handleSheetChanges", index );
  }, [] );

  useEffect( ( ) => {
    bottomSheetModalRef.current?.present( );
  }, [] );

  return (
    <BottomSheetModalProvider>
      <View style={viewStyles.container}>
        <BottomSheetModal
          ref={bottomSheetModalRef}
          index={1}
          snapPoints={snapPoints}
          onChange={handleSheetChanges}
        >
          <View style={viewStyles.contentContainer}>
            <Text>Awesome 🎉</Text>
          </View>
        </BottomSheetModal>
      </View>
    </BottomSheetModalProvider>
  );
};

export default AddMediaSheet;
