import React from 'react';

import { View, Text, Keyboard, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import ExecutingButton from './ExecutingButton';
import ExercisesList from './ExercisesList';
import LogoutButton from './LogoutButton';

export default function Header({ styles, headerHeight, handleRunCode, executing, exercises, setCurrentExercise, currentExercise, setShowConsole, setCode, requestLogout, onOpenAccessibility })
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

            <Text style={styles.exerciseCounter} accessibilityLabel={`Exercício ${currentExercise + 1} de ${exercises.length}`}
                accessible accessibilityRole="text">
                {currentExercise + 1}/{exercises.length}
            </Text>

            <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 10 }}>
                <TouchableOpacity onPress={goPrev} disabled={isFirst} accessibilityLabel="Exercício anterior" accessibilityRole="button">
                    <MaterialCommunityIcons name="chevron-left-circle" size={32} color={isFirst ? '#bbb' : '#fff'} accessibilityLabel="Ícone de seta para exercício anterior" importantForAccessibility="yes" />
                </TouchableOpacity>
                <TouchableOpacity onPress={goNext} disabled={isLast} accessibilityLabel="Próximo exercício" accessibilityRole="button">
                    <MaterialCommunityIcons name="chevron-right-circle" size={32} color={isLast ? '#bbb' : '#fff'} accessibilityLabel="Ícone de seta para próximo exercício" importantForAccessibility="yes" />
                </TouchableOpacity>
            </View>

            <TouchableOpacity onPress={onOpenAccessibility} accessibilityLabel="Abrir opções de acessibilidade" accessibilityRole="button" style={{ marginLeft: 10 }}>
                <MaterialCommunityIcons name="accessibility" size={28} color="#fff" accessibilityLabel="Ícone de acessibilidade" importantForAccessibility="yes" />
            </TouchableOpacity>

            <LogoutButton requestLogout={requestLogout} />
        </View>
    );
}