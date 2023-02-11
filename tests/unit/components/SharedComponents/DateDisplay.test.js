import { screen } from "@testing-library/react-native";
import { DateDisplay } from "components/SharedComponents";
import React from "react";

import { renderComponent } from "../../../helpers/render";

describe( "DateDisplay", () => {
  it( "should be accessible", () => {
    expect( <DateDisplay dateTime="2023-12-14T21:07:41-09:30" /> ).toBeAccessible( );
  } );

  it( "should format datetime correctly from date string", () => {
    renderComponent( <DateDisplay dateTime="2023-12-14T21:07:41-09:30" /> );
    expect( screen.getByText( "12/15/23 6:37 AM" ) ).toBeTruthy( );
  } );

  it( "should format datetime correctly from date string", () => {
    renderComponent( <DateDisplay dateTime="2023-01-02T21:09:41-23:30" /> );
    expect( screen.getByText( "1/3/23 8:39 PM" ) ).toBeTruthy( );
  } );

  it( "should display placeholder if no dateTime", () => {
    renderComponent( <DateDisplay dateTime={undefined} /> );
    expect( screen.getByText( "no time given" ) ).toBeTruthy( );
  } );
} );
