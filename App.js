import { useEffect, useState } from "react";
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
  const [coordinates, setCoordinates] = useState([]);

  // log for debugging
  useEffect(() => {
    console.log("user points 0 =>", coordinates[0]);
    console.log("user points 1 =>", coordinates[1]);
    console.log("strokes =>", coordinates?.length);
  }, [coordinates]);

  const undoLastStroke = () => {
    setPaths((prev) => prev.slice(0, -1));
    setCoordinates((prev) => prev.slice(0, -1));
  };

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
      const index = newPaths.length - 1;
      if (newPaths[index]) {
        newPaths[index].segments.push(`L ${x} ${y}`);
      }
      return newPaths;
    });
    const coordinates = paths.map((path) => {
      return path.segments.map((segment) => {
        const [, x, y] = segment.split(" ");
        return [parseFloat(x), parseFloat(y)];
      });
    });
    setCoordinates(coordinates);
  };

  const clearPaths = () => {
    setPaths([]);
    setCoordinates([]);
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
          <View
            style={{
              position: "absolute",
              top: 50,
              right: 20,
              display: "flex",
              gap: 10,
            }}
          >
            <Button title="Reset" onPress={clearPaths} color="#ef476f" />
            <Button title="Undo" onPress={undoLastStroke} color="#ffd166" />
          </View>
        </View>
      </GestureDetector>
    </GestureHandlerRootView>
  );
}
