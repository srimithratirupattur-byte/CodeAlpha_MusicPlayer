const audio = document.getElementById("audio");

const playBtn = document.getElementById("play");
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");

const songTitle = document.getElementById("song-title");
const artistName = document.getElementById("artist-name");
const coverImage = document.getElementById("cover-image");

const progress = document.getElementById("progress");
const currentTime = document.getElementById("current-time");
const duration = document.getElementById("duration");
const volume = document.getElementById("volume");
const playlist = document.getElementById("playlist");

const songs = [
    {
        title: "Song 1",
        artist: "Unknown Artist",
        src: "songs/song1.mp3",
        cover: "covers/cover1.jpg"
    },
    {
        title: "Song 2",
        artist: "Unknown Artist",
        src: "songs/song2.mp3",
        cover: "covers/cover2.jpg"
    },
    {
        title: "Song 3",
        artist: "Unknown Artist",
        src: "songs/song3.mp3",
        cover: "covers/cover3.jpg"
    }
];

let songIndex = 0;

function createPlaylist() {
    playlist.innerHTML = "";

    songs.forEach((song, index) => {
        const li = document.createElement("li");

        li.textContent = song.title;
        if (index === songIndex) {
            li.classList.add("active");
        }

        li.addEventListener("click", () => {
            songIndex = index;
            createPlaylist();
            loadSong(songs[songIndex]);
            playSong();
        });

        playlist.appendChild(li);
    });
}

function loadSong(song) {
    songTitle.textContent = song.title;
    artistName.textContent = song.artist;
    audio.src = song.src;
    progress.value = 0;
    currentTime.textContent = "0:00";
    duration.textContent = "0:00";

    coverImage.style.opacity = "0";

    coverImage.onload = () => {
        coverImage.style.opacity = "1";
    };

    coverImage.src = song.cover;
}

function playSong() {
    audio.play()
        .then(() => {
            playBtn.textContent = "⏸️"; 

            document.querySelector(".equalizer").classList.add("playing");  
            coverImage.classList.add("playing");      
        })
        .catch((error) => {
            if (error.name === "AbortError") {
                return;
            }

            console.error("Playback error:", error);
            alert("Unable to play this song. Please check the audio file.");
        });
}

function pauseSong() {
    audio.pause();
    playBtn.textContent = "▶️";

    document.querySelector(".equalizer").classList.remove("playing");
    coverImage.classList.remove("playing");
}

playBtn.addEventListener("click", () => {
    if (audio.paused) {
        playSong();
    } else {
        pauseSong();
    }
});

function previousSong() {
    songIndex--;

    if (songIndex < 0) {
        songIndex = songs.length - 1;
    }

    createPlaylist();
    loadSong(songs[songIndex]);
    playSong();
}

function nextSong() {
    songIndex++;

    if (songIndex >= songs.length) {
        songIndex = 0;
    }

    createPlaylist();
    loadSong(songs[songIndex]);
    playSong();
}

prevBtn.addEventListener("click", previousSong);
nextBtn.addEventListener("click", nextSong);

function updateProgress() {
    if (audio.duration) {
        const progressPercent =
            (audio.currentTime / audio.duration) * 100;

        progress.value = progressPercent;

        let currentMinutes = Math.floor(audio.currentTime / 60);
        let currentSeconds = Math.floor(audio.currentTime % 60);

        currentTime.textContent =
            `${currentMinutes}:${String(currentSeconds).padStart(2, "0")}`;
    }
}

function setProgress() {
    if (audio.duration) {
        audio.currentTime =
            (progress.value / 100) * audio.duration;
    }
}

audio.addEventListener("timeupdate", updateProgress);
progress.addEventListener("input", setProgress);

audio.addEventListener("loadedmetadata", () => {
    let minutes = Math.floor(audio.duration / 60);
    let seconds = Math.floor(audio.duration % 60);

    duration.textContent =
        `${minutes}:${String(seconds).padStart(2, "0")}`;
});

volume.addEventListener("input", () => {
    audio.volume = volume.value;
});

audio.addEventListener("ended", nextSong);

loadSong(songs[songIndex]);
createPlaylist();