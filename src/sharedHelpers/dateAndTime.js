import { formatISO, fromUnixTime, formatDistanceToNow, format, getUnixTime } from "date-fns";

// two options for observed_on_string in uploader are:
// 2020-03-01 00:00 or 2021-03-24T14:40:25
// this is using the second format
// https://github.com/inaturalist/inaturalist/blob/b12f16099fc8ad0c0961900d644507f6952bec66/spec/controllers/observation_controller_api_spec.rb#L161
const formatDateAndTime = timestamp => {
  const date = fromUnixTime( timestamp );
  const formattedISODate = formatISO( date );
  const stripTimeZone = formattedISODate.split( "-" ).slice( 0, -1 );
  return stripTimeZone.join( "-" );
};

const createObservedOnStringForUpload = ( date ) => formatDateAndTime( getUnixTime( date || new Date( ) ) );

const displayDateTimeObsEdit = ( date ) => format( new Date( date ), "PPpp" );

const timeAgo = pastTime => formatDistanceToNow( new Date( pastTime ) );

const formatObsListTime = ( date ) => format( date, "M/d/yy HH:mm a" );

const formatCameraDate = ( date ) => {
  const splitDateAndTime = date.split( " " );
  const day = splitDateAndTime[0].replaceAll( ":", "-" );
  const formattedDate = day + "T" + splitDateAndTime[1];
  return formattedDate;
};

export {
  formatDateAndTime,
  timeAgo,
  formatObsListTime,
  formatCameraDate,
  createObservedOnStringForUpload,
  displayDateTimeObsEdit
};