import { StyleSheet } from "react-native";
import { useEffect, useState, useRef } from "react";
import Svg, {
  Rect,
  Mask,
  Defs,
  Path,
  Line,
  LinearGradient,
  Stop,
  Text,
  G,
} from "react-native-svg";
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withRepeat,
  withTiming,
  withSequence,
  Easing,
  cancelAnimation,
} from "react-native-reanimated";
import colors from "tailwindcss/colors";
import { Dimensions } from "react-native";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

const CUTOUT_WIDTH = 350;
const CUTOUT_HEIGHT = 550;

const R = 20;
const CORNER_LENGTH = 40;
const STROKE = 4;

const CUTOUT_X = (SCREEN_WIDTH - CUTOUT_WIDTH) / 2;
const CUTOUT_Y = (SCREEN_HEIGHT - CUTOUT_HEIGHT) / 2;
interface LineProps {
  y1: number;
  y2: number;
  opacity: number;
}

interface RectProps {
  y: number;
  opacity: number;
}

const AnimatedLine = Animated.createAnimatedComponent(Line);
const AnimatedRect = Animated.createAnimatedComponent(Rect);
const AnimatedG = Animated.createAnimatedComponent(G);

interface SvgScanOverlayProps {
  startAni: boolean;
}

const SvgScanOverlay = ({ startAni }: SvgScanOverlayProps) => {
  const [textWidth, setTextWidth] = useState(0);
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [dots, setDots] = useState("");

  const apiDoneRef = useRef(false);

  const active = useSharedValue(0);

  const scanLineY = useSharedValue(CUTOUT_Y + 10);
  const scanOpacity = useSharedValue(0);
  const textOpacity = useSharedValue(0);
  const bgPulseOpacity = useSharedValue(1);

  const texts = [
    "SCANNING IN PROGRESS",
    "CHECKING CONDITION",
    "CHECKING PRICE",
  ];

  useEffect(() => {
    active.value = startAni ? 1 : 0;

    if (!startAni) {
      cancelAnimation(scanLineY);
      cancelAnimation(bgPulseOpacity);

      scanOpacity.value = 0;
      textOpacity.value = 0;
      bgPulseOpacity.value = 1;

      setCurrentTextIndex(0);
      setDots("");
      apiDoneRef.current = false;
      return;
    }

    scanOpacity.value = withTiming(1, { duration: 200 });
    textOpacity.value = withTiming(1, { duration: 200 });

    scanLineY.value = withRepeat(
      withSequence(
        withTiming(CUTOUT_Y + CUTOUT_HEIGHT - 10, {
          duration: 1500,
          easing: Easing.inOut(Easing.ease),
        }),
        withTiming(CUTOUT_Y + 10, {
          duration: 1500,
          easing: Easing.inOut(Easing.ease),
        })
      ),
      -1,
      false
    );

    bgPulseOpacity.value = withRepeat(
      withSequence(
        withTiming(0.55, { duration: 700 }),
        withTiming(1, { duration: 700 })
      ),
      -1,
      true
    );

    const stages = [
      { index: 0, min: 2000 },
      { index: 1, min: 2000 },
      { index: 2, min: 1000 },
    ];

    let cancelled = false;

    (async () => {
      for (const stage of stages) {
        if (cancelled || apiDoneRef.current) break;
        setCurrentTextIndex(stage.index);

        const start = Date.now();
        while (!apiDoneRef.current && Date.now() - start < stage.min) {
          await new Promise((r) => setTimeout(r, 100));
        }
      }
    })();

    const dotInterval = setInterval(() => {
      setDots((d) => (d.length === 3 ? "" : d + "."));
    }, 450);

    return () => {
      cancelled = true;
      clearInterval(dotInterval);
    };
  }, [startAni, CUTOUT_Y, CUTOUT_HEIGHT]);

  const animatedLineProps = useAnimatedProps<LineProps>(() => {
    if (!active.value) return { opacity: 0 };
    return {
      y1: scanLineY.value,
      y2: scanLineY.value,
      opacity: scanOpacity.value,
    };
  });

  const animatedGlowProps = useAnimatedProps<RectProps>(() => {
    if (!active.value) return { opacity: 0 };
    return {
      y: scanLineY.value - 20,
      opacity: scanOpacity.value * 0.6,
    };
  });

  const animatedTextGroupProps = useAnimatedProps(() => {
    if (!active.value) return { opacity: 0 };
    return { opacity: textOpacity.value };
  });

  const animatedBgProps = useAnimatedProps(() => {
    if (!active.value) return { opacity: 1 };
    return { opacity: bgPulseOpacity.value };
  });

  return (
    <>
      <Svg className="absolute inset-0" pointerEvents="none">
        <Defs>
          <Mask id="mask">
            <Rect width="100%" height="100%" fill="white" />
            <Rect
              x={CUTOUT_X}
              y={CUTOUT_Y}
              width={CUTOUT_WIDTH}
              height={CUTOUT_HEIGHT}
              rx={R}
              ry={R}
              fill="black"
            />
          </Mask>
        </Defs>

        <Rect
          width="100%"
          height="100%"
          fill="rgba(0,0,0,0.6)"
          mask="url(#mask)"
        />

        <Path
          d={`M ${CUTOUT_X} ${CUTOUT_Y + CORNER_LENGTH}
            L ${CUTOUT_X} ${CUTOUT_Y + R}
            Q ${CUTOUT_X} ${CUTOUT_Y} ${CUTOUT_X + R} ${CUTOUT_Y}
            L ${CUTOUT_X + CORNER_LENGTH} ${CUTOUT_Y}`}
          stroke="white"
          strokeWidth={STROKE}
          fill="none"
          strokeLinecap="round"
        />

        <Path
          d={`M ${CUTOUT_X + CUTOUT_WIDTH - CORNER_LENGTH} ${CUTOUT_Y}
            L ${CUTOUT_X + CUTOUT_WIDTH - R} ${CUTOUT_Y}
            Q ${CUTOUT_X + CUTOUT_WIDTH} ${CUTOUT_Y} ${
            CUTOUT_X + CUTOUT_WIDTH
          } ${CUTOUT_Y + R}
            L ${CUTOUT_X + CUTOUT_WIDTH} ${CUTOUT_Y + CORNER_LENGTH}`}
          stroke="white"
          strokeWidth={STROKE}
          fill="none"
          strokeLinecap="round"
        />

        <Path
          d={`M ${CUTOUT_X + CORNER_LENGTH} ${CUTOUT_Y + CUTOUT_HEIGHT}
            L ${CUTOUT_X + R} ${CUTOUT_Y + CUTOUT_HEIGHT}
            Q ${CUTOUT_X} ${CUTOUT_Y + CUTOUT_HEIGHT} ${CUTOUT_X} ${
            CUTOUT_Y + CUTOUT_HEIGHT - R
          }
            L ${CUTOUT_X} ${CUTOUT_Y + CUTOUT_HEIGHT - CORNER_LENGTH}`}
          stroke="white"
          strokeWidth={STROKE}
          fill="none"
          strokeLinecap="round"
        />

        <Path
          d={`M ${CUTOUT_X + CUTOUT_WIDTH} ${
            CUTOUT_Y + CUTOUT_HEIGHT - CORNER_LENGTH
          }
            L ${CUTOUT_X + CUTOUT_WIDTH} ${CUTOUT_Y + CUTOUT_HEIGHT - R}
            Q ${CUTOUT_X + CUTOUT_WIDTH} ${CUTOUT_Y + CUTOUT_HEIGHT} ${
            CUTOUT_X + CUTOUT_WIDTH - R
          } ${CUTOUT_Y + CUTOUT_HEIGHT}
            L ${CUTOUT_X + CUTOUT_WIDTH - CORNER_LENGTH} ${
            CUTOUT_Y + CUTOUT_HEIGHT
          }`}
          stroke="white"
          strokeWidth={STROKE}
          fill="none"
          strokeLinecap="round"
        />
      </Svg>

      {startAni && (
        <Svg style={StyleSheet.absoluteFill} pointerEvents="none">
          <Defs>
            <LinearGradient id="scanGradient" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0" stopColor="#00ff00" stopOpacity="0" />
              <Stop offset="0.5" stopColor="#00ff00" stopOpacity="0.8" />
              <Stop offset="1" stopColor="#00ff00" stopOpacity="0" />
            </LinearGradient>
          </Defs>

          <AnimatedRect
            x={CUTOUT_X}
            width={CUTOUT_WIDTH}
            height={40}
            fill="url(#scanGradient)"
            animatedProps={animatedGlowProps}
          />

          <AnimatedLine
            x1={CUTOUT_X}
            x2={CUTOUT_X + CUTOUT_WIDTH}
            stroke="#00ff00"
            strokeWidth={2}
            animatedProps={animatedLineProps}
          />

          <AnimatedLine
            x1={CUTOUT_X + 10}
            x2={CUTOUT_X + CUTOUT_WIDTH - 10}
            stroke="#00ff00"
            strokeWidth={1}
            opacity={0.5}
            animatedProps={animatedLineProps}
          />

          <AnimatedG animatedProps={animatedTextGroupProps}>
            <AnimatedRect
              x={CUTOUT_X + CUTOUT_WIDTH / 2 - 120}
              y={CUTOUT_Y + CUTOUT_HEIGHT / 2 - 20}
              width={240}
              height={40}
              rx={8}
              ry={8}
              fill={colors.neutral[900]}
              stroke={colors.neutral[800]}
              strokeWidth={1}
              animatedProps={animatedBgProps}
            />

            <Text
              x={CUTOUT_X + CUTOUT_WIDTH / 2}
              y={CUTOUT_Y + CUTOUT_HEIGHT / 2 + 5}
              fontSize="12"
              fontWeight="600"
              fill="white"
              textAnchor="middle"
              onLayout={(e) => setTextWidth(e.nativeEvent.layout.width)}
            >
              {texts[currentTextIndex]}
            </Text>

            <Text
              x={CUTOUT_X + CUTOUT_WIDTH / 2 + textWidth / 2 + 4}
              y={CUTOUT_Y + CUTOUT_HEIGHT / 2 + 5}
              fontSize="14"
              fontWeight="600"
              fill="white"
              textAnchor="start"
            >
              {dots}
            </Text>
          </AnimatedG>
        </Svg>
      )}
    </>
  );
};

export default SvgScanOverlay;
