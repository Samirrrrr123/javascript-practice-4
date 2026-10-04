<script setup>
defineProps({ product: Object })
</script>

<template>
  <article class="product-card">
    <img :src="product.thumbnail" :alt="product.title" />
    <p>Title: {{ product.title }}</p>
    <p>Category: {{ product.category }}</p>
    <p>Price: {{ product.price }}$</p>
    <div class="stars" role="img" :aria-label="`Рейтинг: ${product.rating} из 5`" :title="`Рейтинг: ${product.rating}`">
      <span v-for="star in 5" :key="star" :class="{ filled: star <= Math.round(product.rating) }" aria-hidden="true">★</span>
    </div>
  </article>
</template>
