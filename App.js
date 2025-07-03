import { useVideoPlayer, VideoView } from "expo-video";
import { View } from "react-native";

export default function Video() {
  const videoSource =
    "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";

  const player = useVideoPlayer(videoSource, (player) => {
    player.loop = false;
    player.play();
  });

  return (
    <View>
      <VideoView player={player} allowsFullscreen />
    </View>
  );
}
