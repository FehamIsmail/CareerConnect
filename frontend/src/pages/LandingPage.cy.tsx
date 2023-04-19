import React from 'react'
import { LandingPage } from './LandingPage'
import {withProviders} from "../scripts/utils";

describe('<LandingPage />', () => {
  it('renders', () => {
    // see: https://on.cypress.io/mounting-react
    // @ts-ignore
    cy.mount(withProviders(<LandingPage />))
  })
})