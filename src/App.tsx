import React, {useEffect, useState} from 'react';
import Input from "./components/Input";
import Button from "./components/Button";
import axios from "axios";
import createCone from "./lib/createCone";
import * as THREE from "three";

interface ICoordinates {
    apex: {
        x: number
        y: number
        z: number
    }
    coordinates: {
        x: number
        y: number
        z: number
    }[]
}
const renderer = new THREE.WebGLRenderer();
const App = () => {
    const [height, setHeight] = useState<string>('');
    const [radius, setRadius] = useState<string>('');
    const [segments, setSegments] = useState<string>('');
    const [coordinates, setCoordinates] = useState<ICoordinates | null>(null)
    const [notFirsRender, setNotFirstRender] = useState(false);
    const [rotation, setRotation] = useState<boolean>(true);

    useEffect(() => {
        if (coordinates !== null) {
            createCone(renderer,coordinates, notFirsRender, rotation);
            setNotFirstRender(true);
        }
    }, [coordinates, rotation]);

    const calculateCoordinates = async () => {
        if (radius !== '0' && height !== '0' && segments !== '0') {
            const response = await axios.post('https://cone-sever.onrender.com/calculatecoordinates', {
                radius,
                height,
                segments
            })
            if (response.status === 200) {
                setCoordinates(response.data);
            }
        } else {
            setCoordinates(null);
        }
    }
    return (
        <div className="bg-black">
            <div
                className=" absolute h-screen overflow-scroll top-0 left-0 flex flex-col items-center text-white bg-black w-2/5">
                <h1 className='text-center font-bold text-5xl'>Create Own Cone</h1>
                <div className="flex justify-center mt-5">
                    <Input value={height} setValue={setHeight} label="Cone Height" fetchData={calculateCoordinates}/>
                    <Input value={radius} setValue={setRadius} label="Cone Radius" fetchData={calculateCoordinates}/>
                    <Input value={segments} setValue={setSegments} label="Cone Segments"
                           fetchData={calculateCoordinates}/>
                </div>
                <Button Calculate={calculateCoordinates}>Get Cone Coordinates</Button>
                <Button Rotation={setRotation}>{rotation ? 'Rotation off' : 'Rotation on'}</Button>
                <p className="text-1xl font-semibold">
                    {coordinates
                        ? <>Apex: X:{coordinates?.apex?.x}, Y:{coordinates?.apex?.y}, Z: {coordinates?.apex?.z}</>
                        : ''
                    }
                </p>
                <p className="text-2xl font-semibold"> Coordinates of Pi:</p>
                <ul>
                    {coordinates?.coordinates.map((v, i) => (
                        <li key={i}> P{i + 1} = X: {v.x}, Y: {v.y}, Z: {v.z}</li>
                    ))}
                </ul>
            </div>
            <div
                 className="overflow-hidden bg-black w-7/12 h-full absolute right-0"
                 id="scene-container">
            </div>
        </div>
    );
};
export default App;