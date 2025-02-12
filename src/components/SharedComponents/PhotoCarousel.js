// @flow

import classnames from "classnames";
import { ImageBackground, Pressable, View } from "components/styledComponents";
import type { Node } from "react";
import React, {
  useEffect, useState
} from "react";
import {
  ActivityIndicator,
  FlatList
} from "react-native";
import DeviceInfo from "react-native-device-info";
import LinearGradient from "react-native-linear-gradient";
import Modal from "react-native-modal";
import { IconButton, useTheme } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialIcons";
import colors from "styles/tailwindColors";

type Props = {
  emptyComponent?: Function,
  photoUris: Array<string>,
  setSelectedPhotoIndex?: Function,
  selectedPhotoIndex?: number,
  containerStyle?: string,
  savingPhoto?: boolean,
  handleAddEvidence?: Function,
  showAddButton?: boolean,
  deviceOrientation?: string,
  deletePhoto?: Function
}

const PhotoCarousel = ( {
  photoUris,
  emptyComponent,
  setSelectedPhotoIndex,
  selectedPhotoIndex,
  containerStyle,
  savingPhoto,
  handleAddEvidence,
  showAddButton = false,
  deviceOrientation,
  deletePhoto
}: Props ): Node => {
  const theme = useTheme( );
  const [deletePhotoMode, setDeletePhotoMode] = useState( false );
  const imageClass = "h-16 w-16 justify-center mx-1.5 rounded-lg";
  const isTablet = DeviceInfo.isTablet();

  useEffect( () => {
    if ( photoUris.length === 0 && deletePhotoMode ) {
      setDeletePhotoMode( false );
    }
  }, [photoUris.length, deletePhotoMode] );

  const renderSkeleton = ( ) => ( savingPhoto ? (
    <View className={`${imageClass} bg-midGray mt-12`}>
      <ActivityIndicator />
    </View>
  ) : null );

  const renderPhotoOrEvidenceButton = ( { item, index } ) => {
    if ( index === photoUris.length ) {
      return (
        <Pressable
          onPress={handleAddEvidence}
          className={`${imageClass} border border-midGray items-center justify-center mt-6`}
        >
          <Icon name="add" size={40} color={colors.logInGray} />
        </Pressable>
      );
    }

    return (
      <>
        <Pressable
          onLongPress={( ) => {
            if ( deletePhoto ) {
              setDeletePhotoMode( mode => !mode );
            }
          }}
          onPress={( ) => {
            if ( deletePhotoMode && deletePhoto ) {
              deletePhoto( item );
            } else if ( setSelectedPhotoIndex ) {
              setSelectedPhotoIndex( index );
            }
          }}
          className={classnames( imageClass, {
            "mt-12": containerStyle === "camera",
            "mt-6": containerStyle !== "camera",
            "border border-selectionGreen border-4":
              selectedPhotoIndex === index
          } )}
        >
          <View className="rounded-lg overflow-hidden">
            <ImageBackground
              source={{ uri: item }}
              testID="ObsEdit.photo"
              className={classnames( "w-fit h-full flex items-center justify-center", {
                "rotate-0": deviceOrientation === "portrait" && !isTablet,
                "-rotate-90": deviceOrientation === "landscapeLeft" && !isTablet,
                "rotate-90": deviceOrientation === "landscapeRight" && !isTablet
              } )}
            >
              {deletePhotoMode && (
              <LinearGradient
                className="bg-transparent absolute inset-0"
                colors={["rgba(0, 0, 0, 0.5)", "rgba(0, 0, 0, 0.5)"]}
              />
              )}
              {( containerStyle === "camera" && deletePhotoMode ) && (
                <IconButton
                  icon="trash-can"
                  mode="contained-tonal"
                  iconColor={theme.colors.onPrimary}
                  containerColor="rgba(0, 0, 0, 0.5)"
                  size={30}
                />
              )}
            </ImageBackground>
          </View>
        </Pressable>
        {index === photoUris.length - 1 && renderSkeleton( )}
      </>
    );
  };

  const data = [...photoUris];
  if ( showAddButton ) data.push( "add" );

  const photoPreviewsList = (
    <FlatList
      data={data}
      renderItem={renderPhotoOrEvidenceButton}
      horizontal
      ListEmptyComponent={savingPhoto ? renderSkeleton( ) : emptyComponent}
    />
  );

  return deletePhotoMode ? (
    <Modal
      visible
      onBackdropPress={() => setDeletePhotoMode( false )}
      backdropOpacity={0}
      // eslint-disable-next-line react-native/no-inline-styles
      style={{ margin: 0 }}
    >
      <View className="absolute top-0">
        {photoPreviewsList}
      </View>
    </Modal>
  ) : photoPreviewsList;
};

export default PhotoCarousel;
