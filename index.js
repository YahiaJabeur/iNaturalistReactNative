// @flow

import "react-native-gesture-handler";
import "./src/i18n";

import { configure, getStorybookUI } from "@storybook/react-native";
import inatjs from "inaturalistjs";
import { AppRegistry } from "react-native";
import Config from "react-native-config";
import { startNetworkLogging } from "react-native-network-logger";

import { name as appName } from "./app.json";
// import App from "./src/navigation/rootNavigation";

startNetworkLogging();

configure( () => {
  require( "./src/stories.js" ); // we will create this file in the next steps
}, module );

// maybe there's a way to conditionally render using storybook:
// https://github.com/storybookjs/react-native/issues/147#issuecomment-809431240
const StorybookUIRoot = getStorybookUI( {
  asyncStorage: null
} );

// Configure inatjs to use the chosen URLs
inatjs.setConfig( {
  apiURL: Config.API_URL,
  writeApiURL: Config.API_URL
} );

AppRegistry.registerComponent( appName, ( ) => StorybookUIRoot );
