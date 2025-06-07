import React, { forwardRef, useImperativeHandle, useState } from 'react';
import { Animated, Dimensions, StyleSheet, Text, View } from 'react-native';

const { width, height } = Dimensions.get('window');
const DEFAULT_EMOJIS = ['🎉', '👽', '😃'];

const FloatingEmojiOverlay = forwardRef((_, ref) =>
{
  const [emojis, setEmojis] = useState([]);

  useImperativeHandle(ref, () => ({
    spawnEmoji(emojiList = DEFAULT_EMOJIS)
    {
      const id = Math.random().toString();
      const emoji = emojiList[Math.floor(Math.random() * emojiList.length)];
      const x = Math.random() * (width - width / 4);
      const y = Math.random() * (height / 2);

      const opacity = new Animated.Value(1);
      const translateY = new Animated.Value(0);

      const animatedEmoji = { id, emoji, x, y, opacity, translateY };
      setEmojis((prev) => [...prev, animatedEmoji]);

      Animated.parallel([
        Animated.timing(translateY, {
          toValue: -100,
          duration: 2000,
          useNativeDriver: false,
        }),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: false,
        }),
      ]).start(() =>
      {
        setEmojis((prev) => prev.filter(e => e.id !== id));
      });
    },
  }));

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {emojis.map(e => (
        <Animated.Text
          key={e.id}
          style={[
            styles.emoji,
            {
              left: e.x,
              top: e.y,
              opacity: e.opacity,
              transform: [{ translateY: e.translateY }],
            },
          ]}
        >
          {e.emoji}
        </Animated.Text>
      ))}
    </View>
  );
});

const styles = StyleSheet.create({
  emoji: {
    position: 'absolute',
    fontSize: 150,
    zIndex: 100000,
  },
});

export default FloatingEmojiOverlay;
