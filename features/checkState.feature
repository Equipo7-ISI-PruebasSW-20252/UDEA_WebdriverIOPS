Feature: ParaBank Check State Feature

  Scenario: All accounts are displayed for the user
    Given I am logged in with john and demo
    And I am on the checkState page
    Then I should see the accounts list displayed
    And the accounts list should contain at least 1 account

  Scenario Outline: User can view account details by clicking an account
    Given I am logged in with john and demo
    And I am on the checkState page
    And I print all available accounts
    When I click on account "<accountId>"
    Then I should see the details panel showing account id "<accountId>", type "<accountType>" and balance "<balance>"

    Examples:
      | accountId | accountType | balance    |
      | 13011     | CHECKING    | $100.00    |

  #Scenario: Selecting another account updates the details panel
   # Given I am logged in with john and demo
   # And I am on the checkState page
   # And I print all available accounts
    #When I click on account "13011"
    #And I record the balance shown as "balanceA"
   # When I click on account "13344"
   # Then the previously recorded balance "balanceA" should not equal the current balance
