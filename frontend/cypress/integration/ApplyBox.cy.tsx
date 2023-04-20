import { ApplyBox } from '../../src/components/ApplyBox/ApplyBox'
import {withProviders} from "../../src/scripts/utils";

describe('<ApplyBox />', () => {
  it('renders', () => {
    // see: https://on.cypress.io/mounting-react
    // @ts-ignore
    cy.mount(withProviders(<ApplyBox />))
  })
})