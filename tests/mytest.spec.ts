import { test, expect } from '@playwright/test';

// Багшийн өгсөн жишээ код
// test('амжилттай нэвтэрлээ', async ({ page }) => {
// await page.goto('https://www.saucedemo.com');
// await page.getByPlaceholder('Username').fill('standard_user');
// await page.getByPlaceholder('Password').fill('secret_sauce');
// await page.getByRole('button', { name: 'Login' }).click();
// await expect(page.getByText('Products')).toBeVisible();
// });



// Тестлэх сайт: SauceDemo
const BASE_URL = 'https://www.saucedemo.com';
const VALID_USER = 'standard_user';
const VALID_PASS = 'secret_sauce';
const INVALID_PASS = 'wrong_password';

test.describe('SauceDemo нэвтрэх функц', () => {

  test('1. Амжилттай нэвтрэх', async ({ page }) => {
    await page.goto(BASE_URL);

    //"getByPlaceholder" нь "XPath"-аас илүү 
    // тодорхой болон хэрэглэгчдэд ээлтэй, ойлгомжтой тул 
    // энгийн тестэнд тохиромжтой.
    await page.getByPlaceholder('Username').fill(VALID_USER);
    await page.getByPlaceholder('Password').fill(VALID_PASS);
    await page.getByRole('button', { name: 'Login' }).click();

    // Нэвтэрсний дараа Products хуудас руу шилжсэн эсэхийг шалгах
    await expect(page.getByText('Products')).toBeVisible();
    // Энэ хэсэг нь бол албаар тестэнд алдаа гаргахын тулд хийсэн хэсэг юм. Тиймээс энэ хэсгийг коммент хийж болно.
    // await expect(page.getByText('Products')).toHaveText('WRONG TEXT');
    await expect(page).toHaveURL(/inventory\.html/);
        // logout
        // Энийг getByRole-оор орлууллаа илүү найдвартай юм байна.
    await page.getByRole('button', { name: 'Open Menu' }).click();
    await page.getByRole('link', { name: 'Logout' }).click();
    await expect(page.getByPlaceholder('Username')).toBeVisible();
  });

  test('2. Амжилтгүй нэвтрэх (буруу нууц үг)', async ({ page }) => {
    await page.goto(BASE_URL);

    await page.getByPlaceholder('Username').fill(VALID_USER);
    await page.getByPlaceholder('Password').fill(INVALID_PASS);
    await page.getByRole('button', { name: 'Login' }).click();

    // Алдаа гарч байгааг шалгах
    await expect(page.getByText('Username and password do not match')).toBeVisible();
    // Нэвтрэх хуудсанд гацсан үгүйг шалгах
    await expect(page).toHaveURL(BASE_URL + '/');
  });

  test('3. Нэвтэрсний дараах үйлдэл — бараа сагслах', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.getByPlaceholder('Username').fill(VALID_USER);
    await page.getByPlaceholder('Password').fill(VALID_PASS);
    await page.getByRole('button', { name: 'Login' }).click();
    await expect(page.getByText('Products')).toBeVisible();

    // Нэгдүгээр барааг сагслах, товч дарах
    await page.getByRole('button', { name: 'Add to cart' }).first().click();

    // Сагсны тоолуур "1" болсныг шалгах
    await expect(page.getByTestId('shopping-cart-badge')).toHaveText('1');    
    // Сагсийг шалгах
    await page.getByTestId('shopping-cart-link').click();

    await expect(page.getByTestId('inventory-item')).toHaveCount(1);

    // logout
    await page.getByRole('button', { name: 'Open Menu' }).click();
    await page.getByRole('link', { name: 'Logout' }).click();
    await expect(page.getByPlaceholder('Username')).toBeVisible();
  });

});
