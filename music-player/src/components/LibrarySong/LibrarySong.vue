<script setup lang="ts">
import { defineProps } from "vue";
import { useMusicStore } from "../../store/musicStore";

const store = useMusicStore();
defineProps<{ song: any }>();
</script>

<template>
  <div class="library-song" :class="{ 'library-song--active': song.active }" @click="store.setCurrentSong(song)">
    <img :src="song.cover" alt="Cover" />
    <div class="library-song__info">
      <h3>{{ song.name }}</h3>
      <h4>{{ song.artist }}</h4>
      <div class="library-song__details">
        <div class="library-song__detail"><strong>BPM:</strong> {{ song.bpm }}</div>
        <div class="library-song__detail"><strong>Key:</strong> {{ song.key }}</div>
        <div class="library-song__detail"><strong>Genre:</strong> {{ song.genre }}</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import './style.css'
</style>