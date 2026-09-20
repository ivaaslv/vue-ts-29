<script setup lang="ts">
import { ref, onMounted } from "vue";
import Api from "../../api";

interface Category {
  id: number;
  kategori: string;
}

const categories = ref<Category[]>([]);

const fetchDataCategories = async () => {
  try {
    // Cukup dipanggil /kategori tanpa tambahan /api/ di depan
    const response = await Api.get("/api/kategori");

    // Sesuaikan pembacaan objek JSON dari Laravel
    categories.value = response.data.data.data || response.data.data || response.data;
  } catch (error) {
    console.error("Error fetching categories:", error);
  }
};

onMounted(() => {
  fetchDataCategories();
});

const deleteCategory = async (id: number) => {
  if (!confirm("Yakin ingin menghapus kategori ini?")) return;

  try {
    // Samakan endpoint-nya menjadi /kategori/${id}
    await Api.delete(`api/kategori/${id}`);
    fetchDataCategories();
  } catch (error) {
    console.error("Error deleting category:", error);
  }
};
</script>

<template>
    <div class="container mt-5 mb-5">
        <div class="row">
            <div class="col-md-12">
                <!-- Ubah link mengarah ke route kategori -->
                <router-link to="/categories/create" class="btn btn-md btn-warning rounded-4 shadow border-0 mb-3 p-3 fw-bold">
                    ADD NEW CATEGORY +
                </router-link>
                <div class="card border-0 rounded-3 shadow">
                    <div class="card-body">
                        <table class="table table-light rounded-5">
                            <thead class="bg-dark text-black">
                                <tr>
                                    <th scope="col">Name</th>
                                    <th scope="col" style="width: 15%; text-align: center;">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-if="categories.length === 0">
                                    <td colspan="2" class="text-center">
                                        <div class="alert alert-danger mb-0">No data available</div>
                                    </td>
                                </tr>
                                <tr v-for="category in categories" :key="category.id">
                                    <td>{{ category.kategori || category.name || category.nama }}</td>
                                    <td class="text-center">
                                        <router-link :to="`/categories/edit/${category.id}`"
                                            class="btn btn-sm btn-success rounded-3 shadow border-0 me-2">
                                            EDIT
                                        </router-link>
                                        <button @click="deleteCategory(category.id)" class="btn btn-sm btn-danger rounded-3 shadow border-0">
                                            DELETE
                                        </button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>