// @flow

import { utcToZonedTime } from "date-fns-tz";
import { readExif } from "react-native-exif-reader";
import * as RNLocalize from "react-native-localize";
import { formatISONoTimezone } from "sharedHelpers/dateAndTime";

class UsePhotoExifDateFormatError extends Error {}

// https://wbinnssmith.com/blog/subclassing-error-in-modern-javascript/
Object.defineProperty( UsePhotoExifDateFormatError.prototype, "name", {
  value: "UsePhotoExifDateFormatError"
} );

// Parses EXIF date time into a date object
export const parseExifDateToLocalTimezone = ( datetime: string ): ?Date => {
  if ( !datetime ) return null;

  const isoDate = `${datetime}Z`;

  // Use local timezone from device
  const timeZone = RNLocalize.getTimeZone( );
  const zonedDate = utcToZonedTime( isoDate, timeZone );

  if ( !zonedDate || zonedDate.toString( ).match( /invalid/i ) ) {
    throw new UsePhotoExifDateFormatError( "Date was not formatted correctly" );
  }

  return zonedDate;
};

// Parses EXIF date time into a date object
export const parseExif = async ( photoUri: ?string ): Promise<Object> => {
  try {
    return await readExif( photoUri );
  } catch ( e ) {
    console.error( e, "Couldn't parse EXIF" );
    return null;
  }
};

export const formatExifDateAsString = ( datetime: string ): string => {
  const zonedDate = parseExifDateToLocalTimezone( datetime );
  // this returns a string, in the same format as photos which fall back to the
  // photo timestamp instead of exif data
  return formatISONoTimezone( zonedDate );
};
