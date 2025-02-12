import { fireEvent, screen } from "@testing-library/react-native";
import About from "components/About";
import initI18next from "i18n/initI18next";
import React from "react";
import Mailer from "react-native-mail";

import { renderComponent } from "../../helpers/render";

jest.mock( "react-native-mail", ( ) => ( {
  mail: jest.fn( )
} ) );

describe( "email logs button", ( ) => {
  beforeAll( async ( ) => {
    await initI18next( );
  } );

  it( "should open the native email client", ( ) => {
    renderComponent( <About /> );
    const debugLogButton = screen.getByText( /EMAIL DEBUG LOGS/ );
    expect( debugLogButton ).toBeTruthy( );
    fireEvent.press( debugLogButton );
    expect( Mailer.mail ).toHaveBeenCalled( );
  } );
} );
