describe('Order Creation', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/api/ingredients', {
      fixture: 'ingredients.json'
    }).as('getIngredients');
    cy.intercept('GET', '**/api/auth/user', { fixture: 'user.json' });
    cy.intercept('POST', '**/api/orders', { fixture: 'order.json' }).as(
      'createOrder'
    );
    cy.setCookie('accessToken', 'Bearer mocktoken');
    cy.visit('/');
    cy.wait('@getIngredients');
  });

  afterEach(() => {
    // Очистка localStorage
    cy.clearLocalStorage();
    // Очистка cookie
    cy.clearCookies();
  });

  it('should create an order and reset constructor', () => {
    // Добавляем булку
    cy.contains('Краторная булка N-200i')
      .closest('[data-cy="ingredient-card"]')
      .find('[data-cy="add-ingredient"]')
      .click();

    // Добавляем начинку
    cy.contains('Соус Spicy-X')
      .closest('[data-cy="ingredient-card"]')
      .find('[data-cy="add-ingredient"]')
      .click();

    // Проверяем что конструктор заполнен
    cy.get('[data-cy="bun-top-container"]').should('exist');
    cy.get('[data-cy="constructor-item"]').should('have.length', 1);

    // Отправляем заказ
    cy.get('[data-cy="order-button"]').should('not.be.disabled').click();

    // Ждем ответа и проверяем модалку
    cy.wait('@createOrder');
    cy.get('[data-cy="modal"]').should('be.visible');

    // Закрываем модалку
    cy.get('[data-cy="modal-close"]').click();
    cy.get('[data-cy="modal"]').should('not.exist');

    // Проверяем сброс конструктора
    cy.get('[data-cy="constructor-item"]').should('have.length', 0);
    cy.get('[data-cy="bun-top-container"]').should('not.exist');
  });
});
