<script setup lang="ts" name="ScreenRecord">
import { ref } from "vue";

const videoEL = ref<HTMLVideoElement>();

const videoStream = ref<MediaStream>();

async function getStream() {
  const constraints: MediaStreamConstraints = {
    audio: false,
    video: {
      /**
       * - mandatory 属性已经过时，并且在现代浏览器中不再使用。
       * - chromeMediaSource 属性指定了要捕获的屏幕类型为“desktop”，这是针对 Chrome 浏览器的属性，无法在其他浏览器中使用。
       * - TypeScript 会报错，因为它不认识这个属性，所以我们需要使用类型断言来告诉 TypeScript 这个属性是存在的。
       */
      mandatory: {
        chromeMediaSource: "desktop",
      },
    } as MediaTrackConstraints, // 在这里使用类型断言
  };
  const stream = navigator.mediaDevices
    .getUserMedia(constraints)
    .then((stream) => {
      videoStream.value = stream;
      videoEL.value!.srcObject = stream;
      videoEL.value!.play();
    })
    .catch((err) => {
      console.log(err);
    });
}

function disconnect() {
  videoStream.value!.getTracks().forEach((track) => {
    track.stop();
  });
}
</script>

<template>
  <div>
    <button @click="getStream">getStream</button>
    <button @click="disconnect">disconnect</button>
    <video ref="videoEL" class="videoEL" autoplay></video>
  </div>
</template>

<style scoped lang="scss">
.videoEL {
  width: 500px;
  height: 200px;
}
</style>
