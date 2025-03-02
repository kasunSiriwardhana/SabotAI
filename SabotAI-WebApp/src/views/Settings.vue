<template>
  <div class="mt-[72px] flex w-full p-4 h-[calc(100vh-66px)] overflow-y-auto">
    <div class="mx-auto w-full lg:w-[720px] flex flex-col gap-8">
      <h1 class="font-bold text-2xl">Settings</h1>

      <div>
        <h2 class="text-lg mb-4">Create New User</h2>
        <form class="flex flex-col gap-6" action="#">
          <span v-if="signupError" class="text-error">{{ signupError }}</span>
          <span v-if="successMsg" class="text-success">{{ successMsg }}</span>

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

          <form-text-field
            v-model="user.confirmPassword"
            :type="isPasswordVisible ? 'text' : 'password'"
            name="Confirm Password"
            label="Confirm Password"
            @click:append="isPasswordVisible = !isPasswordVisible"
            :append-icon="isPasswordVisible ? 'eye-slash' : 'eye'"
            placeholder="•••••••••"
            @blur="v$.user.confirmPassword.$touch()"
            :error="confirmPasswordError"
          >
          </form-text-field>

          <button
            @click.prevent="handleSignup"
            type="submit"
            :class="isLoading ? 'loading' : ''"
            class="btn-outline btn-block btn"
          >
            Create User
          </button>
        </form>
      </div>

      <div class="">
        <h2 class="text-lg mb-4">Existing Users</h2>
        <simple-table
          :headers="headers"
          :items="users"
          @row-click="() => {}"
          :loading="usersLoading"
        ></simple-table>
      </div>

      <div>
        <h2 class="text-lg mb-4">About us</h2>
        <p>
          We believe in the power of creativity, innovation, and unwavering commitment to delivering
          exceptional solutions. Founded with a passion for pushing boundaries and redefining
          industry standards, we wish to emerge as a leader in the Artificial Intelligence industry.
          <br /><br />
          The SabotAI was founded by KAUR Marapana, HKAYD Kodithuwakku, SMKK Siriwardhana & MS
          Dunukewila under the supervision of Prof. Thushara Weerawardane.
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import useVuelidate from '@vuelidate/core';
import { required, email, helpers, sameAs } from '@vuelidate/validators';

import FormTextField from '@/components/FormTextField.vue';
import SimpleTable from '@/components/SimpleTable.vue';

import userService from '@/services/user.service';

export default {
  mounted() {
    this.getUsers();
  },
  components: {
    FormTextField,
    SimpleTable,
  },
  data() {
    return {
      v$: useVuelidate(),
      user: {
        userEmail: '',
        password: '',
        confirmPassword: '',
      },
      isPasswordVisible: false,
      isLoading: false,
      signupError: '',
      successMsg: '',

      headers: [
        {
          text: 'Email',
          value: 'email',
          type: 'data',
        },
        {
          text: 'Created At',
          value: 'createdAt',
          type: 'data',
        },
      ],
      users: [],
      usersLoading: true,
    };
  },
  methods: {
    async getUsers() {
      try {
        const users = await userService.getAllUsers();
        this.users = users;

        this.usersLoading = false;
      } catch (error) {
        console.log(error);
      }
    },
    async handleSignup() {
      this.v$.$touch();
      const isValid = await this.v$.$validate();

      if (!isValid) return;
      this.isLoading = true;

      try {
        await userService.createUser(this.user.userEmail, this.user.password);
        this.isLoading = false;

        this.user.userEmail = '';
        this.user.password = '';
        this.user.confirmPassword = '';

        this.successMsg = 'User created successfully';

        self = this;
        setTimeout(() => {
          self.successMsg = '';
        }, 5000);

        this.v$.$reset();

        this.getUsers();
      } catch (error) {
        console.log(error);
      }

      console.log(this.user);
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
    confirmPasswordError() {
      const errors = this.v$.user.confirmPassword.$errors;

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
        confirmPassword: {
          sameAs: helpers.withMessage('Passwords do not match', sameAs(this.user.password)),
        },
      },
    };
  },
};
</script>
