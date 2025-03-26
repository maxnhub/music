<script setup lang="ts">
import { defineProps } from "vue";
import { useMusicStore } from "../../store/musicStore";

const store = useMusicStore();
defineProps<{ song: any }>();
</script>

<template>
  <div class="library-song" :class="{ 'library-song--active': song.active }" @click="store.setCurrentSong(song)">
    <img :src="song.cover" alt="Cover" />
    <div>
      <h3>{{ song.name }}</h3>
      <h4>{{ song.artist }}</h4>
    </div>
  </div>
</template>

<style scoped>
@import './style.css'
</style>