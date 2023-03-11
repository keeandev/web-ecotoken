import HomeBanner from "../components/layout/public/sections/homeBanner";
import ProjectsFeatured from "../components/layout/public/sections/projectsFeatured";
import RetireSection from "../components/layout/public/sections/homeRetire";
import AllCredits from "../components/layout/public/sections/homeAllCredits";
import CreatedByYou from "../components/layout/public/sections/homeCreated";
import Grassroots from "../components/layout/public/sections/homeGrassroots";
import Responsive from "../components/layout/public/sections/devResponsive";

const HomePage = () => {
    return (
        <div className="flex h-full w-full flex-col">
            <HomeBanner />
            <ProjectsFeatured />
            <RetireSection />
            <AllCredits />
            <CreatedByYou />
            <Grassroots />
            {/* <Responsive /> */}
        </div>
    );
};

export default HomePage;
