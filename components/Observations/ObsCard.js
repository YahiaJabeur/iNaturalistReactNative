// @flow strict-local

import React from "react";
import { Pressable, Text, View, Image } from "react-native";
import type { Node } from "react";

import { viewStyles, textStyles } from "../../styles/observations/obsCard";

type Props = {
  item: {
    uuid: string,
    userPhoto: string,
    commonName: string,
    location: string,
    timeObservedAt: string,
    identifications: number,
    comments: number,
    qualityGrade: string
  }
}

const ObsCard = ( { item }: Props ): Node => {
  const handlePress = ( ) => console.log( "obs card was pressed" );

  return (
    <Pressable
      onPress={handlePress}
      style={viewStyles.row}
    >
      <Image source={{ uri: item.userPhoto }} style={viewStyles.imageBackground} />
      <View style={viewStyles.obsDetailsColumn}>
        <Text style={textStyles.text}>{item.commonName}</Text>
        <Text style={textStyles.text}>{item.location}</Text>
        <Text style={textStyles.text}>{item.timeObservedAt}</Text>
      </View>
      <View>
        <Text style={textStyles.text}>{item.identifications}</Text>
        <Text style={textStyles.text}>{item.comments}</Text>
        <Text style={textStyles.text}>{item.qualityGrade}</Text>
      </View>
    </Pressable>
  );
};

export default ObsCard;