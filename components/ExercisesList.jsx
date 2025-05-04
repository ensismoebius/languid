import React, { useRef, useEffect } from 'react';
import { FlatList, TouchableOpacity, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function ExercisesList({ styles, exercises, currentExercise, handleExerciseSelect })
{
    const flatListRef = useRef(null);

    useEffect(() =>
    {
        if (flatListRef.current && currentExercise != null)
        {
            if (currentExercise > exercises.length - 1)
            {
                return;
            }
            // Scroll to the current exercise index
            // Isso garante que o FlatList seja rolado para o exercício atual
            // e o item fique centralizado na tela
            flatListRef.current.scrollToIndex({
                index: currentExercise,
                animated: true,
                viewPosition: 0, // centraliza o item na tela
            });
        }
    }, [currentExercise]);

    return (
        <FlatList
            ref={flatListRef}
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
            getItemLayout={(_, index) => ({
                length: styles.exerciseItem?.width || 100, // ajuste conforme largura real do item
                offset: (styles.exerciseItem?.width || 100) * index,
                index,
            })}
        />
    );
}
