import { Applicant } from '../../src/components/Candidate/Applicant';
import {mount} from "cypress/react18";

describe('Applicant', () => {
  beforeEach(() => {
    const applicant = {
      id: "123123123",
      name: 'John Doe',
      email: 'john.doe@example.com',
      applied_date: new Date(),
      status: 'APPLIED',
      profile_picture: 'https://fastly.picsum.photos/id/23/200/300.jpg?hmac=NFze_vylqSEkX21kuRKSe8pp6Em-4ETfOE-oyLVCvJo',
    };
    mount(<Applicant applicant={applicant} />);
  });

  it('should render applicant name', () => {
    cy.get('.truncate.text-sm.font-medium.text-indigo-600').should(
        'contain',
        'John Doe'
    );
  });

  it('should render applicant email', () => {
    cy.get('.truncate').should('contain', 'john.doe@example.com');
  });

  it('should render applicant applied date', () => {
    cy.get('time').should('have.attr', 'datetime');
  });

  it('should render applicant status icon', () => {
    cy.get('.h-5.w-5.flex-shrink-0').should('exist');
  });

  it('should render applicant status text', () => {
    cy.get('.text-sm.text-gray-500').should('contain', 'APPLIED');
  });
});