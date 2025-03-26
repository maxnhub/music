<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useMusicStore } from "./store/musicStore";
import MusicPlayer from "./components/MusicPlayer/MusicPlayer.vue";
import MusicSong from "./components/MusicSong/MusicSong.vue";
import LibrarySong from "./components/LibrarySong/LibrarySong.vue";
import AddSongForm from "./components/AddSongForm/AddSongForm.vue";
import RemoveSongForm from "./components/RemoveSongForm/RemoveSongFrom.vue";

const store = useMusicStore();
const audioRef = ref<HTMLAudioElement | null>(null);
const addSongRef = ref();
const removeSongRef = ref();

onMounted(() => {
  store.audioRef = audioRef.value;
  store.setCurrentSong(store.currentSong);
});
</script>

<template>
  <div class="app">
    <nav class="navbar">
      <h1 class="navbar__title">Electronic Music Player</h1>
      <button class="btn btn--library" @click="store.toggleLibraryStatus">
        <h4>Library</h4>
      </button>
    </nav>

    <div class="content">
      <div class="main-content">
        <MusicSong :current-song="store.currentSong" />
        <MusicPlayer />
      </div>

      <div class="library" :class="{ 'library--active': store.libraryStatus }">
        <h2 class="library__heading">Library</h2>
        <div class="library__songs">
          <LibrarySong v-for="song in store.songs" :key="song.id" :song="song" />
        </div>
      </div>
      <button class="btn-control btn-control--add-button" @click="addSongRef.isOpen = true">Добавить трек</button>
      <button class="btn-control btn-control--delete-button" @click="removeSongRef.isOpen = true">Удалить трек</button>
    </div>

    <AddSongForm ref="addSongRef" />
    <RemoveSongForm ref="removeSongRef" />
    <audio ref="audioRef"
      @timeupdate="store.updateSongInfo({ currentTime: $event.target.currentTime, duration: $event.target.duration })" />
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap');

@import './styles/main.css'
</style>