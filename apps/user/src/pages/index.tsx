import Responsive from "../components/dev-responsive";
import HomeBanner from "../components/public/sections/home-banner";
import CreatedByYou from "../components/public/sections/home-created";
import AllCredits from "../components/public/sections/home-credits";
import RetireSection from "../components/public/sections/home-how";
import Grassroots from "../components/public/sections/home-support";
import ProjectsFeatured from "../components/public/sections/projects-featured";

const HomePage = () => {
    return (
        <div className="flex h-full w-full flex-col">
            <HomeBanner />
            <ProjectsFeatured />
            <RetireSection />
            <AllCredits />
            <CreatedByYou />
            <Grassroots />
            <Responsive />
        </div>
    );
};

export default HomePage;
