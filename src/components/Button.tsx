import React, {ReactNode} from 'react';

interface IProps {
    children: React.ReactNode
    Calculate: () => void
}

const MyComponent = ({Calculate, children}: IProps) => {
    return (
        <div>
            <button onClick={() => Calculate()}
                    className='text-center font-bold text-2xl bg-blue-500 border-gray-600 border-2 rounded-lg px-2 m-4'>{children}</button>
        </div>
    );
};

export default MyComponent;
