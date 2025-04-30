import React from 'react';

import { View, Text, Keyboard, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
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

    const isFirst = currentExercise === 0;
    const isLast = currentExercise === exercises.length - 1;

    const goPrev = () =>
    {
        if (!isFirst) handleExerciseSelect(currentExercise - 1);
    };
    const goNext = () =>
    {
        if (!isLast) handleExerciseSelect(currentExercise + 1);
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

            <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 10 }}>
                <TouchableOpacity onPress={goPrev} disabled={isFirst} accessibilityLabel="Exercício anterior">
                    <MaterialCommunityIcons name="chevron-left-circle" size={32} color={isFirst ? '#bbb' : '#fff'} />
                </TouchableOpacity>
                <TouchableOpacity onPress={goNext} disabled={isLast} accessibilityLabel="Próximo exercício">
                    <MaterialCommunityIcons name="chevron-right-circle" size={32} color={isLast ? '#bbb' : '#fff'} />
                </TouchableOpacity>
            </View>

            <LogoutButton />
        </View>
    );
}