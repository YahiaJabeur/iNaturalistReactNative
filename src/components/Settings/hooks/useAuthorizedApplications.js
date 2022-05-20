import inatjs from "inaturalistjs";
import { useEffect, useState } from "react";

const useAuthorizedApplications = ( accessToken: string ): Array<Object> => {
  const [searchResults, setSearchResults] = useState( [] );

  useEffect( () => {
    let isCurrent = true;
    const fetchSearchResults = async () => {
      try {
        const response = await inatjs.authorized_applications.search(
          { fields: "application.official,application.name,created_at" },
          { api_token: accessToken }
        );
        const results = response.results;
        if ( !isCurrent ) {
          return;
        }
        setSearchResults( results );
      } catch ( e ) {
        if ( !isCurrent ) {
          return;
        }
        console.log( "Couldn't fetch search results:", e.message );
      }
    };

    // don't bother to fetch search results if there isn't a query
    if ( !accessToken ) {
      return;
    }
    fetchSearchResults();
    return () => {
      isCurrent = false;
    };
  }, [accessToken] );

  return searchResults;
};

export default useAuthorizedApplications;