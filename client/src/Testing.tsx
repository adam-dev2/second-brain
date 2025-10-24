import {useRecoilValue, useSetRecoilState } from "recoil"
import { counterAtom } from "./store/atoms/counter"

const Testing = () => {
    return (
        <>
        <div>
            <CurrentCounter />
            <Decrease />
            <Increase />
        </div>
    </>
  )
}

function CurrentCounter() {
    const count = useRecoilValue(counterAtom)
    return (
        <>
            <h1 className="text-2xl text-gray-50">{count}</h1>
        </>
    )
}

function Decrease() {
    const setCount = useSetRecoilState(counterAtom)
    function decrease() {
        setCount(c => c-1)
    }

    return (
        <>
            <div>
                <button className="text-lg text-black p-3 bg-blue-50 rounded-2xl mb-4 cursor-pointer hover:scale-102" onClick={decrease}>Decrease</button>
            </div>
        </>
    )
}

function Increase() {
    const setCount = useSetRecoilState(counterAtom)
    function increase() {
        setCount(c => c+1)
    }

    return (
        <>
            <div>
                <button className="text-lg text-black p-3 bg-red-50 rounded-2xl cursor-pointer hover:scale-102" onClick={increase}>Increase</button>
            </div>
        </>
    )
}
export default Testing