import { useRouter } from "next/router";
import { toast } from "react-hot-toast";
import { trpc } from "@/utils/trpc";
import logo from "@ecotoken/ui/assets/brand/logo.png";
import Image from "next/image";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { WalletNotConnectedError } from "@solana/wallet-adapter-base";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { useCallback } from "react";
import bs58 from "bs58";

const Login = () => {
    const { publicKey, signMessage } = useWallet();

    const { mutateAsync, isLoading } = trpc.userAuth.login.useMutation({
        retry: false,
        async onSuccess() {
            await router.push("/user");
            toast.success("Login success.");
        },
        onError(e) {
            toast.error(e.message);
        },
    });

    const onClick = useCallback(async () => {
        try {
            // `publicKey` will be null if the wallet isn't connected
            if (!publicKey) throw new WalletNotConnectedError();

            // `signMessage` will be undefined if the wallet doesn't support it
            if (!signMessage)
                throw new Error("Wallet does not support signing messages.");

            // Encode anything as bytes
            const message = new TextEncoder().encode(
                `ecotokens.net wants you to sign in with your Solana account: ${publicKey} Clicking Sign or Approve only means you have proved this wallet is owned by you. This request will not trigger any blockchain transaction or cost any gas fee.`,
            );
            // Sign the bytes using the wallet
            const signature = await signMessage(message);
            // Verify that the bytes were signed using the private key that matches the known public key
            // if (!sign.detached.verify(message, signature, publicKey.toBytes())) throw new Error('Invalid signature!');

            await mutateAsync({
                publicKey: publicKey.toBase58(),
                messageSignature: bs58.encode(signature),
                message: bs58.encode(message),
            });

            console.log(`Message signature: ${bs58.encode(signature)}`);
        } catch (error: any) {
            console.log(`Signing failed: ${error?.message}`);
        }
    }, [publicKey, signMessage]);

    const router = useRouter();

    return (
        <div className="flex h-full w-full flex-col items-center justify-center space-y-4">
            <div className="flex flex-col items-center space-y-4">
                <div className="relative h-12 min-h-[2rem] w-12 min-w-[2rem]">
                    <Image
                        src={logo}
                        alt="ecoToken logo"
                        fill
                        className="object-contain"
                    />
                </div>
                <div className="text-center">
                    <h1 className="appearance-none text-xl font-bold text-slate-700">
                        Login
                    </h1>
                    <h3 className="appearance-none text-sm text-slate-700">
                        Sign-in to your ecoToken account.
                    </h3>
                </div>
                {typeof window !== "undefined" && (
                    <WalletMultiButton onClick={onClick} />
                )}
            </div>
        </div>
    );
};

Login.getLayout = (page: React.ReactElement) => <>{page}</>;
export default Login;
