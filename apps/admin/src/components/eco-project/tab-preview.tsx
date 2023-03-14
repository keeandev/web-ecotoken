const tabs = [
    { key: "none", title: "None" },
    { key: "projectcard", title: "Project Card" },
    { key: "projectpage", title: "Project Page" },
    { key: "thiscontent", title: "This Content" },
];
const TabPreview = () => {
    return (
        <div className="bg-slate-200 px-5">
            <label>Preview: |</label>
            {tabs.map((tab) => {
                return (
                    <button key={tab.key} className="p-2">
                        {tab.title}&nbsp;&nbsp; |
                    </button>
                );
            })}
        </div>
    );
};

export default TabPreview;
