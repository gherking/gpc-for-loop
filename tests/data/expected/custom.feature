Feature: Test for loop

  @regression
  Scenario: [11] Test for loop
    Given the Login pages is opened
    When theusername field is filled with the username of user_1
    And the password field is filled with the password of user_1
    And the login button is clicked
    Then the Home page should be loaded

  @regression
  Scenario: [12] Test for loop
    Given the Login pages is opened
    When theusername field is filled with the username of user_1
    And the password field is filled with the password of user_1
    And the login button is clicked
    Then the Home page should be loaded

  @regression
  Scenario: [13] Test for loop
    Given the Login pages is opened
    When theusername field is filled with the username of user_1
    And the password field is filled with the password of user_1
    And the login button is clicked
    Then the Home page should be loaded

  @regression
  Scenario Outline: [11] Test for loop
    Given the Login pages is opened
    When theusername field is filled with the username of <user>
    And the password field is filled with the password of <user>
    And the login button is clicked
    Then the Home page should be

    Examples:
      | user   |
      | user_1 |
      | user_2 |

  @regression
  Scenario Outline: [12] Test for loop
    Given the Login pages is opened
    When theusername field is filled with the username of <user>
    And the password field is filled with the password of <user>
    And the login button is clicked
    Then the Home page should be

    Examples:
      | user   |
      | user_1 |
      | user_2 |

  @regression
  Scenario Outline: [13] Test for loop
    Given the Login pages is opened
    When theusername field is filled with the username of <user>
    And the password field is filled with the password of <user>
    And the login button is clicked
    Then the Home page should be

    Examples:
      | user   |
      | user_1 |
      | user_2 |