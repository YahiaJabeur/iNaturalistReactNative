// @flow

import { useEffect, useState, useCallback } from "react";
import { Platform } from "react-native";
import CameraRoll from "@react-native-community/cameraroll";
import uuid from "react-native-uuid";

import { formatDateAndTime } from "../../../sharedHelpers/dateAndTime";
import hasAndroidPermission from "../helpers/hasAndroidPermission";

const initialStatus = {
  photos: [],
  lastCursor: null,
  lastAlbum: undefined,
  hasNextPage: true,
  fetchingPhotos: false
};

const usePhotos = ( options: Object, isScrolling: boolean ): Object => {
  const [photoFetchStatus, setPhotoFetchStatus] = useState( initialStatus );

  const fetchPhotos = useCallback( async ( ) => {
    const { lastCursor, photos, fetchingPhotos, hasNextPage } = photoFetchStatus;

    const mapPhotoUris = ( p ) => p.edges.map( ( { node } ) => {
      const latitude = node.location && node.location.latitude;
      const longitude = node.location && node.location.longitude;
      return {
        latitude,
        longitude,
        observed_on_string: formatDateAndTime( node.timestamp ),
        timestamp: node.timestamp,
        uri: node.image.uri,
        // adding a uuid here makes it easier to prevent duplicates in uploader
        uuid: uuid.v4( )
      };
    } );

    try {
      // keep track of the last photo fetched
      if ( lastCursor ) {
        options.after = lastCursor;
      }

      // don't fetch more photos in the middle of a fetch
      if ( fetchingPhotos || !hasNextPage ) { return; }
      setPhotoFetchStatus( {
        ...photoFetchStatus,
        fetchingPhotos: true
      } );
      const p = await CameraRoll.getPhotos( options );
      const endCursor = p.page_info.end_cursor;
      const nextPage = p.page_info.has_next_page;
      const uris = mapPhotoUris( p );

      // if ( !isCurrent ) { return; }
      setPhotoFetchStatus( {
        ...photoFetchStatus,
        lastCursor: endCursor,
        photos: photos.concat( uris ),
        hasNextPage: nextPage,
        fetchingPhotos: false
      } );
    } catch ( e ) {
      console.log( e, "couldn't get photos from gallery" );
    }
  }, [photoFetchStatus, options] );

  useEffect( ( ) => {
    const checkAndroidPermissions = async ( ) => {
      if ( Platform.OS === "android" && !( await hasAndroidPermission( ) ) ) {
        return;
      }
    };
    checkAndroidPermissions( );
  }, [] );

  useEffect( ( ) => {
    // this should happen anytime initial status set, like album change or initial load
    if ( photoFetchStatus.lastCursor === null ) {
      fetchPhotos( );
    }
  }, [photoFetchStatus.lastCursor, fetchPhotos] );

  useEffect( ( ) => {
    // this should happen when onEndReached is called from Photo Gallery screen
    if ( isScrolling ) {
      fetchPhotos( );
    }
  }, [isScrolling, fetchPhotos] );

  useEffect( ( ) => {
    const changedAlbum = ( ) => {
      if ( options.groupName ) {
        return photoFetchStatus.lastAlbum !== options.groupName;
      } else if ( !options.groupName && photoFetchStatus.lastAlbum ) {
        // switch back to all photos mode
        return true;
      }
      return false;
    };

    if ( changedAlbum( ) ) {
      // reset photo fetch with new album
      setPhotoFetchStatus( {
        ...initialStatus,
        lastAlbum: options.groupName || undefined
      } );
    }
  }, [photoFetchStatus, options] );

  return photoFetchStatus;
};

export default usePhotos;

