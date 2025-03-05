<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import MusicPlayer from './components/MusicPlayer/MusicPlayer.vue';
import MusicSong from './components/MusicSong/MusicSong.vue';
import LibrarySong from './components/LibrarySong/LibrarySong.vue';
import musicHost from './data';

// 🎵 Ссылки и состояния
const audioRef = ref<HTMLAudioElement | null>(null);
const isPlaying = ref<boolean>(false);
const libraryStatus = ref<boolean>(false);
const currentSong = ref(musicHost()[0]);
const songs = reactive(musicHost());

const songInfo = reactive({
  currentTime: 0,
  duration: 0,
  animationPercentage: 0
});

// 📌 Функции управления
const toggleLibraryStatus = () => (libraryStatus.value = !libraryStatus.value);
const setLibraryStatus = (status: boolean) => (libraryStatus.value = status);
const setIsPlaying = (status: boolean) => (isPlaying.value = status);

const setCurrentSong = (song: any) => {
  currentSong.value = song;

  fetch(song.audio)
  .then((response) => {
    if (!response.ok) {
      throw new Error(`Ошибка загрузки аудиофайла: ${response.statusText}`);
    }
    console.log("Аудиофайл доступен:", song.audio);
    audioRef.value!.src = song.audio;
    audioRef.value!.load();
    playAudio();
  })
  .catch((error) => console.error(error));

  if (audioRef.value) {
    console.log("Устанавливаем новый источник:", song.audio);
    audioRef.value.src = song.audio;
    audioRef.value.load();
    playAudio(); // <-- Добавляем автоматическое воспроизведение
  }
};

const setSongs = (updatedSongs: any[]) => {
  Object.assign(songs, updatedSongs);
};

const updateSongInfo = (newInfo: { currentTime: number; duration: number; animationPercentage: number }) => {
  songInfo.currentTime = newInfo.currentTime;
  songInfo.duration = newInfo.duration;
  songInfo.animationPercentage = newInfo.animationPercentage;
};

// ⏳ Обработчик обновления времени
const timeUpdateHandler = (e: Event) => {
  const target = e.target as HTMLAudioElement;
  const { currentTime, duration } = target;

  if (!duration) return;

  updateSongInfo({
    currentTime,
    duration,
    animationPercentage: Math.round((currentTime / duration) * 100)
  });
};

// ▶️ / ⏸️ Управление аудио
const playAudio = async () => {
  if (!audioRef.value) {
    console.error("audioRef не инициализирован!");
    return;
  }
  try {
    console.log("Попытка воспроизведения:", audioRef.value.src);
    await audioRef.value.play();
  } catch (error) {
    console.error("Ошибка воспроизведения:", error);
  }
};

const pauseAudio = () => audioRef.value?.pause();

console.log("Checking URL:", currentSong.value.audio);

const setAudioSource = (source: string) => {
  if (!audioRef.value) return;

  const fixedSource = `/assets/${source.split('/').pop()}`; // Исправляем путь
  console.log("Используемый путь:", fixedSource);

  fetch(fixedSource)
    .then((response) => {
      if (!response.ok) throw new Error(`Ошибка загрузки аудиофайла: ${response.statusText}`);
      audioRef.value!.src = fixedSource;
      audioRef.value!.load();
    })
    .catch(console.error);
};

const updateAudioCurrentTime = (time: number) => {
  if (audioRef.value) {
    audioRef.value.currentTime = time;
  }
};

// 🔄 Устанавливаем начальный трек при загрузке
onMounted(() => {
  if (audioRef.value) {
    console.log("Инициализация аудиофайла:", currentSong.value.audio);
    audioRef.value.src = currentSong.value.audio;
  } else {
    console.error("audioRef не найден");
  }
});
</script>

<template>
  <div class="app">
    <nav class="navbar">
      <h1 class="navbar__title">Electronic Music Player</h1>
      <button class="btn btn--library" @click="toggleLibraryStatus">
        <h4>Library</h4>
      </button>
    </nav>

    <div class="content">
      <div class="main-content">
        <MusicSong :current-song="currentSong" />
        <MusicPlayer
          :id="currentSong.id"
          :songs="songs"
          :song-info="songInfo"
          @update-song-info="updateSongInfo"
          :audio-ref="audioRef"
          :is-playing="isPlaying"
          @set-is-playing="setIsPlaying"
          :current-song="currentSong"
          @set-current-song="setCurrentSong"
          @set-songs="setSongs"
          @pauseAudio="pauseAudio"
          @playAudio="playAudio"
          @setAudioSource="setAudioSource"
          @updateAudioCurrentTime="updateAudioCurrentTime"
        />
      </div>

      <div class="library" :class="{ 'library--active': libraryStatus }">
        <h2 class="library__heading">Library</h2>
        <div class="library__songs">
          <LibrarySong
            v-for="song in songs"
            :key="song.id"
            :song="song"
            :library-status="libraryStatus"
            :is-playing="isPlaying"
            :set-songs="setSongs"
            :audio-ref="audioRef"
            :songs="songs"
            :set-current-song="setCurrentSong"
            @pauseAudio="pauseAudio"
            @playAudio="playAudio"
            @setAudioSource="setAudioSource"
          />
        </div>
      </div>
    </div>

    <audio ref="audioRef" @timeupdate="timeUpdateHandler" @loadedmetadata="timeUpdateHandler" />
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap');

@import './styles/main.css'

</style>