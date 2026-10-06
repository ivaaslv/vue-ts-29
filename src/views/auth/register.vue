<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import Api from '../../api';

// state input
const name = ref("");
const email = ref("");
const password = ref("");
const password_confirmation = ref("");

// Interface untuk menampung error validasi dari Laravel & Client
interface Errors {
    name?: string[];
    email?: string[];
    password?: string[];
    password_confirmation?: string[];
}

const errors = ref<Errors>({});
const router = useRouter();

const register = async () => {
    errors.value = {};

    // --- 1. Validasi Client-Side (Sebelum Hit API) ---
    const localErrors: Errors = {};

    if (!name.value.trim()) {
        localErrors.name = ["Nama wajib diisi."];
    }
    if (!email.value.trim()) {
        localErrors.email = ["Email wajib diisi."];
    }
    if (!password.value) {
        localErrors.password = ["Password wajib diisi."];
    }
    if (password.value !== password_confirmation.value) {
        localErrors.password_confirmation = ["Konfirmasi password tidak cocok."];
    }

    // Jika ada error di client side, hentikan proses register
    if (Object.keys(localErrors).length > 0) {
        errors.value = localErrors;
        return;
    }

    // --- 2. Hit API Register ---
    try {
        await Api.post("/api/auth/register", {
            name: name.value,
            email: email.value,
            password: password.value,
            password_confirmation: password_confirmation.value
        });

        alert("Registrasi berhasil, silahkan login!");
        router.push("/login");
    } catch (err: any) {
        // Handling error bawaan Laravel validation (status code 422)
        if (err.response && err.response.data) {
            errors.value = err.response.data.errors || err.response.data; 
        }
    }
}
</script>

<template>
    <div class="container mt-5" style="max-width: 400px;">
        <div class="card shadow rounded-4 border-0">
            <div class="card-body">
                <h4 class="card-title text-center mb-4">Register</h4>
                <form @submit.prevent="register">
                    <div class="mb-3">
                        <label class="form-label">Name:</label>
                        <input type="text" v-model="name" class="form-control">
                        <div v-if="errors.name" class="alert alert-danger mt-2 p-2 fs-6">
                            {{ errors.name[0] }}
                        </div>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Email:</label>
                        <input type="email" v-model="email" class="form-control">
                        <div v-if="errors.email" class="alert alert-danger mt-2 p-2 fs-6">
                            {{ errors.email[0] }}
                        </div>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Password:</label>
                        <input type="password" v-model="password" class="form-control">
                        <div v-if="errors.password" class="alert alert-danger mt-2 p-2 fs-6">
                            {{ errors.password[0] }}
                        </div>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Confirm Password:</label>
                        <input type="password" v-model="password_confirmation" class="form-control">
                        <div v-if="errors.password_confirmation" class="alert alert-danger mt-2 p-2 fs-6">
                            {{ errors.password_confirmation[0] }}
                        </div>
                    </div>
                    <button type="submit" class="btn btn-warning w-100">Register</button>
                </form>
            </div>
        </div>
    </div>
</template>