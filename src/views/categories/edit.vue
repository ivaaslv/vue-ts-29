<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import Api from "../../api";

interface Errors {
  kategori?: string[];
}

const kategori = ref("");
const errors = ref<Errors>({});

const route = useRoute();
const router = useRouter();

// Fetch detail kategori berdasarkan ID dari route parameter
const fetchDetailCategory = async () => {
  try {
    const response = await Api.get(`/api/kategori/${route.params.id}`);
    const data = response.data.data || response.data;
    kategori.value = data.kategori || data.name || data.nama;
  } catch (error) {
    console.error("Error fetching category:", error);
  }
};

onMounted(() => {
  fetchDetailCategory();
});

// Update data kategori
const updateCategory = async () => {
  try {
    await Api.put(`/api/kategori/${route.params.id}`, {
      kategori: kategori.value,
    });
    router.push("/categories");
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
            <h4 class="fw-bold mb-4">EDIT CATEGORY</h4>
            <form @submit.prevent="updateCategory">
              <div class="mb-3">
                <label class="form-label fw-bold">Category Name</label>
                <input
                  type="text"
                  v-model="kategori"
                  class="form-control"
                  placeholder="Enter category name"
                />
                <div v-if="errors.kategori" class="alert alert-danger mt-2">
                  {{ errors.kategori[0] }}
                </div>
              </div>

              <div class="d-flex gap-2">
                <button type="submit" class="btn btn-md btn-primary rounded-3 shadow border-0">
                  Update
                </button>
                <router-link to="/categories" class="btn btn-md btn-secondary rounded-3 shadow border-0">
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