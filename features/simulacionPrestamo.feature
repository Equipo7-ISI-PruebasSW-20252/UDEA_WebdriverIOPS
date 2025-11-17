Feature: Loan Request - Solicitud de préstamos
  Como usuario autenticado
  Quiero solicitar un préstamo
  Para obtener financiamiento

  Background:
    Given I am logged in with john and demo
    And I am on the loanRequest page

  @loan-request @happy-path
  Scenario Outline: Solicitar préstamo con diferentes montos
    When I fill in loan amount with "<loanAmount>"
    And I fill in down payment with "<downPayment>"
    And I submit the loan request
    Then I should see loan request processed

    Examples:
      | loanAmount | downPayment |
      | 1000       | 100         |
