import { test, expect } from '@playwright/test';

test('Send Message Through Teams Chat', async ({ page }) => {
  // Run Authentication Into Teams
  await page.goto('https://teams.byu.edu/');
  const page1Promise = page.waitForEvent('popup');
  await page.getByRole('link', { name: 'Log Into Teams' }).click();
  const page1 = await page1Promise;
  await page1.getByPlaceholder('Email, phone, or Skype').click();
  await page1.getByPlaceholder('Email, phone, or Skype').fill(process.env.MS_USERNAME ?? '');
  await page1.getByPlaceholder('Email, phone, or Skype').press('Enter');
  await page1.getByPlaceholder('Password').click();
  await page1.getByPlaceholder('Password').fill(process.env.MS_PASSWORD ?? '');
  await page1.getByPlaceholder('Password').press('Enter');
  await page1.getByRole('button', { name: 'Yes, this is my device' }).click();
  await page1.getByRole('button', { name: 'Yes' }).click();

  // Get to chat and send first message
  await page1.getByRole('button', { name: 'Chat' }).click();
  await page1.getByRole('region').locator('div').filter({ hasText: /^Chat$/ }).nth(1).click();
  const chatElements = await page1.locator(`text=${process.env.TARGET_CHAT ?? ''}`).all()
  const individualChatElement = chatElements[0]
  await individualChatElement.click()
  await sendMessage(page1, process.env.INITIAL_MESSAGE ?? 'Hello!')

  // Set up recurring messages to be sent
  while(true) {
    await page1.waitForTimeout(Number(process.env.TIME_BETWEEN_MESSAGES ?? '60000'));
    await sendMessage(page1, process.env.RECURRING_MESSAGE ?? '')
  }
});

const sendMessage = async (targetPage: any, message: string) => {
  await targetPage.getByLabel('Type a message').click();
  await targetPage.getByLabel('Type a message').fill(message);
  await targetPage.getByRole('button', { name: 'Send (Ctrl+Enter)' }).click();
  await targetPage.waitForTimeout(1000);
}