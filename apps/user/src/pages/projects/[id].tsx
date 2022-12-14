import { useRouter } from "next/router";

const ProjectDetails = () => {
	const router = useRouter();
	const { id } = router.query;
	return <>{id}</>;
};

export default ProjectDetails;
