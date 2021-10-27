import React, { useRef, useState, useEffect } from 'react';
import { StyleSheet, Text, View, Dimensions } from 'react-native';
import { GameEngine } from "react-native-game-engine";
import { TouchableOpacity } from "react-native-gesture-handler";
import Human from '../Components/Human';
import Matter from 'matter-js';

export const GameRoot = () => {
    const engineRef = useRef(null);

    const { width, height } = Dimensions.get("screen");
    const boxSize = Math.trunc(Math.max(width, height) * 0.075);
    const initialBox = Matter.Bodies.rectangle(width / 2, height / 2, boxSize, boxSize);
    const floor = Matter.Bodies.rectangle(width / 2, height - boxSize / 2, width, boxSize, { isStatic: true });

    const engine = Matter.Engine.create({ enableSleeping: false });
    const world = engine.world;
    Matter.World.add(world, [initialBox, floor]);

    const Physics = (entities, { touches, time, events, dispatch }) => {
        let engine = entities.physics.engine;
        if (touches.length > 0) console.log(touches)
        if (events.length) {
            events.forEach((e) => {
                switch (e) {
                    case "jump":
                        Matter.Body.setVelocity(entities.initialBox.body, {
                            x: 0,
                            y: -8
                        })
                        return;
                    case "left":
                        Matter.Body.translate(entities.initialBox.body, {
                            x: -2,
                            y: 0
                        })
                        return;
                    case "right":
                        Matter.Body.translate(entities.initialBox.body, {
                            x: 2,
                            y: 0
                        })
                        return;
                }
            });
        }
        Matter.Engine.update(engine, time.delta);
        return entities;
    };

    const [movingRight, setMovingRight] = useState(false);
    const [movingLeft, setMovingLeft] = useState(false);
    const [timerId, setTimerId] = useState('');
    let interval;
    useEffect(() => {
        if (!movingLeft) return clearInterval(timerId);
        if (movingRight) setMovingRight(false);
        interval = setInterval(() => { engineRef.current.dispatch('left') }, 10);
        setTimerId(interval)
        return clearInterval(timerId);
    }, [movingLeft])
    useEffect(() => {
        if (!movingRight) return clearInterval(timerId);
        if (movingLeft) setMovingLeft(false);
        interval = setInterval(() => { engineRef.current.dispatch('right') }, 10);
        setTimerId(interval)
        return clearInterval(timerId);
    }, [movingRight])


    return (
        <View style={styles.container}>
            <GameEngine
                ref={engineRef}
                style={{
                    flex: 1,
                    backgroundColor: "white",
                }}
                systems={[Physics]}
                entities={{
                    physics: {
                        engine: engine,
                        world: world
                    },
                    initialBox: {
                        xspeed: 0,
                        yspeed: 0,
                        body: initialBox,
                        size: [boxSize, boxSize],
                        color: 'red',
                        renderer: Human
                    },
                    floor: {
                        body: floor,
                        size: [width, boxSize],
                        color: "green",
                        renderer: Human
                    }
                }}
            />
            <View style={styles.btnContainer}>
                <TouchableOpacity style={styles.btnLeft}
                    onPress={() => engineRef.current.dispatch("left")}
                    onPressIn={() => setMovingLeft(true)}
                    onPressOut={() => setMovingLeft(false)}
                >
                    <Text style={styles.btnText}>{'<'}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.btnRight}
                    onPress={() => engineRef.current.dispatch("right")}
                    onPressIn={() => setMovingRight(true)}
                    onPressOut={() => setMovingRight(false)}
                >
                    <Text style={styles.btnText}>{'>'}</Text>
                </TouchableOpacity>
                <View style={styles.btnSpace} />
                <TouchableOpacity style={styles.btnJump}
                    onPress={() => engineRef.current.dispatch("jump")}
                >
                    <Text style={styles.btnText}>Jump</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#777777",
        flex: 1,
        position: 'relative'
    },
    btnContainer: {
        position: 'absolute',
        width: '100%',
        bottom: 20,
        flexDirection: 'row'
    },
    btnLeft: {
        flex: 1,
        padding: 30,
        backgroundColor: '#000',
        opacity: 0.3,
        borderRadius: 32,
        marginLeft: 50
    },
    btnRight: {
        flex: 1,
        padding: 30,
        backgroundColor: '#000',
        opacity: 0.3,
        borderRadius: 32,
        marginLeft: 4
    },
    btnSpace: {
        flex: 2,
    },
    btnJump: {
        flex: 1,
        padding: 30,
        opacity: 0.3,
        borderRadius: 32,
        backgroundColor: 'blue',
        marginRight: 50,
        marginLeft: 'auto'
    },
    btnText: {
        fontWeight: '900',
        fontSize: 28
    }
});