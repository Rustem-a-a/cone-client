import React, {useState} from 'react';
import Input from "./components/Input";
const App = () => {
    const [height, setHeight] = useState<string>('');
    const [radius, setRadius] = useState<string>('');
    const [segments, setSegments] = useState<string>('');



    return (
        <div className="bg-black">
                <h1 className='text-center font-bold text-5xl'>Create Own Cone!</h1>
                <div className="flex justify-center mt-5">
                    <Input value={height} setValue={setHeight} label="Cone Height" />
                    <Input value={radius} setValue={setRadius} label="Cone Radius"/>
                    <Input value={segments} setValue={setSegments} label="Cone Segments"/>
                </div>
        </div>
    );
};
export default App;