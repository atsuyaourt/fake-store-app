<template>
  <v-card class="mx-auto">
    <v-layout>
      <app-bar></app-bar>

      <v-main>
        <v-container fluid>
          <router-view />
        </v-container>
      </v-main>
    </v-layout>
  </v-card>
</template>
