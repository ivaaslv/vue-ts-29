<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import Api from "../../api";

// Interface untuk Kategori
interface Category {
  id: number;
  kategori?: string;
  nama?: string;
  name?: string;
}

// Interface Errors Validation
interface Errors {
  name?: string[];
  price?: string[];
  description?: string[];
  stock?: string[];
  id_kategori?: string[];
}

// State Form
const name = ref("");
const price = ref("");
const description = ref("");
const stock = ref("");
const id_kategori = ref("");

// State List Kategori & Error
const categories = ref<Category[]>([]);
const errors = ref<Errors>({});

// Route & Router Instance
const route = useRoute();
const router = useRouter();

// Fetch list kategori untuk option dropdown
const fetchCategories = async () => {
  try {
    const response = await Api.get("/api/kategori");
    categories.value = response.data.data || response.data;
  } catch (error) {
    console.error("Gagal mengambil data kategori:", error);
  }
};

// Fetch detail produk berdasarkan ID dari URL
const fetchDetailProduct = async () => {
  try {
    const response = await Api.get(`/api/products/${route.params.id}`);
    const product = response.data.data || response.data;

    // Mapping nilai dari API ke state ref
    name.value = product.name || product.title || "";
    price.value = product.price || "";
    description.value = product.description || "";
    stock.value = product.stock || "";
    id_kategori.value = product.id_kategori || "";
  } catch (error) {
    console.error("Error fetching product:", error);
  }
};

// Jalankan saat komponen di-mount
onMounted(async () => {
  await fetchCategories();
  await fetchDetailProduct();
});

// Update data produk ke API
const updateProduct = async () => {
  // Gunakan JSON Object agar id_kategori terbaca dengan benar oleh Controller Laravel
  const payload = {
    name: name.value,
    price: Number(price.value),
    description: description.value,
    stock: Number(stock.value),
    id_kategori: Number(id_kategori.value),
  };

  try {
    await Api.put(`/api/products/${route.params.id}`, payload);
    router.push("/products");
  } catch (error: any) {
    if (error.response && error.response.data) {
      errors.value = error.response.data.errors || error.response.data;
    }
  }
};
</script>

<template>
  <div class="container mt-5">
    <div class="row">
      <div class="col-md-12">
        <div class="card border-0 rounded-3 shadow">
          <div class="card-body">
            <h4 class="fw-bold mb-4">EDIT PRODUCT</h4>
            <form @submit.prevent="updateProduct">
              <div class="mb-3">
                <label class="form-label fw-bold">Name</label>
                <input
                  type="text"
                  v-model="name"
                  class="form-control"
                  placeholder="Title Product"
                />
                <div v-if="errors.name" class="alert alert-danger mt-2">
                  {{ errors.name[0] }}
                </div>
              </div>

              <div class="mb-3">
                <label class="form-label fw-bold">Category</label>
                <select v-model="id_kategori" class="form-control">
                  <option value="" disabled>-- Pilih Kategori --</option>
                  <option
                    v-for="cat in categories"
                    :key="cat.id"
                    :value="cat.id"
                  >
                    {{ cat.kategori || cat.nama || cat.name }}
                  </option>
                </select>
                <div v-if="errors.id_kategori" class="alert alert-danger mt-2">
                  {{ errors.id_kategori[0] }}
                </div>
              </div>

              <div class="row">
                <div class="col-md-6">
                  <div class="mb-3">
                    <label class="form-label fw-bold">Price</label>
                    <input
                      type="number"
                      v-model="price"
                      class="form-control"
                      placeholder="Price Product"
                    />
                    <div v-if="errors.price" class="alert alert-danger mt-2">
                      {{ errors.price[0] }}
                    </div>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="mb-3">
                    <label class="form-label fw-bold">Stock</label>
                    <input
                      type="number"
                      v-model="stock"
                      class="form-control"
                      placeholder="Stock Product"
                    />
                    <div v-if="errors.stock" class="alert alert-danger mt-2">
                      {{ errors.stock[0] }}
                    </div>
                  </div>
                </div>
              </div>

              <div class="mb-3">
                <label class="form-label fw-bold">Description</label>
                <textarea
                  v-model="description"
                  class="form-control"
                  rows="5"
                  placeholder="Description Product"
                ></textarea>
                <div v-if="errors.description" class="alert alert-danger mt-2">
                  {{ errors.description[0] }}
                </div>
              </div>

              <div class="d-flex gap-2">
                <button
                  type="submit"
                  class="btn btn-md btn-primary rounded-3 shadow border-0"
                >
                  Update
                </button>
                <router-link
                  to="/products"
                  class="btn btn-md btn-secondary rounded-3 shadow border-0"
                >
                  Cancel
                </router-link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>