import React from 'react';

import { View, Text, Keyboard } from 'react-native';
import ExecutingButton from './ExecutingButton';
import ExercisesList from './ExercisesList';
import LogoutButton from './LogoutButton';

export default function Header({ styles, headerHeight, handleRunCode, executing, exercises, setCurrentExercise, currentExercise, setShowConsole, setCode })
{
    const handleExerciseSelect = (index) =>
    {
        setCurrentExercise(index);
        setShowConsole(false);
        setCode(exercises[index].code);
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

            <LogoutButton />
        </View>
    );
}