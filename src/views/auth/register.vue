<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import Api from '../../api';

// state input
const name = ref("");
const email = ref("");
const password = ref("");
const password_confirmation = ref("");

// Interface untuk menampung error validasi dari Laravel
interface Errors {
    name?: string[];
    email?: string[];
    password?: string[];
}

// Perbaikan 1: Gunakan 'errors' pakai 's' dan tipe Interface Errors
const errors = ref<Errors>({});

// Perbaikan 2: Tambahkan () pada useRouter
const router = useRouter();

const register = async () => {
    errors.value = {};

    try {
        await Api.post("/api/auth/register", {
            name: name.value,
            email: email.value,
            password: password.value,
            password_confirmation: password_confirmation.value
        });

        alert("Registrasi berhasil, silahkan login!");

        router.push("/auth/login");
    } catch (err: any) {
        if (err.response && err.response.data) {
            errors.value = err.response.data.errors || err.response.data; 
        }
    }
}
</script>

<template>
    <div class="container mt-5" style="max-width: 400px;">
        <div class="card shadow rounded-3 border-0">
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
                    </div>
                    <button type="submit" class="btn btn-warning w-100">Register</button>
                </form>
            </div>
        </div>
    </div>
</template>