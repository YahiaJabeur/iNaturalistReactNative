import Comment from "./Comment";
import Identification from "./Identification";
import ObservationPhoto from "./ObservationPhoto";
import Taxon from "./Taxon";
import User from "./User";

import { getUTCDate } from "../sharedHelpers/dateAndTime";

class Observation {
  static mimicRealmMappedPropertiesSchema( obs ) {
    const createLinkedObjects = ( list, createFunction ) => {
      if ( list.length === 0 ) { return; }
      return list.map( item => {
        if ( createFunction === Identification ) {
          // this one requires special treatment for appending taxon objects
          return createFunction.mimicRealmMappedPropertiesSchema( item );
        }
        return createFunction.mapApiToRealm( item );
      } );
    };

    const taxon = obs.taxon ? Taxon.mimicRealmMappedPropertiesSchema( obs.taxon ) : null;
    const observationPhotos = createLinkedObjects( obs.observation_photos, ObservationPhoto );
    const comments = createLinkedObjects( obs.comments, Comment );
    const identifications = createLinkedObjects( obs.identifications, Identification );
    const user = User.mapApiToRealm( obs.user );

    return {
      ...obs,
      comments: comments || [],
      createdAt: obs.created_at,
      identifications: identifications || [],
      latitude: obs.geojson ? obs.geojson.coordinates[1] : null,
      longitude: obs.geojson ? obs.geojson.coordinates[0] : null,
      observationPhotos,
      placeGuess: obs.place_guess,
      qualityGrade: obs.quality_grade,
      taxon,
      timeObservedAt: obs.time_observed_at,
      user
    };
  }

  static createLinkedObjects = ( list, createFunction, realm ) => {
    if ( list.length === 0 ) { return; }
    return list.map( item => {
      return createFunction.mapApiToRealm( item, realm );
    } );
  };

  static createObservationForRealm( obs, realm ) {
    const taxon = obs.taxon ? Taxon.mapApiToRealm( obs.taxon, realm ) : null;
    const observationPhotos = Observation.createLinkedObjects( obs.observation_photos, ObservationPhoto, realm );
    const comments = Observation.createLinkedObjects( obs.comments, Comment, realm );
    const identifications = Observation.createLinkedObjects( obs.identifications, Identification, realm );
    const user = User.mapApiToRealm( obs.user );

    const newObs = {
      ...obs,
      comments,
      identifications,
      // obs detail on web says geojson coords are preferred over lat/long
      // https://github.com/inaturalist/inaturalist/blob/df6572008f60845b8ef5972a92a9afbde6f67829/app/webpack/observations/show/ducks/observation.js#L145
      latitude: obs.geojson && obs.geojson.coordinates && obs.geojson.coordinates[1],
      longitude: obs.geojson && obs.geojson.coordinates && obs.geojson.coordinates[0],
      observationPhotos,
      taxon,
      user
    };
    return newObs;
  }

  static saveLocalObservationForUpload( obs, realm ) {
    const taxon = obs.taxon_id ? Taxon.mapApiToRealm( { id: obs.taxon_id }, realm ) : null;
    const observationPhotos = obs.observationPhotos.map( photo => ObservationPhoto.saveLocalObservationPhotoForUpload( photo ) );

    const newObs = {
      ...obs,
      taxon,
      observationPhotos,
      timeSynced: null,
      timeUpdatedLocally: getUTCDate( new Date( ), obs.time_zone )
    };
    return newObs;
  }

  static mapObservationForUpload( obs ) {
    return {
      species_guess: obs.species_guess,
      description: obs.description,
      observed_on_string: obs.observed_on_string,
      place_guess: obs.place_guess,
      latitude: obs.latitude,
      longitude: obs.longitude,
      positional_accuracy: obs.positional_accuracy,
      taxon_id: obs.taxon && obs.taxon.id,
      geoprivacy: obs.geoprivacy,
      uuid: obs.uuid,
      captive_flag: obs.captive_flag,
      owners_identification_from_vision_requested: obs.owners_identification_from_vision_requested
    };
  }

  // TODO: swap this and realm schema to use observation_photos everywhere, if possible
  // so there's no need for projectUri
  static uri = ( obs, medium ) => {
    let photoUri;
    if ( obs && obs.observationPhotos && obs.observationPhotos[0] ) {
      if ( medium ) {
        // need medium size for GridView component
        photoUri = obs.observationPhotos[0].photo.url.replace( "square", "medium" );
      } else {
        photoUri = ( obs.observationPhotos[0].photo && obs.observationPhotos[0].photo.url )
          ? obs.observationPhotos[0].photo.url
          : null;
      }
    }
    return { uri: photoUri };
  }

  static projectUri = obs => {
    const photo = obs.observation_photos[0];
    if ( !photo ) { return; }
    if ( !photo.photo ) { return; }
    if ( !photo.photo.url ) { return; }

    return { uri: obs.observation_photos[0].photo.url };
  }

  static mediumUri = obs => {
    const photo = obs.observation_photos[0];
    if ( !photo ) { return; }
    if ( !photo.photo ) { return; }
    if ( !photo.photo.url ) { return; }

    const mediumUri = obs.observation_photos[0].photo.url.replace( "square", "medium" );

    return { uri: mediumUri };
  }

  static schema = {
    name: "Observation",
    primaryKey: "uuid",
    properties: {
      uuid: "string",
      captive_flag: "bool?",
      comments: "Comment[]",
      created_at: { type: "string?", mapTo: "createdAt" },
      description: "string?",
      geoprivacy: "string?",
      id: "int?",
      identifications: "Identification[]",
      latitude: "double?",
      longitude: "double?",
      observationPhotos: "ObservationPhoto[]",
      observationSounds: "ObservationSound[]",
      observed_on_string: "string?",
      owners_identification_from_vision_requested: "bool?",
      species_guess: "string?",
      place_guess: { type: "string?", mapTo: "placeGuess" },
      positional_accuracy: "double?",
      quality_grade: { type: "string?", mapTo: "qualityGrade" },
      taxon: "Taxon?",
      time_observed_at: { type: "string?", mapTo: "timeObservedAt" },
      time_zone: "string?",
      timeSynced: "date?",
      timeUpdatedLocally: "date?",
      user: "User?"

      // need project ids, but skipping this for now
      // to get rest of upload working
      // project_ids
      // note that taxon_id is nested under Taxon
    }
  }
}

export default Observation;
