const { expect } = require('@playwright/test');
const { When, Then } = require('@cucumber/cucumber');
const { Main } = require('../../pages/airbnb/main');
const { Listings } = require('../../pages/airbnb/listings');
const { ListingDetails } = require('../../pages/airbnb/listingDetails');

const main = new Main();
const listings = new Listings();
const listingDetails = new ListingDetails();


When('user searches airbnb listings', async (table) => {
  global.airbnb = airbnbTableParser(table.hashes()[0]);
  await main.navigateToSite();
  await main.applySearchParams();
});

Then(/^"(.*)" listings page opened$/, async (destination) => {
  const expectedURL = `airbnb.com/s/${destination}`;
  await expect(page).toHaveURL(new RegExp(`^.*${expectedURL}.*$`));

  const titleLocator = await listings.getSearchHeader();
  await expect(titleLocator).toHaveText(new RegExp(`^.*${destination}.*$`));
});

When(/^user selects "(.*)" listing$/, async (sortType) => {
  await listings.selectListing(sortType);
});

Then(/^listing details page displays the search params$/, async () => {
  const expected = { ...global.airbnb };
  delete expected.destination;
  const pageParams = await listingDetails.getSearchParams();
  expect(pageParams).toEqual(expected);
});

When(/^user updates "(.*)" parameter by "(.*)" in listing page$/, async (guestType, updateValue) => {
    await listingDetails.updateGuests(guestType, updateValue);
});

When(/^user tries to update scheduling dates$/, async (table) => {
  const newDates = parseDatesForUpdate(table.hashes()[0]);
  await listingDetails.tryToUpdateDates(newDates);
});

When(/^user reserves listing$/, async () => {
  await listingDetails.reserveOrder();
});

Then(/^reservation page url matchs search params$/, async () => {
  const expectedURL = `https://www.airbnb.com/book/stays/`;
  await expect(page).toHaveURL(new RegExp(`^.*${expectedURL}.*$`))
  const numOfAdults = `numberOfAdults=${global.airbnb.guests.adults}`;
  await expect(page).toHaveURL(new RegExp(`^.*${numOfAdults}.*$`));
});



function airbnbTableParser(table) {
  let searchParams = {};
  if (table.destination)
    searchParams.destination = table.destination;

  if (table.date && table.duration) {
    let checkinDate = new Date();
    checkinDate.setDate(checkinDate.getDate() + Number(table.date));
    searchParams.checkin = checkinDate.toLocaleDateString('en-CA');

    let checkoutDate = new Date(checkinDate);
    checkoutDate.setDate(checkoutDate.getDate() + Number(table.duration));
    searchParams.checkout = checkoutDate.toLocaleDateString('en-CA');
  }

  if (table.guests) {
    searchParams.guests = JSON.parse(table.guests);
  }

  return searchParams;
}


function parseDatesForUpdate(dates) {
  let options = { year: 'numeric', month: '2-digit', day: '2-digit' };
  let newDates = {};
  let checkinDate = new Date();
  checkinDate.setDate(checkinDate.getDate() + Number(dates.date));
  newDates.checkin = checkinDate.toLocaleDateString('en-US', options);

  // to check-in - the day after also has to be available (otherwise it's only available to checkout)
  let plusOne = new Date(checkinDate);
  plusOne.setDate(plusOne.getDate() + 1);
  newDates.plusOne = plusOne.toLocaleDateString('en-US', options);

  let checkoutDate = new Date(checkinDate);
  checkoutDate.setDate(checkoutDate.getDate() + Number(dates.duration));
  newDates.checkout = checkoutDate.toLocaleDateString('en-US', options);
  return newDates;
}
