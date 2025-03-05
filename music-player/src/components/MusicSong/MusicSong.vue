<template>
  <div class="music-song">
    <img 
      :src="currentSong.cover" 
      :alt="`Cover art for ${currentSong.name}`" 
      class="music-song__cover" 
    />
    <h2 class="music-song__title">{{ currentSong.name }}</h2>
    <h3 class="music-song__artist">{{ currentSong.artist }}</h3>
  </div>
</template>

<script setup lang="ts">
// Определение интерфейса для пропсов
interface Song {
  id: string;
  name: string;
  artist: string;
  cover: string;
  audio: string;
  active: boolean;
  color: string[];
}

// Декларативное определение props
defineProps<{ currentSong: Song }>();
</script>

<style scoped>
.music-song {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 2rem;
}

.music-song__cover {
  width: 300px;
  height: 300px;
  object-fit: cover;
  border-radius: 50%;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.music-song__title {
  margin-top: 1.5rem;
  font-size: 2rem;
  font-weight: 600;
  text-align: center;
}

.music-song__artist {
  font-size: 1.5rem;
  color: #666;
  text-align: center;
}
</style>