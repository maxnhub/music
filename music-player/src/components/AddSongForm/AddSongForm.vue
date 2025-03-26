<template>
    <div v-if="isOpen" class="modal">
        <div class="modal-content">
            <h2>Добавить трек</h2>
            <form @submit.prevent="submitForm">
                <label>Название:</label>
                <input v-model="song.name" required />

                <label>Исполнитель:</label>
                <input v-model="song.artist" required />

                <label>Обложка (URL):</label>
                <input v-model="song.cover" required />

                <label>Путь к файлу:</label>
                <input v-model="song.audio" required />

                <div class="modal-buttons">
                    <button class="confirm-button" type="submit">Добавить</button>
                    <button class="cancel-button" type="button" @click="closeForm">Отмена</button>
                </div>
            </form>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useMusicStore } from "../../store/musicStore";

const store = useMusicStore();
const isOpen = ref(false);

const song = ref({
    name: "",
    artist: "",
    cover: "",
    audio: "",
    color: [`#${Math.floor(Math.random() * 16777215).toString(16)}, #${Math.floor(Math.random() * 16777215).toString(16)}`],
    active: false
});

const submitForm = () => {
    store.addSong(song.value);
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