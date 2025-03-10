Feature: Login Feature

  Background:
    Given I open the swag page

    @another
  Scenario: Validate the login page title
    # TODO: Fix this failing scenario
    Then I should see the title "Swag Labs"

  Scenario: Validate login error message
    When user logins as "locked_out_user"
    # TODO: Add a step to validate the error message received