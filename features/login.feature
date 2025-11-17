Feature: Login - Autenticación de usuarios
  Como usuario del sistema
  Quiero autenticarme en ParaBank
  Para acceder a mis cuentas

  @login @positive @negative
  Scenario Outline: Autenticación con diferentes credenciales
    Given I am on the login page
    When I login with <username> and <password>
    Then I should see a text saying <message>

    Examples:
      | username        | password | message           |
      | invalidUsername |          | Error!            |
      | john            | demo     | Accounts Overview |
