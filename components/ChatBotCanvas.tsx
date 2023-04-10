"use client";

import { AppContext } from "@/app/context/IsSpeakingContext";
import { OrbitControls, useGLTF, useAnimations, SpotLight } from "@react-three/drei";
import {Canvas, useFrame, useThree} from "@react-three/fiber";
import { useContext, useEffect, useRef } from "react";
import {Vector3} from "three";

function Torch({vec = new Vector3, ...props}){
    const light = useRef<THREE.SpotLight>(null);
    const viewport = useThree(state => state.viewport);

    useFrame((state) => {
        light.current?.target.position.lerp(vec.set((state.mouse.x * viewport.width) / 2, (state.mouse.y * viewport.width) / 2, 0), 0.1);
        light.current?.target.updateMatrixWorld();
    });

    return (
        <SpotLight
            ref={light}
            castShadow
            penumbra={1}
            distance={10}
            angle={0.35}
            attenuation={5}
            anglePower={4}
            intensity={3}
            {...props}
        />
    );
}

function Head(){
    const {isSpeaking, setIsSpeaking} = useContext(AppContext);
    const model = useGLTF("/head_alt.glb");
    const animation = useAnimations(model.animations, model.scene);
    const action = animation.actions.Animation;

    //console.log(model);
    //console.log(action);

    useEffect(() => {
        if(isSpeaking){
            action?.play();
        } else {
            action?.fadeOut(0.5); //0.5 segundos
            setTimeout(() => {
                action?.stop();
            }, 500); //500 milisegundos
        }
    }, [isSpeaking, action]);

    return (
        <>
            <primitive
                object={model.scene}
                scale={3}
                rotation-z={0.2}
            />
            <Torch
                color="blue"
                position={[3,2,2]}
            />
            <Torch
                color="#b00c3f"
                position={[-3,2,2]}
            />
        </>
    ); //head_alt
    //return <primitive object={model.scene} scale={1} rotation-z={0.1} rotation-y={10.5} rotation-x={0}/>; skull
    //return <primitive object={model.scene} scale={2} rotation-z={0.0} rotation-y={3.145} rotation-x={0.2}/> ; ghost
}

export default function ChatBotCanvas(){
    return (
        <Canvas>
            <OrbitControls
                
                enableZoom={false}
                enableDamping
                maxPolarAngle={1.8}
                minAzimuthAngle={-Math.PI * 0.5}
                maxAzimuthAngle={Math.PI * 0.5}
            />
            <ambientLight
                intensity={0.025}
            />
            <Head />
        </Canvas>
    );
}