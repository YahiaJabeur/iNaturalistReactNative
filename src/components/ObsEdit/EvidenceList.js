// @flow

import React from "react";
import { FlatList, Image, View, Pressable, Text } from "react-native";
import type { Node } from "react";

import { imageStyles, viewStyles, textStyles } from "../../styles/obsEdit/obsEdit";
// import CameraOptionsButton from "../SharedComponents/Buttons/CameraOptionsButton";
// import AddMediaSheet from "./AddMediaSheet";

type Props = {
  currentObs: Object,
  openAddMediaSheet?: Function,
  setSelectedPhoto?: Function,
  selectedPhoto?: number
}

const EvidenceList = ( { currentObs, openAddMediaSheet, setSelectedPhoto, selectedPhoto }: Props ): Node => {
  const renderCameraOptionsButton =  ( ) => openAddMediaSheet ? (
    <Pressable
      onPress={openAddMediaSheet}
      style={viewStyles.evidenceButton}
    >
      <Text style={textStyles.center}>tap to show media</Text>
    </Pressable>
  ) : <View />;

  const renderEvidence = ( { item, index } ) => {
    const isSound = item.uri.includes( "m4a" );
    const imageUri = { uri: item.uri };

    const handlePress = ( ) => {
      if ( setSelectedPhoto ) {
        setSelectedPhoto( index );
      }
      return;
    };

    return (
      <Pressable
        disabled={!setSelectedPhoto}
        onPress={handlePress}
      >
        <Image
          source={imageUri}
          style={[
            imageStyles.obsPhoto,
            isSound && viewStyles.soundButton,
            selectedPhoto === index && viewStyles.greenSelectionBorder
          ]}
          testID="ObsEdit.photo"
        />
      </Pressable>
    );
  };

  const displayEvidence = ( ) => {
    let evidence = [];

    if ( currentObs.observationPhotos ) {
      evidence = evidence.concat( currentObs.observationPhotos );
    }
    if ( currentObs.observationSounds ) {
      evidence = evidence.concat( [currentObs.observationSounds] );
    }
    return evidence;
  };

  return (
    <FlatList
      data={displayEvidence( )}
      horizontal
      renderItem={renderEvidence}
      ListFooterComponent={renderCameraOptionsButton}
      contentContainerStyle={viewStyles.evidenceList}
    />
  );
};

export default EvidenceList;
