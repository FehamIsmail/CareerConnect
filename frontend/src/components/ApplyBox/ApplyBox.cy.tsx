import React from 'react'
import { ApplyBox } from './ApplyBox'
import {withProviders} from "../../scripts/utils";

describe('<ApplyBox />', () => {
  it('renders', () => {
    // see: https://on.cypress.io/mounting-react
    // @ts-ignore
    cy.mount(withProviders(<ApplyBox />))
  })
})