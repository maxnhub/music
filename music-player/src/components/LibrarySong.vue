<template>
    <div
      class="library-song"
      :class="{ 'library-song--active': song.active }"
      @click="selectSong"
    >
      <img :src="song.cover" alt="Cover art" class="library-song__cover" />
      <div class="library-song__info">
        <h3 class="library-song__title">{{ song.name }}</h3>
        <h4 class="library-song__artist">{{ song.artist }}</h4>
      </div>
      <h4 v-if="isPlaying && song.id === id" class="library-song__playing">
        Playing
      </h4>
    </div>
  </template>
  
<script setup>
import { defineProps, defineEmits } from "vue";

const props = defineProps({
  song: Object,
  libraryStatus: Boolean,
  setLibraryStatus: Function,
  setSongs: Function,
  isPlaying: Boolean,
  setCurrentSong: Function,
  id: String,
});

const emit = defineEmits(["pauseAudio", "setAudioSource", "playAudio"]);

const selectSong = async () => {
  await props.setCurrentSong(props.song);
  if (props.isPlaying) {
    emit("pauseAudio");
    emit("setAudioSource", props.song.audio);
    emit("playAudio");
  }
  props.setLibraryStatus(false);
};
</script>
  
  
  
  <style scoped>
  .library-song {
    display: flex;
    align-items: center;
    padding: 1rem 2rem;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }
  
  .library-song:hover {
    background-color: #f1f1f1;
  }
  
  
  
  .library-song__cover {
    width: 4rem;
    height: 4rem;
    border-radius: 0.5rem;
    margin-right: 1rem;
  }
  
  .library-song__info {
    flex-grow: 1;
  }
  
  .library-song__title {
    font-size: 1.2rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
  }
  
  .library-song__artist {
    font-size: 1rem;
    color: #666;
  }
  
  .library-song__playing {
    font-size: 1rem;
    color: #2ab3bf;
    font-weight: 600;
  }
  </style>