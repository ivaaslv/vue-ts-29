<script setup lang="ts">
    import { ref } from "vue";
    import { useRouter } from "vue-router";
    import Api from "../../api";

    const email = ref("");
    const password = ref("");
    const error = ref<any>({});
    const router = useRouter;

    const login = async() => {
        try {
            const response = await Api.post("/api/login", {
                email: email.value,
                password: password.value,
            });

            // Simpan token ke localstorage
            localStorage.setItem("token", response.data.token);
            localStorage.setItem("user", JSON.stringify(response.data.user));

            router.push("/products");
        } catch (error: any) {
            if (error.response && error.response.data) {
                errors.value = error.response.data;
            }
        }
    };
</script>

<template>
    <div class="container mt-5" style="max-width: 400px;">
        <div class="card shadow rounded-4 border-0">
            <div class="card-body">
                <h4 class="card-title text-center mb-4">Login</h4>
                <form @submit.prevent="login">
                    <div class="mb-3">
                        <label class="form-label">Email</label>
                        <input type="email" v-model="email" class="form-control" required/>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Password</label>
                        <input type="password" v-model="password" class="form-control" required/>
                    </div>
                    <button type="submit" class="btn btn-warning w-100">Login</button>
                </form>
            </div>
        </div>
    </div>
</template>