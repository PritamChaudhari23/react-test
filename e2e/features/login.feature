Feature: Login Page

  Background:
    Given I am on the login page

  Scenario: Login form is displayed
    Then I should see the "username" field
    And I should see the "password" field
    And I should see the login button

  Scenario: User enters credentials
    When I enter "emilys" in the "username" field
    And I enter "emilyspass" in the "password" field
    Then The "username" field should contain "emilys"
    And The "password" field should contain "emilyspass"

  Scenario: User submits the login form
    When I enter "emilys" in the "username" field
    And I enter "emilyspass" in the "password" field
    And I click the login button
    Then The login API should be called

  Scenario: Login API is called with correct payload
    When I enter "emilys" in the "username" field
    And I enter "emilyspass" in the "password" field
    And I click the login button
    Then The login API request should contain:
      | username | emilys     |
      | password | emilyspass |
