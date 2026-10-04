<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { getProducts, getCategories, getPriceRange, filterProducts } from './services/products'
import ProductCard from './components/ProductCard.vue'

const products = ref([])
const loading = ref(true)
const error = ref('')
const priceRange = ref({ min: 0, max: 0 })
const filters = reactive({ title: '', category: '', price: 0, rating: 3 })

const categories = computed(() => getCategories(products.value))
const filteredProducts = computed(() => filterProducts(products.value, filters))

async function loadProducts() {
  loading.value = true
  error.value = ''
  try {
    products.value = await getProducts()
    priceRange.value = getPriceRange(products.value)
    filters.price = priceRange.value.min + Math.floor((priceRange.value.max - priceRange.value.min) / 100) * 50
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}

onMounted(loadProducts)
</script>

<template>
  <main class="catalog">
    <form class="filters" aria-label="Фильтры товаров" @submit.prevent>
      <div class="text-filters">
        <label for="title">Search title:</label>
        <input id="title" v-model="filters.title" type="search" placeholder="Search..." />

        <label for="category">Select category:</label>
        <select id="category" v-model="filters.category">
          <option value="">All categories</option>
          <option v-for="category in categories" :key="category" :value="category">{{ category }}</option>
        </select>
      </div>

      <div class="range-filters">
        <label for="price">Price range:</label>
        <div class="range-values">
          <span>{{ priceRange.min }}</span>
          <output for="price">{{ filters.price }}</output>
          <span>{{ priceRange.max }}</span>
        </div>
        <input v-if="!loading" id="price" v-model.number="filters.price" type="range" :min="priceRange.min" :max="priceRange.max" step="50" />

        <label for="rating">Rating range:</label>
        <div class="range-values">
          <span>0</span>
          <output for="rating">{{ filters.rating }}</output>
          <span>5</span>
        </div>
        <input id="rating" v-model.number="filters.rating" type="range" min="0" max="5" step="1" />
      </div>
    </form>

    <p v-if="loading" class="message" role="status">Загрузка товаров...</p>
    <div v-else-if="error" class="message error" role="alert">
      <p>{{ error }}</p>
      <button @click="loadProducts">Повторить</button>
    </div>
    <p v-else-if="!filteredProducts.length" class="message" role="status">Товары не найдены</p>
    <div v-else class="product-list">
      <ProductCard v-for="product in filteredProducts" :key="product.id" :product="product" />
    </div>
  </main>
</template>
