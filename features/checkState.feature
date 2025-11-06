Feature: Para Bank Check State Feature

  Background: 
    Given I am on the login page
    When I login with john and demo

  Scenario Outline: As a user, I can check the state of my accounts in the Para Bank Website
    Given I am on the checkState page
    When I click on an <account>
    Then I can see the <details> as <account>, <accountType>, <balance> and <available>

    Examples:
      | details         | account | accountType | balance  | available |
      | Account Details | 13011   | CHECKING    | $100.00  | $100.00   |
      | Account Details | 13344   | SAVINGS     | $1231.10 | $1231.10  |

  Scenario: Verify all accounts are displayed with balances
    Given I am on the checkState page
    Then I should see all my accounts with their current balances

  Scenario: Verify account switching updates the view
    Given I am on the checkState page
    When I switch from account 13011 to account 13344
    Then I should see the details updated for account 13344
