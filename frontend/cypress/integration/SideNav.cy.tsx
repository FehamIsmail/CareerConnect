import {mount} from "cypress/react18";
import { SideNav } from '../../src/pages/SideNav';
import {withProviders} from "../../src/scripts/utils";

describe('SideNav', () => {
  it('renders all links', () => {
    mount(withProviders(<SideNav />));

    // Check for account navigation links
    // @ts-ignore
    cy.findByText('Profile').should('exist');
    // @ts-ignore
    cy.findByText('Documents').should('not.exist'); // should not exist for employer user
    // @ts-ignore
    cy.findByText('Notifications').should('exist');

    // Check for job navigation links
    // @ts-ignore
    cy.findByText('Create Job').should('not.exist'); // should not exist for student user
    // @ts-ignore
    cy.findByText('Edit Jobs').should('not.exist'); // should not exist for student user
    // @ts-ignore
    cy.findByText('Applications').should('not.exist'); // should not exist for employer user
  });

  it('activates current link', () => {
    mount(withProviders(<SideNav />));

  });
});