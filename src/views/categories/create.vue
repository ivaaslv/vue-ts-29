<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import Api from "../../api";

// Interface Errors dari Laravel Validation
interface Errors {
    kategori?: string[];
}

// State untuk form input kategori
const kategori = ref("");

// State untuk menyimpan pesan error
const errors = ref<Errors>({});

// Instance Router
const router = useRouter();

// Handle submit form untuk menyimpan kategori baru
const storeCategory = async () => {
    try {
        // Kirim request POST ke endpoint API kategori
        await Api.post("api/kategori", {
            kategori: kategori.value,
        });

        // Redirect kembali ke halaman daftar kategori jika berhasil
        router.push("/categories");
    } catch (error: any) {
        // Tangkap error validasi dari backend Laravel
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
                        <h4 class="fw-bold mb-4">ADD NEW CATEGORY</h4>
                        <form @submit.prevent="storeCategory">

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
                                    Save Category
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