import { type NextPage } from "next";
import ImagePicker from "@ecotoken/ui/components/ImagePicker";

const Home: NextPage = () => {
	return (
		<div className="w-full">
			<div className="block w-fit bg-cyan-400 p-4">
				Dashboard (index.tsx)
			</div>
			<ImagePicker width={500} height={500} />
		</div>
	);
};

export default Home;
