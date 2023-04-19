import React from 'react';
import { mount } from "cypress/react18";
import { Status } from '../../src/components/StatusBar/Status';

describe('Status Component', () => {
  it('renders success status', () => {
    const message = 'Success!';
    const type = 'success';
    mount(<Status type={type} message={message} />);
    cy.get('.bg-green-100').should('be.visible');
    cy.get('.text-green-700').should('have.text', message);
  });

  it('renders error status with messages', () => {
    const message = 'Oops, something went wrong';
    const messages = ['Error message 1', 'Error message 2'];
    const type = 'error';
    mount(<Status type={type} message={message} messages={messages} />);
    cy.get('.bg-red-100').should('be.visible');
  });

  it('does not render when type is nothing', () => {
    const message = 'Nothing to see here';
    const type = 'nothing';
    mount(<Status type={type} message={message} />);
    cy.get('div').should('not.be.visible');
  });
});