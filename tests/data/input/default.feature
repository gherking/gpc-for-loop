Feature: Test for loop

  @regression
  Scenario: Not to loop
    Given the Login page is opened
    When the username field is filled with the username of wrong_user
    And the password field is filled with the password of wrong_user
    And the login button is clicked
    Then the Home page should be loaded

  @regression @loop(5)
  Scenario: Test for loop
    Given the Login page is opened
    When the username field is filled with the username of user_1
    And the password field is filled with the password of user_1
    And the login button is clicked
    Then the Home page should be loaded

  @regression @loop(2)
  Scenario Outline: Test for loop
    Given the Login page is opened
    When the username field is filled with the username of <user>
    And the password field is filled with the password of <user>
    And the login button is clicked
    Then the Home page should be loaded

    Examples:
      | user   |
      | user_1 |
      | user_2 |