<script setup lang="ts">
    import { ref, reactive } from "vue";
    import { useRouter } from "vue-router";
    import Api from "../../api";

    const email = ref("");
    const password = ref("");
    const router = useRouter();

    // Untuk menampung error validasi lokal (client-side)
    const errors = reactive({
        email: "",
        password: ""
    });

    // Untuk menampung pesan error dari server (Laravel)
    const serverError = ref("");
    const loading = ref(false);

    // Fungsi Validasi Client-Side
    const validate = () => {
        let isValid = true;
        errors.email = "";
        errors.password = "";
        serverError.value = "";

        if (!email.value) {
            errors.email = "Email wajib diisi!";
            isValid = false;
        } else if (!/\S+@\S+\.\S+/.test(email.value)) {
            errors.email = "Format email tidak valid!";
            isValid = false;
        }

        if (!password.value) {
            errors.password = "Password wajib diisi!";
            isValid = false;
        } else if (password.value.length < 6) {
            errors.password = "Password minimal 6 karakter!";
            isValid = false;
        }

        return isValid;
    };

    const login = async () => {
        // Cek validasi sebelum tembak API
        if (!validate()) return;

        loading.value = true;

        try {
            const response = await Api.post("/api/auth/login", {
                email: email.value,
                password: password.value,
            });

            // Ambil access_token dari response.data.data
            const token = response.data.data.access_token;

            // Simpan token ke localStorage
            localStorage.setItem("token", token);

            router.push("/products");
        } catch (err: any) {
            if (err.response && err.response.data) {
                // Ambil pesan error dari backend (misal "Invalid credentials")
                serverError.value = err.response.data.message || "Login gagal, silakan coba lagi.";
            } else {
                serverError.value = "Gagal terhubung ke server.";
            }
        } finally {
            loading.value = false;
        }
    };
</script>

<template>
    <div class="container mt-5" style="max-width: 400px;">
        <div class="card shadow rounded-4 border-0">
            <div class="card-body p-4">
                <h4 class="card-title text-center mb-4 fw-bold">Login</h4>

                <!-- Alert Error dari Server -->
                <div v-if="serverError" class="alert alert-danger py-2 small" role="alert">
                    {{ serverError }}
                </div>

                <form @submit.prevent="login" novalidate>
                    <!-- Email -->
                    <div class="mb-3">
                        <label class="form-label">Email</label>
                        <input 
                            type="email" 
                            v-model="email" 
                            class="form-control" 
                            :class="{ 'is-invalid': errors.email }"
                            placeholder="nama@email.com"
                        />
                        <div v-if="errors.email" class="invalid-feedback">
                            {{ errors.email }}
                        </div>
                    </div>

                    <!-- Password -->
                    <div class="mb-3">
                        <label class="form-label">Password</label>
                        <input 
                            type="password" 
                            v-model="password" 
                            class="form-control" 
                            :class="{ 'is-invalid': errors.password }"
                            placeholder="Masukkan password"
                        />
                        <div v-if="errors.password" class="invalid-feedback">
                            {{ errors.password }}
                        </div>
                    </div>

                    <!-- Button Submit -->
                    <button type="submit" class="btn btn-warning w-100 fw-semibold" :disabled="loading">
                        <span v-if="loading" class="spinner-border spinner-border-sm me-1"></span>
                        {{ loading ? 'Memproses...' : 'Login' }}
                    </button>
                </form>
            </div>
        </div>
    </div>
</template>