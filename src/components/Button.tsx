import React, {ReactNode} from 'react';

interface IProps {
    children: React.ReactNode
    Calculate?: () => void
    Rotation?: React.Dispatch<React.SetStateAction<boolean>>
}

const MyComponent = ({Calculate,Rotation, children}: IProps) => {
    return (
        <div>
            <button onClick={() => {
                if (Calculate) Calculate()
                if (Rotation) Rotation(prev=>!prev)
            }}
                    className='text-center font-bold text-2xl bg-green-900 border-gray-600 border-2 rounded-lg px-2 m-4'>{children}</button>
        </div>
    );
};

export default MyComponent;
