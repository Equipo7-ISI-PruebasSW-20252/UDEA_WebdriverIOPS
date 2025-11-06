Feature: Para Bank Check State Feature

  Background: 
    Given I am on the login page
    When I login with john and demo

  Scenario Outline: As a user, I can check the state of my accounts in the Para Bank Website
    Given I am on the checkState page
    When I click on an <account>
    Then I can see the <details> as <account>, <accountType>, <balance> and <available>

    Examples:
      |        details        |     balance     |   account   |   accountType   |   available   |
      |     Account Details   |     $35.50      |    22113    |    CHECKING     |     $35.50    |
