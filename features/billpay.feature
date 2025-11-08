Feature: Bill Pay - Realizar pagos a beneficiarios

  Como usuario autenticado
  Quiero realizar pagos a beneficiarios
  Para cumplir compromisos financieros

  Background:
    Given el usuario está autenticado en Parabank
    And el usuario navega a la página de Bill Pay

  @billpay @happy-path
  Scenario: Realizar pago exitoso a un beneficiario
    When el usuario ingresa los siguientes datos del beneficiario:
      | Payee Name       | Juan Perez              |
      | Address          | Calle 123               |
      | City             | Medellín                |
      | State            | Antioquia               |
      | Zip Code         | 050001                  |
      | Phone            | 3001234567              |
      | Account          | 12345                   |
      | Verify Account   | 12345                   |
      | Amount           | 100.00                  |
    And el usuario selecciona una cuenta de origen
    And el usuario confirma el pago
    Then se debe mostrar el mensaje de pago exitoso

  @billpay @error-handling
  Scenario: Error cuando las cuentas no coinciden
    When el usuario ingresa los siguientes datos del beneficiario:
      | Payee Name       | Maria Rodriguez         |
      | Address          | Avenida 456             |
      | City             | Bogotá                  |
      | State            | Cundinamarca            |
      | Zip Code         | 110111                  |
      | Phone            | 3009876543              |
      | Account          | 98765                   |
      | Verify Account   | 98766                   |
      | Amount           | 50.00                   |
    And el usuario selecciona una cuenta de origen
    And el usuario confirma el pago
    Then se debe mostrar el error de cuentas no coinciden
