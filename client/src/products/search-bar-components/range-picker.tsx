type LocalParams = {
    minState: [number, React.Dispatch<React.SetStateAction<number>>],
    maxState: [number, React.Dispatch<React.SetStateAction<number>>]
}

const RangePicker = (params: LocalParams) => {
    const {minState, maxState} = params;
    const [minStateValue, setMinState] = minState;
    const [maxStateValue, setMaxState] = maxState;

    const handleMinBlur = (e: any) => {
        const newValue = Number(e.target.value);
        if(newValue > maxStateValue) setMaxState(newValue + 100);
        if(newValue < 0) setMinState(0);
    }

    const handleMaxBlur = (e: any) => {
        const newValue = Number(e.target.value);
        if(newValue < minStateValue) setMaxState(minStateValue + 1);
    }

    return <div>
        <input type="number" value={minStateValue} onChange={e => setMinState(Number(e.target.value))} onBlur={handleMinBlur}/>
        <input type="number" value={maxStateValue} onChange={e => setMaxState(Number(e.target.value))} onBlur={handleMaxBlur}/>
    </div>
}

export default RangePicker;