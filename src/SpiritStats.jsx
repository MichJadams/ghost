import React, { useEffect, useRef, useState, useCallback } from 'react';


function SpiritStats(){
    const [hungry, setHungry] = useState(5);
    const [scared, setScared] = useState(5);
    const [tired, setTired] = useState(5);


    return (
        <div className='flex-col'>
            <h3>Spirit Stats</h3>
            <table>
                <thead>
                <tr>
                    <td>hungry</td>
                    <td>scared</td>
                    <td>tired</td>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td>{hungry}</td>
                    <td>{scared}</td>
                    <td>{tired}</td>
                </tr>
                </tbody>
            </table>
        </div>
    )
    
}

export default SpiritStats