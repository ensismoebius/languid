import React from 'react';
import { FlatList, TouchableOpacity, Text } from 'react-native';

export default function ExercisesList({ styles, exercises, currentExercise, handleExerciseSelect })
{
    return (
        <FlatList
            data={exercises}
            horizontal
            showsHorizontalScrollIndicator={false}
            renderItem={({ item, index }) => (
                <TouchableOpacity
                    style={[
                        styles.exerciseItem,
                        currentExercise === index && styles.selectedExercise
                    ]}
                    onPress={() => handleExerciseSelect(index)}
                >
                    <Text style={styles.exerciseText}>{item.title}</Text>
                </TouchableOpacity>
            )}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.flatListContent}
        />
    );
}