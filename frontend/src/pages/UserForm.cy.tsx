import React from 'react'
import UserForm from './UserForm'
import { mount } from "cypress/react18";
import {withProviders} from "../scripts/utils";

describe('<UserForm />', () => {
  it('renders', () => {
    // see: https://on.cypress.io/mounting-react
    mount(withProviders(<UserForm />))
  })
})