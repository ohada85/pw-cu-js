const { Page } = require('../page.js');

class Main extends Page {
  constructor() {
    super();

    this.url = 'https://www.airbnb.com/';

    this.elements = {
      destinationInput: 'structured-search-input-field-query',
      firstDestinationOption: '[data-testid="option-0"]',
      datePickerButton: '[data-testid="structured-search-input-field-split-dates-0"]',
      dateOption: (date) => `[data-state--date-string="${date}"]`,
      guestsButton: '[data-testid="structured-search-input-field-guests-button"]',
      increaseAdultsButton: '[data-testid="stepper-adults-increase-button"]',
      increaseChildrenButton: '[data-testid="stepper-children-increase-button"]',
      increaseInfantsButton: '[data-testid="stepper-infants-increase-button"]',
      searchButton: '[data-testid="structured-search-input-search-button"]',
    }
  }

  async navigateToSite() {
    await page.goto(this.url);
  };

  async _inputDates(start, end) {
    await this.click(this.elements.dateOption(start));
    await this.click(this.elements.dateOption(end));
  }

  async _inputDestination(destination) {
    await page.getByTestId(this.elements.destinationInput).fill(destination);
    await this.click(this.elements.firstDestinationOption);
  }

  async _inputGuests(guests) {
    await this.click(this.elements.guestsButton);
    for (let i = 0; i < guests.adults; i++) {
      await this.click(this.elements.increaseAdultsButton);
    }
    if (guests.children) {
      for (let i = 0; i < guests.children; i++) {
        await this.click(this.elements.increaseChildrenButton);
      }
    }
    if (guests.infants) {
      for (let i = 0; i < guests.infants; i++) {
        await this.click(this.elements.increaseInfantsButton);
      }
    }
    await this.click(this.elements.guestsButton);
  }


  async applySearchParams() {
    await this._inputDestination(global.airbnb.destination);
    await this._inputDates(global.airbnb.checkin, global.airbnb.checkout);
    await this._inputGuests(global.airbnb.guests);
    const currentUrl = await this.getURL();
    await page.click(this.elements.searchButton);
    return this.urlChanged(currentUrl);
  }

}
module.exports = { Main }
