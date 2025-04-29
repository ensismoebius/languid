import React from 'react';
import { FlatList, TouchableOpacity, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

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
                    accessibilityLabel={`Selecionar exercício: ${item.title}`}
                >
                    <View style={[styles.exerciseItemContent, { flexDirection: 'row', alignItems: 'center' }]}>
                        <Text style={styles.exerciseText}>{item.title}</Text>
                        <MaterialCommunityIcons
                            name={item.done ? 'check-circle-outline' : 'checkbox-blank-circle-outline'}
                            size={20}
                            color={item.done ? 'green' : 'gray'}
                        />
                    </View>
                </TouchableOpacity>
            )}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.flatListContent}
        />
    );
}