import { trpc } from "@/utils/trpc";
import { createUserSchema } from "@ecotoken/api/src/schema/user";
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
import generator from "generate-password";
import Link from "next/link";
import { useRouter } from "next/router";
import { useMemo } from "react";
import { toast } from "react-hot-toast";

const CreateUser = () => {
    const router = useRouter();
    const context = trpc.useContext();

    const { mutateAsync, isLoading } = trpc.users.create.useMutation({
        async onSuccess(data) {
            await router.push(`/users/${data?.userID}/edit`);
            await context.users.getAll.invalidate();
            toast.success("User created successfully.");
        },
        onError(e) {
            toast.error(e.message);
        },
    });

    const form = useZodForm({
        schema: createUserSchema,
    });

    const { data: roles, isLoading: fetchingRoles } =
        trpc.roles.getAll.useInfiniteQuery({});

    const mappedRoles = useMemo(
        () => roles?.pages.flatMap((page) => page.roles),
        [roles],
    );

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
                    <CardTitle>Create User</CardTitle>
                    <CardDescription>
                        Create a user in the database.
                    </CardDescription>
                </div>
            </div>
            <Form
                form={form}
                onSubmit={async (data) => {
                    await mutateAsync({ ...data });
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
                <div>
                    <div className="flex flex-col gap-4 md:flex-row">
                        <FormInput
                            label="Password"
                            {...form.register("password")}
                        />
                        <FormInput
                            label="Confirm Password"
                            {...form.register("confirmPassword", {
                                deps: ["password"],
                                validate: (value) => {
                                    const { password } = form.getValues();
                                    return (
                                        password === value ||
                                        "Passwords don't match!"
                                    );
                                },
                            })}
                        />
                    </div>
                    <span
                        className="cursor-pointer select-none text-xs text-slate-400 underline underline-offset-2 ease-linear hover:text-slate-500"
                        onClick={() => {
                            const password = generator.generate({
                                length: 20,
                                numbers: true,
                                symbols: true,
                                strict: true,
                            });
                            form.setValue("password", password);
                            form.setValue("confirmPassword", password);
                        }}
                    >
                        Generate a secure password automatically
                    </span>
                </div>
                <Button
                    loading={isLoading || fetchingRoles || fetchingRoles}
                    fullWidth
                >
                    Create
                </Button>
            </Form>
        </Transition>
    );
};

export default CreateUser;
