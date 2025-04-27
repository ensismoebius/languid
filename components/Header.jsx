import React from 'react';
import { View, TouchableOpacity, Text, FlatList, ActivityIndicator } from 'react-native';

export default function Header({ styles, headerHeight, handleRunCode, executing, exercises, currentExercise, handleExerciseSelect })
{
    return (
        <View style={[styles.header, { height: headerHeight }]}>
            <TouchableOpacity
                style={styles.button}
                onPress={handleRunCode}
                disabled={executing}
            >
                {executing ? (
                    <ActivityIndicator size="small" color="#fff" />
                ) : (
                    <Text style={styles.buttonText}>Executar</Text>
                )}
            </TouchableOpacity>

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

            <Text style={styles.exerciseCounter}>
                {currentExercise + 1}/{exercises.length}
            </Text>
        </View>
    );
}