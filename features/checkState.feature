Feature: Account Overview - Consultar estado de cuentas
  Como usuario autenticado
  Quiero consultar el estado de mis cuentas
  Para conocer mis balances y detalles

  Background:
    Given I am logged in with john and demo
    And I am on the checkState page

  @account-overview @happy-path
  Scenario: Todas las cuentas se muestran para el usuario
    Then I should see the accounts list displayed
    And the accounts list should contain at least 1 account

  @account-overview @details
  Scenario Outline: Usuario puede ver detalles de cuenta al hacer clic
    And I print all available accounts
    When I click on account "<accountId>"
    Then I should see the details panel showing account id "<accountId>", type "<accountType>" and balance "<balance>"

    Examples:
      | accountId | accountType | balance |
      | 13011     | CHECKING    | $100.00 |

  #@account-overview @navigation
  #Scenario: Seleccionar otra cuenta actualiza el panel de detalles
    #And I print all available accounts
    #When I click on account "13011"
    #And I record the balance shown as "balanceA"
    #When I click on account "13344"
    #Then the previously recorded balance "balanceA" should not equal the current balance
