import { Realm } from "@realm/react";

class Application extends Realm.Object {
  static APPLICATION_FIELDS = {
    name: true
  };

  static mapApiToRealm( application ) {
    return application;
  }

  static schema = {
    name: "Application",
    properties: {
      name: "string?",
      // this creates an inverse relationship so applications
      // automatically keep track of which Observation they are assigned to
      assignee: {
        type: "linkingObjects",
        objectType: "Observation",
        property: "application"
      }
    }
  }
}

export default Application;
