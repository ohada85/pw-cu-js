const { Page } = require('../page.js');

class ListingDetails extends Page {
  constructor() {
    super();

    this.elements = {
      loader: '[data-testid="dot-loader"]',
      checkinField: '[data-testid="change-dates-checkIn"]',
      checkoutField: '[data-testid="change-dates-checkOut"]',
      guestsButton: '[role="button"] [id="GuestPicker-book_it-trigger"]',
      adultGuestsCounter: '[data-testid="GuestPicker-book_it-form-adults-stepper-value"]',
      childrenGuestsCounter: '[data-testid="GuestPicker-book_it-form-children-stepper-value"]',
      infantsGuestsCounter: '[data-testid="GuestPicker-book_it-form-infants-stepper-value"]',
      closeDialogButton: 'button[aria-label="Close"]',
      increaseAdultsButton: '[data-testid="GuestPicker-book_it-form-adults-stepper-increase-button"]',
      decreaseAdultsButton: '[data-testid="GuestPicker-book_it-form-adults-stepper-decrease-button"]',
      increaseChildrenButton: '[data-testid="GuestPicker-book_it-form-children-stepper-increase-button"]',
      decreaseChildrenButton: '[data-testid="GuestPicker-book_it-form-children-stepper-decrease-button"]',
      increaseInfantsButton: '[data-testid="GuestPicker-book_it-form-infants-stepper-increase-button"]',
      decreaseInfantsButton: '[data-testid="GuestPicker-book_it-form-infants-stepper-decrease-button"]',
      changeDatesButton: '[data-testid="change-dates-checkIn"]',
      dateOption: (date) => `[data-testid="bookit-sidebar-availability-calendar"] [data-testid="calendar-day-${date}"]`,
      closeSideCalendar: '[data-testid="availability-calendar-save"]',
      reserveButton: '[data-section-id="BOOK_IT_SIDEBAR"] [data-testid="homes-pdp-cta-btn"]',
    }
  }

  // page.on('dialog', dialog => dialog.dismiss()); didn't work
  // tried with 1 second - not perfect, 2 seconds does the job
  // given more time- find an indicator for the page is fully loaded, and then click the button if relevant (based on .count())
  async _checkAndCloseDialog() {
    try {
      await page.locator(this.elements.closeDialogButton).click({ timeout: 2000 });
    } catch (error) {
    }
  }

  async _getCheckinDate() {
    const checkinText = await this.getText(this.elements.checkinField);
    const checkinDate = new Date(checkinText);
    return checkinDate.toLocaleDateString('en-CA');
  }

  async _getCheckoutDate() {
    const checkoutText = await this.getText(this.elements.checkoutField);
    const checkoutDate = new Date(checkoutText);
    return checkoutDate.toLocaleDateString('en-CA');
  }

  async _getGuests() {
    let guests = {};
    await this.click(this.elements.guestsButton);

    // adults - a must
    guests.adults = Number(await this.getText(this.elements.adultGuestsCounter));

    const childrenGuests = Number(await this.getText(this.elements.childrenGuestsCounter));
    if (childrenGuests > 0) {
      guests.children = childrenGuests;
    }
    const infantsGuests = Number(await this.getText(this.elements.infantsGuestsCounter));
    if (infantsGuests > 0) {
      guests.infants = infantsGuests;
    }
    await this.click(this.elements.guestsButton);

    return guests;
  }

  async getSearchParams() {
    await page.waitForLoadState('domcontentloaded');
    await this._checkAndCloseDialog();
    const checkin = await this._getCheckinDate();
    const checkout = await this._getCheckoutDate();
    const guests = await this._getGuests();
    return { checkin, checkout, guests };
  }

