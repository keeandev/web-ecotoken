import { useWeb3Auth } from "@/contexts/web3auth";
import Button from "@ecotoken/ui/components/Button";

const Login = () => {
	const web3auth = useWeb3Auth();
	return <Button onClick={() => web3auth.login()}>Login</Button>;
};

Login.getLayout = (page: React.ReactElement) => <>{page}</>;
export default Login;
