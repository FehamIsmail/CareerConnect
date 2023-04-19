import UserForm from '../../src/pages/UserForm'
import { mount } from "cypress/react18";
import {withProviders} from "../../src/scripts/utils";

describe('<UserForm />', () => {
  it('renders', () => {
    // see: https://on.cypress.io/mounting-react
    mount(withProviders(<UserForm />))
  })
})