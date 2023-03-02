import { type NextPage } from "next";
import ImagePicker from "@ecotoken/ui/components/ImagePicker";
import FileUpload from "@ecotoken/ui/components/FileUpload";
import { faImage } from "@fortawesome/free-solid-svg-icons";

const Home: NextPage = () => {
	return (
		<div className="w-full">
			<div className="block w-fit bg-cyan-400 p-4">
				Dashboard (index.tsx)
			</div>
			{/* <ImagePicker
                aspect={16 / 9}
				width={500}
				height={500}
				border="dashed"
				style="rectange"
			/> */}
			<FileUpload defaultIcon={faImage} />
		</div>
	);
};

export default Home;
