import React, { useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { GameEngine } from "react-native-game-engine";
import { TouchableOpacity } from "react-native-gesture-handler";
import Constants from '../utils/Constants';
import Head from '../Components/Head';
import Food from '../Components/Food';
import Tail from '../Components/Tail';
import GameLoop from '../systems/GameLoop';

export const Home = () => {
    const BoardSize = Constants.GRID_SIZE * Constants.CELL_SIZE;
    const engine = useRef(null);
    const [isGameRunning, setIsGameRunning] = useState(true);
    const randomPositions = (min, max) => {
        return Math.floor(Math.random() * (max - min + 1) + min);
    };
    const resetGame = () => {
        engine.current.swap({
            head: {
                position: [40, 0],
                size: Constants.MAX_WIDTH / 50,
                updateFrequency: 10,
                nextMove: 10,
                xspeed: 0,
                yspeed: 0,
                renderer: <Head />,
            },
            food: {
                position: [
                    randomPositions(0, Constants.GRID_SIZE - 1),
                    randomPositions(0, Constants.GRID_SIZE - 1),
                ],
                size: Constants.MAX_WIDTH / 50,
                updateFrequency: 10,
                nextMove: 10,
                xspeed: 0,
                yspeed: 0,
                renderer: <Food />,
            },
            tail: {
                size: Constants.MAX_WIDTH / 50,
                elements: [],
                renderer: <Tail />,
            },
        });
        setIsGameRunning(true);
    };
    return (
        <View style={styles.canvas}>
            <GameEngine
                ref={engine}
                style={{
                    // width: Constants.MAX_WIDTH,
                    // height: Constants.MAX_WIDTH,
                    // width: '100vw',
                    // height: '100vh',
                    flex: 1,
                    backgroundColor: "white",
                }}
                entities={{
                    head: {
                        position: [0, 0],
                        size: 10,
                        updateFrequency: 10,
                        nextMove: 10,
                        xspeed: 0,
                        yspeed: 0,
                        renderer: <Head />
                    },
                    food: {
                        position: [
                            randomPositions(0, Constants.MAX_WIDTH - 1),
                            randomPositions(0, Constants.MAX_WIDTH - 1),
                        ],
                        size: Constants.MAX_WIDTH / 50,
                        renderer: <Food />,
                    },
                    tail: {
                        size: Constants.MAX_WIDTH / 50,
                        elements: [],
                        renderer: <Tail />,
                    },
                }}
                systems={[GameLoop]}
                running={isGameRunning}
                onEvent={(e) => {
                    switch (e) {
                        case "game-over":
                            alert("Game over!");
                            setIsGameRunning(false);
                            return;
                    }
                }}
            />
            <View style={styles.controllerRoot}>
                <View style={styles.controlContainer}>
                    <View style={styles.controllerRow}>
                        <TouchableOpacity onPress={() => engine.current.dispatch("move-up")}>
                            <View style={styles.controlBtn} />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.controllerRow}>
                        <TouchableOpacity
                            onPress={() => engine.current.dispatch("move-left")}
                        >
                            <View style={styles.controlBtn} />
                        </TouchableOpacity>
                        <View style={[styles.controlBtn, { backgroundColor: null }]} />
                        <TouchableOpacity
                            onPress={() => engine.current.dispatch("move-right")}
                        >
                            <View style={styles.controlBtn} />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.controllerRow}>
                        <TouchableOpacity
                            onPress={() => engine.current.dispatch("move-down")}
                        >
                            <View style={styles.controlBtn} />
                        </TouchableOpacity>
                    </View>
                    {!isGameRunning && (
                        <TouchableOpacity onPress={resetGame}>
                            <Text
                                style={{
                                    color: "white",
                                    marginTop: 15,
                                    fontSize: 22,
                                    padding: 10,
                                    backgroundColor: "grey",
                                    borderRadius: 10
                                }}
                            >
                                Start New Game
                            </Text>
                        </TouchableOpacity>
                    )}
                </View>

            </View>

        </View>
    )
}

const styles = StyleSheet.create({
    canvas: {
        backgroundColor: "#000000",
        alignItems: "center",
        justifyContent: "center",
        // width: '100%',
        // height: '100%'
        flex: 1,
        padding: 20
    },
    controllerRoot: {
        position: 'relative'
    },
    controlContainer: {
        marginTop: 10,
        position: 'absolute',
        bottom: 0
    },
    controllerRow: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
    },
    controlBtn: {
        backgroundColor: "yellow",
        width: 50,
        height: 50,
    },
});