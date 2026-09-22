<script setup lang="ts">
// import ref dan onMounted dari vue
import { ref, onMounted } from "vue";

// import useRouter dari vue-router
import { useRouter } from "vue-router";

// import Api dari folder api
import Api from "../../api";

// Interface untuk Kategori
interface Category {
    id: number;
    kategori?: string;
    nama?: string;
    name?: string;
}

// Interface Errors
interface Errors {
    name?: string[];
    price?: string[];
    description?: string[];
    stock?: string[];
    id_kategori?: string[];
}

// State untuk form
const name = ref("");
const price = ref("");
const description = ref("");
const stock = ref("");
const id_kategori = ref("");

// State untuk menyimpan list kategori dari API
const categories = ref<Category[]>([]);

// State untuk error
const errors = ref<Errors>({});

// Router instance
const router = useRouter();

// Function untuk fetch list kategori dari API
const fetchCategories = async () => {
    try {
        const response = await Api.get("/api/kategori");
        // Menyesuaikan struktur data response dari API (misal response.data.data atau response.data)
        categories.value = response.data.data || response.data;
    } catch (error) {
        console.error("Gagal mengambil data kategori:", error);
    }
};

// Jalankan fetchCategories saat komponen dimuat
onMounted(() => {
    fetchCategories();
});

// Handle submit form
const storeProduct = async () => {
    // inisialisasi form data
    const formData = new FormData();

    // append data ke form data
    formData.append("name", name.value);
    formData.append("price", price.value);
    formData.append("description", description.value);
    formData.append("stock", stock.value);
    formData.append("id_kategori", id_kategori.value);

    try {
        // send data ke api
        await Api.post("/api/products", formData);

        // redirect ke halaman products
        router.push("/products");
    } catch (error: any) {
        // set error ke state
        if (error.response && error.response.data) {
            errors.value = error.response.data;
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
                        <form @submit.prevent="storeProduct">

                            <div class="mb-3">
                                <label class="form-label fw-bold">Name</label>
                                <input type="text" v-model="name" class="form-control" placeholder="Title Product" required/>
                                <div v-if="errors.name" class="alert alert-danger mt-2">{{ errors.name[0] }}</div>
                            </div>

                            <div class="mb-3">
                                <label class="form-label fw-bold">Category</label>
                                <select v-model="id_kategori" class="form-control" required>
                                    <option value="" disabled>-- Pilih Kategori --</option>
                                    <option 
                                        v-for="cat in categories" 
                                        :key="cat.id" 
                                        :value="cat.id"
                                    >
                                        {{ cat.kategori || cat.nama || cat.name }}
                                    </option>
                                </select>
                                <div v-if="errors.id_kategori" class="alert alert-danger mt-2">{{ errors.id_kategori[0] }}</div>
                            </div>

                            <div class="row">
                                <div class="col-md-6">
                                    <div class="mb-3">
                                        <label class="form-label fw-bold">Price</label>
                                        <input type="number" v-model="price" class="form-control" placeholder="Price Product" required />
                                        <div v-if="errors.price" class="alert alert-danger mt-2">{{ errors.price[0] }}</div>
                                    </div>
                                </div>

                                <div class="col-md-6">
                                    <div class="mb-3">
                                        <label class="form-label fw-bold">Stock</label>
                                        <input type="number" v-model="stock" class="form-control" placeholder="Stock Product" required/>
                                        <div v-if="errors.stock" class="alert alert-danger mt-2">{{ errors.stock[0] }}</div>
                                    </div>
                                </div>
                            </div>

                            <div class="mb-3">
                                <label class="form-label fw-bold">Description</label>
                                <textarea v-model="description" class="form-control" rows="5" placeholder="Description Product"></textarea>
                                <div v-if="errors.description" class="alert alert-danger mt-2">{{ errors.description[0] }}</div>
                            </div>

                            <div>
                                <button type="submit" class="btn btn-md btn-primary rounded-3 shadow border-0">Create Product</button>
                                <router-link to="/products" class="btn btn-md btn-secondary rounded-3 shadow border-0 mx-2">
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