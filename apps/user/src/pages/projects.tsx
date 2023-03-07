import ProjectCard from "@/components/project/project-card";
import PublicNavbar from "@/components/layout/public/navbar";
import { type NextPageWithLayout } from "./_app";

const ProjectsList: NextPageWithLayout = () => {
	return (
		<div className="flex h-full w-full items-center justify-center">
			<PublicNavbar />
			<ProjectCard
				title="title"
				images={{
					listImage:
						"https://www.eco-token.io/images/ecoproject/head_mitchell_cows01.jpg"
				}}
				intro="intro"
				location="location"
				status="FUNDED"
				url="ecourl"
			/>
		</div>
	);
};

ProjectsList.getLayout = (page) => <>{page}</>;

export default ProjectsList;
