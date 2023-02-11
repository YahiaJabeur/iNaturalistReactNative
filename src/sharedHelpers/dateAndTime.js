import {
  differenceInDays, differenceInHours, differenceInMinutes,
  format, formatDistanceToNow, formatISO, fromUnixTime, getUnixTime, getYear, parseISO
} from "date-fns";

const formatISONoTimezone = date => {
  const formattedISODate = formatISO( date );
  // Always take the first part of the time/date string,
  // without any extra timezone, etc (just "2022-12-31T23:59:59")
  return formattedISODate.substring( 0, 19 );
};

// two options for observed_on_string in uploader are:
// 2020-03-01 00:00 or 2021-03-24T14:40:25
// this is using the second format
// https://github.com/inaturalist/inaturalist/blob/b12f16099fc8ad0c0961900d644507f6952bec66/spec/controllers/observation_controller_api_spec.rb#L161
const formatDateStringFromTimestamp = timestamp => {
  const date = fromUnixTime( timestamp );
  return formatISONoTimezone( date );
};

const createObservedOnStringForUpload = date => formatDateStringFromTimestamp(
  getUnixTime( date || new Date( ) )
);

const displayDateTimeObsEdit = date => date && format( new Date( date ), "PPpp" );

const timeAgo = pastTime => formatDistanceToNow( new Date( pastTime ) );

const formatObsListTime = date => {
  const dateTime = "M/d/yy h:mm a";
  if ( typeof date === "string" ) {
    return format( parseISO( date ), dateTime );
  }
  return format( date, dateTime );
};

const formatIdDate = ( date, t ) => {
  const d = typeof date === "string" ? parseISO( date ) : new Date( date );
  const now = new Date();

  const days = differenceInDays( now, d );

  if ( days <= 30 ) {
    // Less than 30 days ago - display as 3m (mins), 3h (hours), 3d (days) or 3w (weeks)
    if ( days < 1 ) {
      const hours = differenceInHours( now, d );
      if ( hours < 1 ) {
        const minutes = differenceInMinutes( now, d );
        return t( "Date-minutes", { count: minutes } );
      }
      return t( "Date-hours", { count: hours } );
    } if ( days < 7 ) {
      return t( "Date-days", { count: days } );
    }
    return t( "Date-weeks", { count: parseInt( days / 7, 10 ) } );
  }
  let dateFormatString;
  if ( getYear( now ) !== getYear( d ) ) {
    // Previous year(s)
    dateFormatString = "Date-short-format";
  } else {
    // Current year
    dateFormatString = "Date-this-year";
  }

  return format( d, t( dateFormatString ) );
};

export {
  createObservedOnStringForUpload,
  displayDateTimeObsEdit,
  formatDateStringFromTimestamp,
  formatIdDate,
  formatISONoTimezone,
  formatObsListTime,
  timeAgo
};
