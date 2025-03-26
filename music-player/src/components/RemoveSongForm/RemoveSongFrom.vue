<template>
    <div v-if="isOpen" class="modal">
      <div class="modal-content">
        <h2>Удалить трек</h2>
        <select v-model="selectedSong">
          <option v-for="song in store.songs" :key="song.id" :value="song.id">
            {{ song.name }} - {{ song.artist }}
          </option>
        </select>
        <div class="modal-buttons">
            <button class="confirm-button" @click="removeSong">Удалить</button>
            <button class="cancel-button" @click="closeForm">Отмена</button>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref } from "vue";
  import { useMusicStore } from "../../store/musicStore";
  
  const store = useMusicStore();
  const isOpen = ref(false);
  const selectedSong = ref("");
  
  const removeSong = () => {
    store.removeSong(selectedSong.value);
    closeForm();
  };
  
  const closeForm = () => {
    isOpen.value = false;
  };
  
  defineExpose({ isOpen });
  </script>

<style scoped>
@import './style.css'
</style>