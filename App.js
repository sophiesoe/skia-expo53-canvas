import { useState } from "react";
import { View, Button } from "react-native";
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import { Canvas, Path } from "@shopify/react-native-skia";
import { runOnJS } from "react-native-reanimated";

export default function Draw() {
  const [paths, setPaths] = useState([]);

  const startPath = (x, y) => {
    setPaths((prev) => [
      ...prev,
      {
        segments: [`M ${x} ${y}`],
        color: "#06d6a0",
      },
    ]);
  };

  const updatePath = (x, y) => {
    setPaths((prev) => {
      const newPaths = [...prev];
      console.log("paths", newPaths?.[0].segments);
      const index = newPaths.length - 1;
      if (newPaths[index]) {
        newPaths[index].segments.push(`L ${x} ${y}`);
      }
      return newPaths;
    });
  };

  const clearPaths = () => {
    setPaths([]);
  };

  const pan = Gesture.Pan()
    .onStart((g) => {
      runOnJS(startPath)(g.x, g.y);
    })
    .onUpdate((g) => {
      runOnJS(updatePath)(g.x, g.y);
    })
    .minDistance(1);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <GestureDetector gesture={pan}>
        <View style={{ flex: 1, backgroundColor: "black" }}>
          <Canvas style={{ flex: 1 }}>
            {paths.map((p, index) => (
              <Path
                key={index}
                path={p.segments.join(" ")}
                strokeWidth={10}
                style="stroke"
                color={p.color}
                strokeCap="round"
              />
            ))}
          </Canvas>
          <View style={{ position: "absolute", top: 50, right: 20 }}>
            <Button title="Reset" onPress={clearPaths} color="#ef476f" />
          </View>
        </View>
      </GestureDetector>
    </GestureHandlerRootView>
  );
}
