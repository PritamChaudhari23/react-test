Feature: Login Page

  Background:
    Given I am on the login page

  Scenario: Login form is displayed
    Then I should see the username field
    And I should see the password field
    And I should see the login button

  Scenario: User enters credentials
    When I enter "emilys" in the username field
    And I enter "emilyspass" in the password field
    Then the username field should contain "emilys"
    And the password field should contain "emilyspass"

  Scenario: User submits the login form
    When I enter "emilys" in the username field
    And I enter "emilyspass" in the password field
    And I click the login button
    Then the login API should be called

  Scenario: Login API is called with correct payload
    When I enter "emilys" in the username field
    And I enter "emilyspass" in the password field
    And I click the login button
    Then the login API request should contain:
      | username | emilys     |
      | password | emilyspass |
