<template>
  <div class="music-player">
    <div class="time-control">
      <p class="time-control__current">{{ getTime(songInfo.currentTime) }}</p>
      <div class="track">
        <div class="track__bar" :style="{ background: trackBackground }">
          <input
            type="range"
            min="0"
            :max="songInfo.duration || 0"
            :value="songInfo.currentTime"
            @input="dragHandler"
            class="track__input"
          />
          <div class="track__animate" :style="trackAnim"></div>
        </div>
      </div>
      <p class="time-control__total">
        {{ songInfo.duration ? getTime(songInfo.duration) : '00:00' }}
      </p>
    </div>
    <div class="play-control">
      <FontAwesomeIcon
        @click="skipTrackHandler('skip-back')"
        size="2x"
        class="play-controlbutton play-controlbutton--skip-back"
        :icon="faAngleLeft"
      />
      <FontAwesomeIcon
        @click="playSongHandler"
        size="2x"
        class="play-controlbutton play-controlbutton--play"
        :icon="faPlay"
      />
      <FontAwesomeIcon
        @click="pauseSongHandler"
        size="2x"
        class="play-controlbutton play-controlbutton--pause"
        :icon="faPause"
      />
      <FontAwesomeIcon
        @click="skipTrackHandler('skip-forward')"
        size="2x"
        class="play-controlbutton play-controlbutton--skip-forward"
        :icon="faAngleRight"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, defineProps, defineEmits } from "vue";
import { faPlay, faAngleLeft, faAngleRight, faPause } from "@fortawesome/free-solid-svg-icons";

// Определение интерфейсов
interface Song {
  id: string;
  name: string;
  artist: string;
  cover: string;
  audio: string;
  active: boolean;
  color: string[];
}

interface SongInfo {
  currentTime: number;
  duration: number;
}

interface Props {
  currentSong: Song;
  isPlaying: boolean;
  songInfo: SongInfo;
  songs: Song[];
  audioRef: HTMLAudioElement | null;
}

interface Emits {
  (event: "updateAudioCurrentTime", time: number): void;
  (event: "pauseAudio"): void;
  (event: "playAudio"): void;
  (event: "setCurrentSong", song: Song): void;
  (event: "updateSongs", songs: Song[]): void;
  (event: "updatePlayingStatus", status: boolean): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

// Форматирование времени
const getTime = (time: number): string => {
  const minutes = Math.floor(time / 60);
  const seconds = ("0" + Math.floor(time % 60)).slice(-2);
  return `${minutes}:${seconds}`;
};

// Обновление текущего времени аудио
const dragHandler = (e: Event) => {
  const target = e.target as HTMLInputElement;
  emit("updateAudioCurrentTime", Number(target.value));
};

// Функция воспроизведения
const playSongHandler = async () => {
  if (!props.audioRef) return;

  try {
    await props.audioRef.play();
    emit("updatePlayingStatus", true);
  } catch (error) {
    console.warn("Автовоспроизведение заблокировано", error);
  }
};

// Функция паузы
const pauseSongHandler = () => {
  if (!props.audioRef) return;
  props.audioRef.pause();
  emit("updatePlayingStatus", false);
};

// Фон трек-бара
const trackBackground = computed(() => {
  return `linear-gradient(to right, ${props.currentSong.color[0]}, ${props.currentSong.color[1]})`;
});

// Анимация трек-бара
const trackAnim = computed(() => {
  const percentage = (props.songInfo.currentTime / props.songInfo.duration) * 100 || 0;
  return { width: `${percentage}%` };
});

// Функция переключения треков
const skipTrackHandler = (direction: "skip-back" | "skip-forward") => {
  let currentIndex = props.songs.findIndex((song) => song.id === props.currentSong.id);
  
  if (direction === "skip-forward") {
    const nextSong = props.songs[(currentIndex + 1) % props.songs.length];
    emit("setCurrentSong", nextSong);
    updateActiveSong(nextSong);
  } else if (direction === "skip-back") {
    const prevSong = currentIndex === 0 ? props.songs[props.songs.length - 1] : props.songs[currentIndex - 1];
    emit("setCurrentSong", prevSong);
    updateActiveSong(prevSong);
  }

  // Останавливаем старый трек перед переключением
  if (props.audioRef) {
    props.audioRef.pause();
    props.audioRef.currentTime = 0;
  }

  // Запускаем новый трек, если плеер в режиме воспроизведения
  if (props.isPlaying) {
    playSongHandler();
  }
};

// Обновление активного трека в списке
const updateActiveSong = (selectedSong: Song) => {
  const updatedSongs = props.songs.map((song) =>
    song.id === selectedSong.id ? { ...song, active: true } : { ...song, active: false }
  );
  emit("updateSongs", updatedSongs);
};
</script>

<style scoped>
.music-player {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 500px;
}

.time-control {
  display: flex;
  align-items: center;
  width: 100%;
  justify-content: space-between;
  padding: 1rem;
}

.time-control__current,
.time-control__total {
  font-size: 1rem;
}

.track {
  flex: 1;
  display: flex;
  align-items: center;
  position: relative;
}

.track__bar {
  width: 100%;
  height: 8px;
  border-radius: 4px;
  overflow: hidden;
}

.track__input {
  width: 100%;
  appearance: none;
  background: transparent;
  cursor: pointer;
  position: absolute;
  top: -6px;
}

.track__animate {
  height: 8px;
  background: #fff;
  transition: width 0.1s ease-in-out;
}

.play-controlbutton {
  border: 3px solid black; /* Чёрный бортик */
  border-radius: 50%; /* Делаем кнопку круглой */
  padding: 12px; /* Увеличиваем область вокруг иконки */
  background-color: white; /* Белый фон для контраста */
  display: flex;
  justify-content: center;
  align-items: center;
  width: 50px; /* Одинаковый размер кнопок */
  height: 50px;
  transition: transform 0.2s ease, background-color 0.3s ease;
}

.play-controlbutton:hover {
  background-color: lightgray; /* Подсветка при наведении */
  transform: scale(1.1); /* Лёгкое увеличение */
}

.play-control {
  display: flex;
  justify-content: center;
  gap: 15px; /* Равномерные отступы между кнопками */
}

.play-controlbutton--skip-back,
.play-controlbutton--skip-forward {
  opacity: 0.8;
}
</style>