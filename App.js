import { useEvent } from "expo";
import { useVideoPlayer, VideoView } from "expo-video";
import { useEffect, useRef } from "react";
import { View } from "react-native";
import * as ScreenOrientation from "expo-screen-orientation";

const videoSource =
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";

export default function Video() {
  const playerRef = useRef();

  useEffect(() => {
    // If you want full screen play if the video dimension is correct
    // playerRef?.current?.enterFullscreen();

    // screen lock landscape
    ScreenOrientation.lockAsync(
      ScreenOrientation.OrientationLock.LANDSCAPE
    ).catch((e) => console.log(e));
  }, []);

  const player = useVideoPlayer(videoSource, (player) => {
    player.loop = false;
    player.play();
  });

  // is player is error or ready to play status
  const { status, error } = useEvent(player, "statusChange", {
    status: player.status,
  });

  // isPlaying status
  const { isPlaying } = useEvent(player, "playingChange", {
    isPlaying: player.playing,
  });

  // log to debug player
  useEffect(() => {
    console.log("player status =>", status);
    console.log("is playing =>", isPlaying);
    console.log("player error =>", error);
  }, [player]);

  return (
    <View style={{ flex: 1, justifyContent: "center" }}>
      <VideoView
        ref={playerRef}
        player={player}
        style={{ flex: 1 }}
        contentFit="cover"
        nativeControls={false}
        allowsFullscreen
      />
    </View>
  );
}
