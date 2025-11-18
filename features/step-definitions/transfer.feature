Feature: Transferencias en Parabank

  Background:
    Given I am on the login page
    When I login with john and demo

  Scenario Outline: Transferencia entre cuentas
    Given I am on the transfer page
    When I write the <amount> to transfer from the account <fromAccount> to the account <toAccount> and press transfer
    Then I see <message>

  Examples:
    | amount | fromAccount | toAccount | message              |
    | 1      | 13788       | 14454     | Transfer Complete!   |
    |        | 13677       | 13566     | Error!               |
