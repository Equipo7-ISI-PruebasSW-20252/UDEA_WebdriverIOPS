Feature: ParaBank Loan Simulation Feature

  Scenario Outline: As a user, I can request a loan
    Given I am logged in with john and demo
    And I am on the loanRequest page
    When I fill in loan amount with "<loanAmount>"
    And I fill in down payment with "<downPayment>"
    And I submit the loan request
    Then I should see loan request processed

    Examples:
      | loanAmount | downPayment |
      | 1000       | 100         |