  async _updateAdults(updateAdults) {
    if (updateAdults > 0) {
      if (await page.locator(this.elements.increaseAdultsButton).isDisabled())
        throw new Error('Cannot increase guests count, as button is disabled');
      for (let i = 0; i < updateAdults; i++) {
        await this.click(this.elements.increaseAdultsButton)
      }
    }
    if (updateAdults < 0) {
      for (let i = 0; i < Math.abs(updateAdults); i++) {
        await this.click(this.elements.decreaseAdultsButton);
      }
    }

  }

  async _updateChildren(updateChildren) {
    if (updateChildren > 0) {
      if (await page.locator(this.elements.increaseChildrenButton).isDisabled())
        throw new Error('Cannot increase children count, as button is disabled');
      for (let i = 0; i < updateChildren; i++) {
        await this.click(this.elements.increaseChildrenButton);
      }
    }
    if (updateChildren < 0) {
      for (let i = 0; i < Math.abs(updateChildren); i++) {
        await this.click(this.elements.decreaseChildrenButton);
      }
    }
  }

  async _updateInfants(updateInfants) {
    if (updateInfants > 0) {
      if (await page.locator(this.elements.increaseInfantsButton).isDisabled())
        throw new Error('Cannot increase infants count, as button is disabled');
      for (let i = 0; i < updateInfants; i++) {
        await this.click(this.elements.increaseInfantsButton);
      }
    }
    if (updateInfants < 0) {
      for (let i = 0; i < Math.abs(updateInfants); i++) {
        await this.click(this.elements.decreaseInfantsButton);
      }
    }
  }

  async updateGuests(guestType, updateValueText) {
    const updateValue = Number(updateValueText);
    await this.click(this.elements.guestsButton);
    switch (guestType) {
      case 'adult':
        await this._updateAdults(updateValue);
        global.airbnb.guests.adults += updateValue;
        break
      case 'children':
        await this._updateChildren(updateValue);
        global.airbnb.guests.children += updateValue;
        break
      case 'infant':
        await this._updateInfants(updateValue);
        global.airbnb.guests.infants += updateValue;
        break
    }
    Object.keys(global.airbnb.guests).forEach(key => {
      if (global.airbnb.guests[key] === 0)
        delete global.airbnb.guests[key];
    })
    await this.click(this.elements.guestsButton);
  }

  _updateGlobalDates(dates) {
    const checkinDate = new Date(dates.checkin);
    global.airbnb.checkin = checkinDate.toLocaleDateString('en-CA');
    const checkoutDate = new Date(dates.checkout);
    global.airbnb.checkout = checkoutDate.toLocaleDateString('en-CA');
  }

  async _checkIfDatesAreBlocked(dates) {
    const blockAtt = 'data-is-day-blocked';
    // check both date and date+1 (some are available only for checkout)
    const isCheckingBlocked = await this.getAttribute(this.elements.dateOption(dates.checkin), blockAtt);
    const isPlusOneBlocked = await this.getAttribute(this.elements.dateOption(dates.plusOne), blockAtt);
    if (isCheckingBlocked === 'true' || isPlusOneBlocked === 'true') {
      console.log(`Checkin date - ${dates.checkin}, is blocked. keeping original dates`);
      return true;
    }
    const isCheckoutBlocked = await this.getAttribute(this.elements.dateOption(dates.checkout), blockAtt);
    if (isCheckoutBlocked === 'true') {
      console.log(`Checkout date - ${dates.checkout}, is blocked. keeping original dates`);
      return true;
    }
  }

  async tryToUpdateDates(dates) {
    await this.click(this.elements.changeDatesButton);
    let datesBlocked = await this._checkIfDatesAreBlocked(dates);
    if (datesBlocked)
      return this.click(this.elements.closeSideCalendar);

    await this.click(this.elements.dateOption(dates.checkin));
    await this.click(this.elements.dateOption(dates.checkout));
    this._updateGlobalDates(dates);
    return console.log('Dates updated successfully');
  }


  async reserveOrder() {
    const currentUrl = await this.getURL();
    await this.click(this.elements.reserveButton);
    return this.urlChanged(currentUrl);
  }
}

module.exports = { ListingDetails }