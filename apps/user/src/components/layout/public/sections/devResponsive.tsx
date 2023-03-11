const Responsive = () => {
    return (
        <div className="relative my-1 inline-block h-[24px] w-full bg-blue-800 font-mono text-white">
            <div className="absolute top-0 left-0 h-[24px] w-[1536px]  bg-yellow-800">
                <div className="absolute top-0 left-0 h-[24px] w-[1280px] bg-blue-800">
                    <div className="absolute top-0 left-0 h-[24px] w-[1024px]  bg-yellow-800">
                        <div className="absolute top-0 left-0 h-[24px] w-[768px]  bg-blue-800">
                            <div className="absolute top-0 left-0 h-[24px] w-[640px] bg-yellow-800">
                                <div className="absolute top-0 left-0 h-[24px] w-[480px] bg-blue-800 pt-0.5 pr-2 text-right">
                                    <div className="absolute top-0 left-0 h-[24px] w-[414px] bg-yellow-800 pt-0.5 pr-2 text-right">
                                        <div className="absolute top-0 left-0 h-[24px] w-[360px] bg-blue-800 pt-0.5 pr-2 text-right">
                                            360
                                        </div>
                                        <div className="absolute top-0 right-0 pt-0.5 pr-2">
                                            414
                                        </div>
                                    </div>
                                    <div className="absolute top-0 right-0 pt-0.5 pr-2">
                                        480
                                    </div>
                                </div>
                                <div className="absolute top-0 right-0 pt-0.5 pr-2">
                                    sm 640px
                                </div>
                            </div>
                            <div className="absolute top-0 right-0 pt-0.5 pr-2">
                                md 768px
                            </div>
                        </div>
                        <div className="absolute top-0 right-0 pt-0.5 pr-2">
                            lg 1024px
                        </div>
                    </div>
                    <div className="absolute top-0 right-0 pt-0.5 pr-2">
                        xl 1280px
                    </div>
                </div>
                <div className="absolute top-0 right-0 pt-0.5 pr-2">
                    2xl 1536px
                </div>
            </div>
        </div>
    );
};

export default Responsive;
