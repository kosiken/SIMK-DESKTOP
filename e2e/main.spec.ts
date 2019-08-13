import {expect, assert} from 'chai';
import {SpectronClient} from 'spectron';

import commonSetup from './common-setup';

describe('angular-electron App', function () {
  commonSetup.apply(this);

  let browser: any;
  let client: SpectronClient;

  beforeEach(function () {
    client = this.app.client;
    browser = client as any;
  });

  it('should display message saying App works !', async function () {
    const text = await browser.getText('mat-card-subtitle.mat-card-subtitle');
    expect(text).to.equal('You can name it anything you choose');
  });


  it('creates initial windows', async function () {
    const count = await client.getWindowCount();
    expect(count).to.equal(1);
  });

});
