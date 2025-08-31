import React from 'react'
import GwocBG from './GwocBG.png'
import GwocF from './GwocF.png'

const Gwoc = () => {
    return (
        <div className='w-full h-screen overflow-auto'>
            <div className='w-full h-full relative overflow-auto'>
                <div className='w-full h-full z-10 relative overflow-auto'>
                    <img className='w-full h-full object-cover absolute object-[0%_79%] top-0 left-0 z-10' src={GwocBG} alt="" />
                    <span className='text-[11rem] z-20 absolute font-[main] uppercase top-20 left-20'>GREAT WALL OF CHINA</span>
                    <img className='w-full h-full object-cover object-[0%_80%] scale-[1] absolute bottom-0 left-0 z-30' src={GwocF} alt="" />
                </div>
            </div>
        </div>
    )
}

export default Gwoc