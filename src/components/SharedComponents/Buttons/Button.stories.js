import { storiesOf } from "@storybook/react-native";
import React from "react";
import { Text } from "react-native-paper";

// I import my component here
import Button from "./Button";

// here I define that I want to create stories with the label "Buttons",
// this will be the name in the storybook navigation

const buttonStories = storiesOf( "Button", module );

// then I add a story with the name default view, I can add multiple stories to button stories
buttonStories
  .add( "primary", () => (
    <Button onPress={() => null} text="Log In" level="primary">
      {/* eslint-disable-next-line i18next/no-literal-string */}
      <Text>Log In</Text>
    </Button>
  ) )
  .add( "warning", () => (
    <Button onPress={() => null} text="Log In" level="warning">
      {/* eslint-disable-next-line i18next/no-literal-string */}
      <Text>Log In</Text>
    </Button>
  ) )
  .add( "neutral", () => (
    <Button onPress={() => null} text="Log In" />
  ) );
