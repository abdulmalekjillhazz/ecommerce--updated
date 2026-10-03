export default async function sitemap() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

  // Static site pages
  const staticRoutes = [
    '',
    '/products',
    '/cart',
    '/login',
    '/register',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: route === '' ? 'daily' : 'weekly',
    priority: route === '' ? 1.0 : 0.8,
  }));

  // Fetch product slugs dynamically from API server
  let productRoutes = [];
  try {
    const res = await fetch(`${apiUrl}/products?limit=100`, {
      next: { revalidate: 3600 },
    });
    if (res.ok) {
      const data = await res.json();
      const products = data.data?.products || [];
      productRoutes = products.map((prod) => ({
        url: `${baseUrl}/products/${prod.slug}`,
        lastModified: prod.updatedAt || new Date().toISOString(),
        changeFrequency: 'weekly',
        priority: 0.9,
      }));
    }
  } catch {
    // If backend isn't running during build, graceful fallback
  }

  return [...staticRoutes, ...productRoutes];
}
