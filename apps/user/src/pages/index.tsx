import PublicNavbar from "@/components/public/navbar";
import Link from "next/link";
import { NextPageWithLayout } from "./_app";

const HomePage: NextPageWithLayout = () => {
	return (
		<div className="flex h-full w-full items-center justify-center">
			<PublicNavbar />
			Home
		</div>
	);
};

HomePage.getLayout = (page) => <>{page}</>;

export default HomePage;
