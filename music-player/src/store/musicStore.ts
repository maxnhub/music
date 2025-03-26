import { defineStore } from "pinia";
import musicData from "../data";

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
  animationPercentage: number;
}

export const useMusicStore = defineStore("music", {
  state: () => ({
    songs: musicData() as Song[],
    currentSong: musicData()[0] as Song,
    isPlaying: false as boolean,
    libraryStatus: false as boolean,
    songInfo: {
      currentTime: 0,
      duration: 0,
      animationPercentage: 0,
    } as SongInfo,
    audioRef: null as HTMLAudioElement | null,
  }),

  actions: {
    setCurrentSong(song: Song) {
      this.currentSong = song;
      this.songs.forEach((s) => (s.active = s.id === song.id));

      if (this.audioRef) {
        this.audioRef.src = song.audio;
        this.audioRef.load();
        if (this.isPlaying) {
          this.playAudio();
        }
      }
    },

    toggleLibraryStatus() {
      this.libraryStatus = !this.libraryStatus;
    },

    setIsPlaying(status: boolean) {
      this.isPlaying = status;
    },

    updateSongInfo(newInfo: Partial<SongInfo>) {
      Object.assign(this.songInfo, newInfo);
    },

    playAudio() {
      if (this.audioRef) {
        this.audioRef.play().catch((error) => console.error("Ошибка воспроизведения:", error));
        this.isPlaying = true;
      }
    },

    pauseAudio() {
      if (this.audioRef) {
        this.audioRef.pause();
        this.isPlaying = false;
      }
    },

    skipTrack(direction: "next" | "prev") {
      let currentIndex = this.songs.findIndex((song) => song.id === this.currentSong.id);
      if (direction === "next") {
        this.setCurrentSong(this.songs[(currentIndex + 1) % this.songs.length]);
      } else {
        this.setCurrentSong(this.songs[currentIndex === 0 ? this.songs.length - 1 : currentIndex - 1]);
      }
    },

    addSong(newSong) {
      this.songs.push({ ...newSong, id: String(this.songs.length) });
    },

    // removeSong(songId) {
    //   this.songs = this.songs.filter(song => song.id !== songId);
    // }

    // addSong(song: Song) {
    //   this.songs.push(song);
    // },

    removeSong(songId: string) {
      this.songs = this.songs.filter((song) => song.id !== songId);
      if (this.currentSong.id === songId) {
        this.setCurrentSong(this.songs[0]);
      }
    },
  },
});