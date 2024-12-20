Feature: Test for loop

  @regression @iterate(3)
  Scenario: [11] Test for loop
    Given the Login page is opened
    When the username field is filled with the username of user_1
    And the password field is filled with the password of user_1
    And the login button is clicked
    Then the Home page should be loaded

  @regression @iterate(3)
  Scenario: [12] Test for loop
    Given the Login page is opened
    When the username field is filled with the username of user_1
    And the password field is filled with the password of user_1
    And the login button is clicked
    Then the Home page should be loaded

  @regression @iterate(3)
  Scenario: [13] Test for loop
    Given the Login page is opened
    When the username field is filled with the username of user_1
    And the password field is filled with the password of user_1
    And the login button is clicked
    Then the Home page should be loaded

  @regression @iterate(3)
  Scenario Outline: [11] Test for loop
    Given the Login page is opened
    When the username field is filled with the username of <user>
    And the password field is filled with the password of <user>
    And the login button is clicked
    Then the Home page should be loaded

    Examples:
      | user   |
      | user_1 |
      | user_2 |

  @regression @iterate(3)
  Scenario Outline: [12] Test for loop
    Given the Login page is opened
    When the username field is filled with the username of <user>
    And the password field is filled with the password of <user>
    And the login button is clicked
    Then the Home page should be loaded

    Examples:
      | user   |
      | user_1 |
      | user_2 |

  @regression @iterate(3)
  Scenario Outline: [13] Test for loop
    Given the Login page is opened
    When the username field is filled with the username of <user>
    And the password field is filled with the password of <user>
    And the login button is clicked
    Then the Home page should be loaded

    Examples:
      | user   |
      | user_1 |
      | user_2 |
