<template>
  <div class="h-screen w-full bg-[url('@/assets/login-bg.jpg')] bg-cover sm:bg-center bg-right">
    <div class="flex h-full flex-col justify-center mobile:items-center p-4 sm:p-16">
      <div class="w-full rounded-lg bg-base-300/70 backdrop-blur-xl p-4 shadow-xl sm:max-w-md">
        <img
          class="mx-auto py-4"
          src="@/assets/sabot-logo.png"
          alt="sabot-logo"
          width="200"
          height="auto"
        />
        <form class="flex flex-col gap-6" action="#">
          <!-- <h1 class="text-2xl font-bold text-primary mx-auto">SabotAI</h1> -->

          <span v-if="loginError" class="text-error">{{ loginError }}</span>

          <form-text-field
            v-model="user.userEmail"
            name="Email"
            label="Email"
            placeholder="name@example.com"
            @blur="v$.user.userEmail.$touch()"
            :error="emailError"
          >
          </form-text-field>

          <form-text-field
            v-model="user.password"
            :type="isPasswordVisible ? 'text' : 'password'"
            name="Password"
            label="Password"
            @click:append="isPasswordVisible = !isPasswordVisible"
            :append-icon="isPasswordVisible ? 'eye-slash' : 'eye'"
            placeholder="•••••••••"
            @blur="v$.user.password.$touch()"
            :error="passwordError"
          >
          </form-text-field>

          <button
            @click.prevent="handleLogin"
            type="submit"
            :class="isLoading ? 'loading' : ''"
            class="btn-primary btn-block btn"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import FormTextField from '@/components/FormTextField.vue';

import useVuelidate from '@vuelidate/core';
import { required, email, helpers } from '@vuelidate/validators';

import authService from '@/services/auth.service.js';

export default {
  components: {
    FormTextField,
  },
  data() {
    return {
      v$: useVuelidate(),
      user: {
        userEmail: '',
        password: '',
      },
      isPasswordVisible: false,
      isLoading: false,
      loginError: '',
    };
  },
  methods: {
    async handleLogin() {
      this.v$.$touch();
      const isValid = await this.v$.$validate();

      if (!isValid) return;

      this.isLoading = true;

      try {
        const { userEmail, password } = this.user;
        await authService.login(userEmail, password);

        this.$router.push({
          name: 'Dashboard',
        });
      } catch (error) {
        this.loginError = error.message;
      }

      this.isLoading = false;
    },
  },
  computed: {
    emailError() {
      const errors = this.v$.user.userEmail.$errors;

      if (errors.length > 0) {
        return errors[0].$message;
      }

      return '';
    },
    passwordError() {
      const errors = this.v$.user.password.$errors;

      if (errors.length > 0) {
        return errors[0].$message;
      }

      return '';
    },
  },
  validations() {
    return {
      user: {
        userEmail: {
          required: helpers.withMessage('Email is required', required),
          email: helpers.withMessage('Invalid email', email),
        },
        password: {
          required: helpers.withMessage('Password is required', required),
        },
      },
    };
  },
};
</script>
