import React from "react";
import { Link } from "react-router-dom";
import illustration from '../assets/Illustration.svg'

function Content() {
    return (
        <>
            <div className='flex pt-28 pl-36'>
                <div className="select-none">
                    <h1 className="text-6xl leading-tight">
                        For you
                        <br />
                        <span className="border-b-4 text-memorize">to memorize</span>
                        <br />
                        words.
                        <br />
                    </h1>
                    <button className="text-2xl bg-memorize rounded-lg p-3 mt-2 text-white hover:opacity-80 transition duration-100 delay-75">
                        <Link to="/collections">Learn more.</Link>
                    </button>
                </div>
                <div className="mx-20 min-w-min ">
                    <img src={illustration} className='bg-body' alt={illustration} />
                </div>
            </div>
        </>
    )
}

export default Content