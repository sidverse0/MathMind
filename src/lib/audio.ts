
'use client';

export type SoundEffect =
  | 'click'
  | 'correct'
  | 'incorrect'
  | 'timeup'
  | 'summary'
  | 'flash';

const soundUrls: Record<SoundEffect, string> = {
  click: 'https://files.catbox.moe/c16b32.mp3',
  correct: 'https://files.catbox.moe/h60k3t.mp3',
  incorrect: 'https://files.catbox.moe/r4z5xi.mp3',
  timeup: 'https://files.catbox.moe/ag319k.mp3',
  summary: 'https://files.catbox.moe/e5b32n.mp3',
  flash: 'https://files.catbox.moe/s73r7t.mp3',
};

// Use a simple cache to avoid re-creating Audio objects
const audioCache: { [key in SoundEffect]?: HTMLAudioElement } = {};

export function playSound(sound: SoundEffect) {
    if (typeof window === 'undefined') {
        return; // Don't run on server
    }

    try {
        let audio = audioCache[sound];

        if (!audio) {
            // Create and cache the audio object on first play
            audio = new Audio(soundUrls[sound]);
            audio.load();
            audioCache[sound] = audio;
        }

        // Rewind and play
        audio.currentTime = 0;
        audio.play().catch(error => {
            // Autoplay was prevented. This is common before the first user interaction.
            // console.warn(`Could not play sound '${sound}':`, error);
        });
    } catch (e) {
        console.error(`Error playing sound '${sound}':`, e);
    }
}
