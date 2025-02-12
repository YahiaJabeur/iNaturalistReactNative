import factory, { define } from "factoria";

export default define( "LocalObservation", faker => ( {
  _synced_at: faker.date.past( ),
  _created_at: faker.date.past( ),
  uuid: faker.datatype.uuid( ),
  comments: [
    factory( "LocalComment" ),
    factory( "LocalComment" ),
    factory( "LocalComment" )
  ],
  identifications: [
    factory( "LocalIdentification" )
  ],
  observationPhotos: [
    factory( "LocalObservationPhoto" )
  ],
  placeGuess: "SF",
  taxon: factory( "LocalTaxon" ),
  user: factory( "LocalUser" ),
  qualityGrade: "research",
  latitude: Number( faker.address.latitude( ) ),
  longitude: Number( faker.address.longitude( ) ),
  description: faker.lorem.paragraph( ),
  // is this the right way to test this?
  needsSync: jest.fn( ),
  observed_on_string: "2022-12-03T11:14:16"
} ) );
