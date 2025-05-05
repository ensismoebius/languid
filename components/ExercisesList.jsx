import React, { useRef, useEffect } from 'react';
import { FlatList, TouchableOpacity, Text, View, Platform } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function ExercisesList({ styles, exercises, currentExercise, handleExerciseSelect })
{
    const flatListRef = useRef(null);
    const itemRefs = useRef([]);

    const focusItemAtIndex = (index) =>
    {
        const ref = itemRefs.current[index];
        if (!ref) return;

        ref.focus?.();
    };

    useEffect(() =>
    {
        if (flatListRef.current && currentExercise != null)
        {
            if (currentExercise > exercises.length - 1)
            {
                return;
            }
            focusItemAtIndex(currentExercise);
        }
    }, [currentExercise]);

    return (
        <FlatList
            ref={flatListRef}
            data={exercises}
            horizontal
            showsHorizontalScrollIndicator={true}
            renderItem={({ item, index }) => (
                <TouchableOpacity
                    ref={(element) => (itemRefs.current[index] = element)}
                    style={[
                        styles.exerciseItem,
                        currentExercise === index && styles.selectedExercise
                    ]}
                    onPress={() => handleExerciseSelect(index)}
                    accessibilityLabel={`Selecionar exercício: ${item.title}`}
                >
                    <View style={[styles.exerciseItemContent, { flexDirection: 'row', alignItems: 'center' }]}>
                        <MaterialCommunityIcons
                            name={item.done ? 'check-circle-outline' : 'checkbox-blank-circle-outline'}
                            size={20}
                            color={item.done ? 'green' : 'gray'}
                        />
                        <Text style={styles.exerciseText}>{item.title}</Text>
                    </View>
                </TouchableOpacity>
            )}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.flatListContent}
            getItemLayout={(_, index) => ({
                length: styles.exerciseItem?.width || 100, // ajuste conforme largura real do item
                offset: (styles.exerciseItem?.width || 100) * index,
                index,
            })}
        />
    );
}
