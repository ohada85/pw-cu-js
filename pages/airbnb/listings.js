const { Page } = require('../page.js');

class Listings extends Page {
  constructor() {
    super();

    this.elements = {
      pagesBarButton: 'button[aria-current="page"]',
      searchResultsTitle: '[data-testid="stays-page-heading"]',
      listingContainer: '[data-testid="card-container"]',
    }
  }

  async getSearchHeader() {
    return page.locator(this.elements.searchResultsTitle);
  }

  _getHighestRatedListing(texts) {
    return texts.reduce((max, entry) => {
      let entryRatingFound = entry.match(/reviews(\d+\.\d+)/);
      if (!entryRatingFound)
        return max; // Skip entries without a rating

      let entryRating = entryRatingFound[1];
      let maxEntryRating = max.match(/reviews(\d+\.\d+)/)[1];

      // console.log(`
      // current entry: ${entry},
      // with rating: ${entryRating},
      // current max entry is: ${max},
      // with rating: ${maxEntryRating}`
      // );
      return entryRating > maxEntryRating ? entry : max;
    });
  }

  async selectListing(sortType) {
    await page.locator(this.elements.pagesBarButton).isVisible();
    let texts = await this.getTexts(this.elements.listingContainer);
    await this.listenForNewPage();
    if (sortType === 'highest-rated') {
      const highestRated = this._getHighestRatedListing(texts);
      await this.click(`text=${highestRated}`);
    }
    return this.switchToNewPage();
  }

}

module.exports = { Listings }