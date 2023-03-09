import HomeBanner from "../components/public/sections/homeBanner";
import ProjectsFeatured from "../components/public/sections/projectsFeatured";
import RetireSection from "../components/public/sections/homeRetire";
import AllCredits from "../components/public/sections/homeAllCredits";
import CreatedByYou from "../components/public/sections/homeCreated";
import Grassroots from "../components/public/sections/homeGrassroots";

const HomePage = () => {
    return (
        <div className="flex h-full w-full flex-col">
            <HomeBanner />
            <ProjectsFeatured />
            <RetireSection />
            <AllCredits />
            <CreatedByYou />
            <Grassroots />
        </div>
    );
};

export default HomePage;
