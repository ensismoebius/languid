import React from 'react';
import { View, Text } from 'react-native';
import ExecutingButton from './ExecutingButton';
import ExercisesList from './ExercisesList';

export default function Header({ styles, headerHeight, handleRunCode, executing, exercises, currentExercise })
{
    const handleExerciseSelect = (index) =>
    {
        setCurrentExercise(index);
        setCode('// Digite seu código abaixo');
        setShowConsole(false);
        Keyboard.dismiss();
    };

    return (
        <View style={[styles.header, { height: headerHeight }]}>
            <ExecutingButton
                styles={styles}
                handleRunCode={handleRunCode}
                executing={executing}
            />

            <ExercisesList
                styles={styles}
                exercises={exercises}
                currentExercise={currentExercise}
                handleExerciseSelect={handleExerciseSelect}
            />

            <Text style={styles.exerciseCounter}>
                {currentExercise + 1}/{exercises.length}
            </Text>
        </View>
    );
}