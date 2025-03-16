Feature: test airbnb site and functionality

  @airbnb
  Scenario: find relevant listings and book a room
    When user searches airbnb listings
      | destination | date | duration | guests                       |
      | Amsterdam   | 1    | 1        | {"adults": 2, "children": 1} |
    Then "Amsterdam" listings page opened

    When user selects "highest-rated" listing
    Then listing details page displays the search params

    When user updates "children" parameter by "-1" in listing page
    And user tries to update scheduling dates
      | date | duration |
      | 8    | 1        |
    Then listing details page displays the search params

    When user reserves listing
    Then reservation page url matchs search params
