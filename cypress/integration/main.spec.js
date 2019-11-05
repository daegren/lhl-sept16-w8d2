/* eslint-env cypress, mocha */

context('Main Spec', () => {
  beforeEach(() => {
    cy.visit('http://localhost:8000/')
  })

  it('accepts some text to search for', () => {
    cy.server()

    cy.fixture('iTunes1.json').as('response')
    cy.route({
      method: 'GET',
      url: 'search*',
      delay: 500,
      response: '@response'
    }).as('getSearch')

    cy.get('.search__form')
      .find('input:first')
      .type('Daft Punk')
      .should('have.value', 'Daft Punk')
      .get('.spinner').as('spinner')
      .should('be.visible')

    cy.wait('@getSearch')
      .get('main')
      .contains('Homework')
      .should('be.visible')

    cy.get('@spinner')
      .should('not.be.visible')
  })

  it('toggles checkboxes', () => {
    cy.get('.filters__form')
      .find('.filters__checkbox[name="Explicit"]')
      .uncheck()
      .should('not.be.checked')

    cy.get('.filters__form')
      .contains('2000s')
      .parent()
      .find('input').as('foo')
      .uncheck()
      .should('not.be.checked')

    cy.get('@foo')
      .check()
      .should('be.checked')
  })

  it('searches for albums', () => {
    cy.get('.search__form')
      .find('input').first()
      .type('Daft Punk')
      .should('have.value', 'Daft Punk')

    cy.get('main')
      .find('.album')
      .should('have.length', 12)

    cy.get('#Explicit')
      .uncheck()

    cy.get('main')
      .find('.album')
      .should('have.length', 11)

    cy.get('main')
      .find('.album .album__info--explicit')
      .should('have.length', 0)
  })
})
