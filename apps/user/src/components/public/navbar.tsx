import Link from "next/link";

const PublicNavbar = () => {
	return (
		<nav>
			Menu | <Link href="/projects">Projects</Link> |{" "}
			<Link href="/login">Login</Link>
		</nav>
	);
};

export default PublicNavbar;
