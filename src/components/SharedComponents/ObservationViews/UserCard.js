// @flow

import { useNavigation } from "@react-navigation/native";
import { fetchRemoteUser } from "api/users";
import TranslatedText from "components/SharedComponents/TranslatedText";
import UserIcon from "components/SharedComponents/UserIcon";
import type { Node } from "react";
import React from "react";
import { Pressable, Text, View } from "react-native";
import IconMaterial from "react-native-vector-icons/MaterialIcons";
import useAuthenticatedQuery from "sharedHooks/useAuthenticatedQuery";
import useCurrentUser from "sharedHooks/useCurrentUser";
import colors from "styles/colors";
import { textStyles, viewStyles } from "styles/observations/userCard";

import User from "../../../models/User";

const UserCard = ( ): Node => {
  const user = useCurrentUser( );
  const userId = user?.id;

  const {
    data: remoteUser
  } = useAuthenticatedQuery(
    ["fetchRemoteUser", userId],
    optsWithAuth => fetchRemoteUser( userId, { }, optsWithAuth )
  );

  // TODO: this currently doesn't show up on initial login
  // because user id can't be fetched
  const navigation = useNavigation( );
  if ( !user ) { return <View style={viewStyles.topCard} />; }
  const navToUserProfile = ( ) => navigation.navigate( "UserProfile", { userId: user.id } );

  return (
    <View style={viewStyles.userCard}>
      <UserIcon uri={{ uri: remoteUser?.icon_url }} large />
      <View style={viewStyles.userDetails}>
        <Text style={textStyles.text}>{User.userHandle( user )}</Text>
        <TranslatedText
          style={textStyles.text}
          text="X-Observations"
          count={user.observations_count || 0}
        />
      </View>
      <Pressable
        onPress={navToUserProfile}
        style={viewStyles.editProfile}
      >
        <IconMaterial name="edit" size={30} color={colors.white} />
      </Pressable>
    </View>
  );
};

export default UserCard;
