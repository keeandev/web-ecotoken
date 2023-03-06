import { trpc } from "@/utils/trpc";
import { updateUserSchema } from "@ecotoken/api/src/schema/user";
import Button from "@ecotoken/ui/components/Button";
import { CardDescription, CardTitle } from "@ecotoken/ui/components/Card";
import Form, {
    FormInput,
    FormSelect,
    useZodForm,
} from "@ecotoken/ui/components/Form";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Transition } from "@headlessui/react";
import { useRouter } from "next/router";
import { useMemo } from "react";
import Link from "next/link";
import { toast } from "react-hot-toast";
import Spinner from "@ecotoken/ui/components/Spinner";

const EditUser: React.FC = () => {
    const router = useRouter();
    const context = trpc.useContext();

    let { id } = router.query;
    if (typeof id !== "string" && typeof id !== "undefined") id = id[0];
    if (!id) id = "";

    const { data: user, isLoading: fetchingUser } = trpc.users.get.useQuery(
        {
            userID: id,
        },
        {
            enabled: !!id,
            onSuccess(data) {
                form.reset({
                    ...data,
                });
            },
        },
    );

    const { mutateAsync: editUser, isLoading } = trpc.users.update.useMutation({
        async onSuccess() {
            await context.users.getAll.invalidate();
            await context.users.get.invalidate({
                userID: id as string,
            });
            toast.success("User has been updated.");
        },
        onError(e) {
            toast.error(e.message);
        },
    });
    const { mutateAsync: deleteUser, isLoading: isDeleting } =
        trpc.users.delete.useMutation({
            onSuccess: async () => {
                await context.users.getAll.invalidate();
                router.push("/users");
                toast.success("User has been deleted.");
            },
            onError(e) {
                toast.error(e.message);
            },
        });

    const { data: roles, isLoading: fetchingRoles } =
        trpc.roles.getAll.useInfiniteQuery({});

    const mappedRoles = useMemo(
        () => roles?.pages.flatMap((page) => page.roles),
        [roles],
    );

    const form = useZodForm({
        schema: updateUserSchema,
    });
    if (!user) {
        if (fetchingUser) return <Spinner />;
        else {
            toast.error("User does not exist.");
            router.push("/users");
            return null;
        }
    }
    return (
        <Transition
            show
            appear
            enter="ease-out duration-500"
            enterFrom="opacity-0 -translate-y-2"
            enterTo="opacity-100 translate-y-0"
            leave="ease-in duration-500"
            leaveFrom="opacity-100 translate-y-0"
            leaveTo="opacity-0 -translate-y-2"
            className="space-y-4"
        >
            <div className="flex space-x-2">
                <Link href="/users" className="inline-block">
                    <FontAwesomeIcon
                        icon={faArrowLeft}
                        size="lg"
                        className="mt-1.5 text-slate-400"
                    />
                </Link>
                <div>
                    <CardTitle>Edit User</CardTitle>
                    <CardDescription>
                        Update a user in the database.
                    </CardDescription>
                </div>
            </div>
            <Form
                form={form}
                onSubmit={async (user) => {
                    await editUser({
                        ...user,
                        userID: id as string,
                    });
                }}
                className="flex w-full flex-col gap-4"
            >
                <FormSelect label="Role" {...form.register("roleID")}>
                    {mappedRoles?.map((role) => (
                        <option key={role.roleID} value={role.roleID}>
                            {role.role}
                        </option>
                    ))}
                </FormSelect>
                <FormInput
                    wrapperClass="w-full"
                    label="Company Name"
                    size="full"
                    {...form.register("companyName")}
                />
                <FormInput
                    wrapperClass="w-full"
                    label="Wallet Address"
                    size="full"
                    {...form.register("walletAddress")}
                />
                <div className="flex flex-col gap-4 md:flex-row">
                    <FormInput
                        wrapperClass="w-full"
                        label="First Name"
                        size="full"
                        className="flex flex-1"
                        {...form.register("firstName")}
                    />
                    <FormInput
                        label="Last Name"
                        size="full"
                        wrapperClass="w-full"
                        className="flex flex-1"
                        {...form.register("lastName")}
                    />
                </div>
                <div className="flex flex-col gap-4 md:flex-row">
                    <FormInput
                        label="Username"
                        {...form.register("username")}
                    />
                    <FormInput
                        label="Email"
                        type="email"
                        {...form.register("email")}
                    />
                </div>
                <div className="w-full space-y-1.5">
                    <Button
                        loading={isLoading || fetchingUser || fetchingRoles}
                        fullWidth
                    >
                        Update
                    </Button>
                    <Button
                        intent="destructive"
                        type="button"
                        fullWidth
                        loading={isDeleting}
                        onClick={async () => {
                            await deleteUser({
                                userID: id as string,
                            });
                        }}
                    >
                        Delete
                    </Button>
                </div>
            </Form>
        </Transition>
    );
};

export default EditUser;
