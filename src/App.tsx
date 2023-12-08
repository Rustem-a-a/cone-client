import React, {useEffect, useRef, useState} from 'react';
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
    const [isShowPoint, setIsShowPoint] = useState<boolean>(false);
    const containerRef = useRef<HTMLDivElement | null>(null)
    const canvasRef = useRef<HTMLCanvasElement | null>(null)
    useEffect(() => {
        if (coordinates !== null && containerRef.current !== null && canvasRef.current !== null) {
            const canvas = canvasRef.current;
            const drawShape = () => {
                canvasRef.current && containerRef.current &&
                createCone(canvasRef.current, coordinates, notFirsRender, containerRef.current, rotation)
            };
            const updateCanvasSize = () => {
                canvas.width = canvas.clientWidth;
                canvas.height = canvas.clientHeight;
                drawShape();
            };
            updateCanvasSize();
            const handleResize = () => {
                updateCanvasSize();
            };
            window.addEventListener('resize', handleResize);
            setNotFirstRender(true)
            return () => {
                window.removeEventListener('resize', handleResize);
            };
        }
    }, [coordinates, rotation])

    const calculateCoordinates = async () => {
        if (radius !== '' && height !== '' && segments !== '') {
            const response = await axios.post('https://filcan.ru/cone-server/calculatecoordinates', {
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
        <div className="flex flex-col min-h-screen bg-black">
            <div
                className="overflow-y-auto h-full flex flex-col items-center text-white bg-black min-w-full box-border">
                <h1 className='text-center font-bold text-5xl hidden sm:block'>Create Own Cone!</h1>
                <h1 className='text-center font-bold text-5xl block sm:hidden'>Create Cone!</h1>
                <div className="flex justify-center mt-5 gap-x-4">
                    <Input value={height} setValue={setHeight} label="Height"/>
                    <Input value={radius} setValue={setRadius} label="Radius"/>
                    <Input value={segments} setValue={setSegments} label="Segments"/>
                </div>
                <Button Calculate={calculateCoordinates}>Get Cone Coordinates</Button>
                <div className=' flex flex-1 gap-3'>
                    <Button Rotation={setRotation}>{rotation ? 'Rotation off' : 'Rotation on'}</Button>
                    <Button Rotation={setIsShowPoint}>{isShowPoint ? 'Coordinates off' : 'Coordinates on'}</Button>
                </div>
                {isShowPoint &&
                    <div className='flex gap-5 items-center flex-col'>
                        <p className="text-1xl font-semibold">
                            {coordinates
                                ? <>Apex: X:{coordinates?.apex?.x}, Y:{coordinates?.apex?.y},
                                    Z: {coordinates?.apex?.z}</>
                                : ''
                            }
                        </p>
                        <p className="text-2xl font-semibold"> Coordinates of Pi:</p>
                        <ul>
                            {coordinates?.coordinates.map((v, i) => (
                                <li key={i}> P{i + 1} = X: {v.x.toFixed(7)}, Y: {v.y.toFixed(7)}, Z: {v.z}</li>
                            ))}
                        </ul>
                    </div>}
            </div>
            <div ref={containerRef} className='bg-black flex-1' id="scene-container">
                <canvas className='w-full' ref={canvasRef}/>
            </div>
        </div>
    );
};
export default App;
