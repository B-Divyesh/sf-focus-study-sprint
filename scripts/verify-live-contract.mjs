import assert from 'node:assert/strict';

const product = {
  slug: 'focus-study-sprint',
  name: 'Focus Study Sprint Contour unlock',
  priceMinor: 1200,
  currency: 'USD',
  productUrl: 'https://focus-study-sprint.sociobot.in/',
};
const catalogUrl = 'https://api.sociobot.in/api/v1/products';
const checkoutUrl = `${catalogUrl}/${product.slug}/checkout`;

async function request(url, options = {}) {
  const response = await fetch(url, {
    redirect: 'manual',
    headers: { accept: 'application/json', ...options.headers },
    ...options,
  });
  return response;
}

const catalogResponse = await request(catalogUrl);
assert.equal(catalogResponse.status, 200, `Product catalog must be available: ${catalogUrl}`);
const catalog = await catalogResponse.json();
assert.equal(catalog.mode, 'live', 'Live checkout must use the production billing catalog');
const registered = catalog.data?.find((entry) => entry.slug === product.slug);
assert.ok(registered, `Production catalog is missing ${product.slug}; register the factory product before release.`);
assert.equal(registered.checkout_url, checkoutUrl, 'Catalog checkout URL must match the app checkout URL');
assert.equal(registered.price_minor, product.priceMinor, 'Catalog price must match the advertised $12 unlock');
assert.equal(registered.currency, product.currency, 'Catalog currency must match the advertised unlock');
assert.equal(registered.product_url, product.productUrl, 'Catalog return URL must point to this product');

const checkoutResponse = await request(checkoutUrl);
assert.ok(
  checkoutResponse.status >= 300 && checkoutResponse.status < 400,
  `Checkout must redirect to hosted Sociobot checkout; got HTTP ${checkoutResponse.status}.`,
);
assert.ok(checkoutResponse.headers.get('location'), 'Checkout redirect must include a hosted checkout location');

console.log(`Live billing contract passed for ${product.slug}: catalog entry and checkout redirect are available.`);
