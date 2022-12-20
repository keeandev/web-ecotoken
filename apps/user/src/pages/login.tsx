import { useWeb3Auth } from "@/contexts/web3auth";
import Button from "@ecotoken/ui/components/Button";

const Login = () => {
	const web3auth = useWeb3Auth();
	return <Button onClick={() => web3auth.login()} loading={web3auth.loading || !web3auth.web3auth}>Login</Button>;
};

Login.getLayout = (page: React.ReactElement) => <>{page}</>;
export default Login;
