import { LandingPage } from '../../src/pages/LandingPage'
import {withProviders} from "../../src/scripts/utils";

describe('<LandingPage />', () => {
  it('renders', () => {
    // see: https://on.cypress.io/mounting-react
    // @ts-ignore
    cy.mount(withProviders(<LandingPage />))
  })
})