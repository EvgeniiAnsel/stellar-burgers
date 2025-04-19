describe('Burger Constructor', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/ingredients', { fixture: 'ingredients.json' }).as(
      'getIngredients'
    );
    cy.visit('/');
    cy.wait('@getIngredients');
    cy.get('[data-cy="ingredient-card"]').should('have.length.greaterThan', 0);
  });

  it('add bun and ingredient to constructor', () => {
    cy.contains('Краторная булка N-200i')
      .closest('[data-cy="ingredient-card"]')
      .find('[data-cy="add-ingredient"]')
      .click();

    cy.contains('Соус Spicy-X')
      .closest('[data-cy="ingredient-card"]')
      .find('[data-cy="add-ingredient"]')
      .click();

    cy.get('[data-cy="bun-top-container"]').should('exist');
    cy.get('[data-cy="bun-bottom-container"]').should('exist');
    cy.get('[data-cy="constructor-item"]').should('have.length', 1);
  });
});
