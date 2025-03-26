<script setup lang="ts">
import { ref } from "vue";
import { useMusicStore } from "../../store/musicStore";
import { faPlay, faPause, faAngleLeft, faAngleRight } from "@fortawesome/free-solid-svg-icons";

const store = useMusicStore();
const progressBar = ref<HTMLElement | null>(null);

// Функция для форматирования времени в "MM:SS"
const formatTime = (time: number): string => {
  if (!time) return "00:00";
  const minutes = Math.floor(time / 60);
  const seconds = String(Math.floor(time % 60)).padStart(2, "0");
  return `${minutes}:${seconds}`;
};
// Обработчик клика по прогресс-бару
const setProgress = (e: MouseEvent) => {
  if (!progressBar.value || !store.audioRef) return;

  const rect = progressBar.value.getBoundingClientRect();
  const clickX = e.clientX - rect.left;
  const width = rect.width;
  const newTime = (clickX / width) * store.songInfo.duration;

  store.updateSongInfo({ currentTime: newTime });
  store.audioRef.currentTime = newTime;

  if (store.isPlaying) {
    store.playAudio();
  }
};
</script>

<template>
  <div class="music-player">
    <div class="time-control">
      <p class="time">{{ formatTime(store.songInfo.currentTime) }}</p>
      <div class="track" ref="progressBar" @click="setProgress">
        <div class="track-bar" :style="{ width: (store.songInfo.currentTime / store.songInfo.duration) * 100 + '%' }"></div>
        <input
          type="range"
          min="0"
          :max="store.songInfo.duration || 0"
          :value="store.songInfo.currentTime"
          @input="store.updateSongInfo({ currentTime: Number(($event.target as HTMLInputElement).value) })"
        />
      </div>
      <p class="time">{{ formatTime(store.songInfo.duration) }}</p>
    </div>

    <div class="play-control">
      <FontAwesomeIcon @click="store.skipTrack('prev')" class="control-btn" :icon="faAngleLeft" />
      <FontAwesomeIcon 
        @click="store.isPlaying ? store.pauseAudio() : store.playAudio()" 
        class="control-btn play-btn" 
        :icon="store.isPlaying ? faPause : faPlay" 
      />
      <FontAwesomeIcon @click="store.skipTrack('next')" class="control-btn" :icon="faAngleRight" />
    </div>
  </div>
</template>
<style scoped>
@import './style.css'
</style>