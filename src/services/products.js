export async function getProducts() {
  const response = await fetch('https://dummyjson.com/products?limit=50')
  if (!response.ok) throw new Error('Не удалось загрузить товары')
  const data = await response.json()
  return data.products
}

export function getCategories(products) {
  return [...new Set(products.map(product => product.category))]
}

export function getPriceRange(products) {
  if (!products.length) return { min: 0, max: 0 }
  const prices = products.map(product => product.price)
  return {
    min: Math.floor(Math.min(...prices) / 50) * 50,
    max: Math.ceil(Math.max(...prices) / 50) * 50,
  }
}

export function filterProducts(products, filters) {
  const search = filters.title.trim().toLowerCase()
  return products.filter(product =>
    product.title.toLowerCase().includes(search) &&
    (!filters.category || product.category === filters.category) &&
    product.price <= filters.price &&
    product.rating <= filters.rating
  )
}
