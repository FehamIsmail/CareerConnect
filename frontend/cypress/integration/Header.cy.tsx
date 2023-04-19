import Header from '../../src/components/Header/Header'
import {withProviders} from "../../src/scripts/utils";

describe('<Header />', () => {
  it('renders', () => {
    // see: https://on.cypress.io/mounting-react
    // @ts-ignore
    cy.mount(withProviders(<Header />))
  })
})