Feature: Para Bank Check State Feature

  Background:
    Given I am on the login page
    When I login with john and demo

  Scenario: All accounts are displayed for the user
    Given I am on the stateCheck page
    Then I should see the accounts list displayed
    And the accounts list should contain at least 1 account

  Scenario Outline: User can view account details by clicking an account
    Given I am on the stateCheck page
    When I click on account "<accountId>"
    Then I should see the details panel showing account id "<accountId>", type "<accountType>" and balance "<balance>"

    Examples:
      | accountId | accountType | balance    |
      | 22113     | CHECKING    | $35.50     |
      | 607860    | CHECKING    | $90.00     |
 
  Scenario: Selecting another account updates the details panel
    Given I am on the stateCheck page
    When I click on account "22113"
    And I record the balance shown as "balanceA"
    When I click on account "607860"
    Then the previously recorded balance "balanceA" should not equal the current balance
