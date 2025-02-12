import { CameraRoll } from "@react-native-camera-roll/camera-roll";
import {
  fireEvent,
  screen
} from "@testing-library/react-native";
import PhotoGallery from "components/PhotoImporter/PhotoGallery";
import ObsEditProvider from "providers/ObsEditProvider";
import React from "react";

import factory from "../factory";
import { renderComponent } from "../helpers/render";
import { signIn, signOut } from "../helpers/user";

beforeEach( signOut );

afterEach( ( ) => {
  jest.clearAllMocks( );
} );

// This tests both the PhotoGallery component *and* the ObsEditProvider
test( "shows a selected checkmark when a photo is tapped", async ( ) => {
  signIn( factory( "LocalUser" ) );
  const photo = factory( "DevicePhoto" );
  // Mock CameraRoll.getPhotos so it returns our test photo
  CameraRoll.getPhotos.mockImplementation( ( ) => ( {
    page_info: {
      end_cursor: jest.fn( ),
      has_next_page: false
    },
    edges: [{ node: photo }]
  } ) );
  renderComponent(
    <ObsEditProvider>
      <PhotoGallery />
    </ObsEditProvider>
  );
  const renderedPhoto = await screen.findByTestId( `PhotoGallery.${photo.image.uri}` );
  expect( screen.queryByTestId( `PhotoGallery.selected.${photo.image.uri}` ) ).toBeFalsy( );
  fireEvent.press( renderedPhoto );
  expect( await screen.findByTestId( `PhotoGallery.selected.${photo.image.uri}` ) ).toBeTruthy( );
} );
