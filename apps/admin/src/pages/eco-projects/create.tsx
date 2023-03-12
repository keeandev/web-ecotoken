import { useMemo, useState, type ChangeEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { transformEnum } from "@/utils/transformer";
import { trpc } from "@/utils/trpc";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { createId } from "@paralleldrive/cuid2";
import { Country, State } from "country-state-city";
import { toast } from "react-hot-toast";
import { createEcoProjectSchema } from "@ecotoken/api/src/schema/project";
import Button from "@ecotoken/ui/components/Button";
import DefaultCard, {
    CardDescription,
    CardTitle,
} from "@ecotoken/ui/components/Card";
import Form, {
    FormInput,
    FormSelect,
    FormTextArea,
    useZodForm,
} from "@ecotoken/ui/components/Form";

const CreateEcoProject = () => {
    const [images, setImages] = useState<{
        listImage: File | null;
        headOne: File | null;
        headTwo: File | null;
        headThree: File | null;
    }>({
        listImage: null,
        headOne: null,
        headTwo: null,
        headThree: null,
    });
    const router = useRouter();
    const context = trpc.useContext();
    const { mutateAsync, isLoading: isCreatingProject } =
        trpc.ecoProjects.create.useMutation({
            async onSuccess() {
                context.ecoProjects.getAll.invalidate();
                await router.push("/eco-projects");
                toast.success("Project created successfully.");
            },
        });

    const { mutateAsync: createUrls, isLoading: isCreatingUrls } =
        trpc.spaces.createPresignedUrl.useMutation();

    const { data: ecoLocations, isLoading: fetchingEcoLocations } =
        trpc.ecoLocations.getAll.useInfiniteQuery({});

    const { data: users, isLoading: fetchingUsers } =
        trpc.users.getAll.useInfiniteQuery({
            role: ["Producer", "Verifier"],
        });

    const cachedLocations = useMemo(
        () => ecoLocations?.pages.flatMap((page) => page.locations),
        [ecoLocations],
    );

    const cachedUsers = useMemo(
        () => users?.pages.flatMap((page) => page.users),
        [users],
    );

    const producerUsers = useMemo(
        () => cachedUsers?.filter((user) => user.role.role === "Producer"),
        [cachedUsers],
    );

    const verifierUsers = useMemo(
        () => cachedUsers?.filter((user) => user.role.role === "Verifier"),
        [cachedUsers],
    );

    const form = useZodForm({
        schema: createEcoProjectSchema.omit({
            ecoNftID: true,
            ecoTitle: true,
            images: true,
            projectID: true,
        }),
    });

    const handleImageLoad = (e: ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        const key = e.target.name;
        // we have one file and it's in the images JSON object
        if (files && files[0] && key in images) {
            const file = files[0];
            setImages({
                ...images,
                [key]: file,
            });
        }
    };

    const formatCountryAndState = (countryCode: string, stateCode: string) =>
        `${
            State.getStateByCodeAndCountry(stateCode, countryCode)?.name ?? ""
        }, ${Country.getCountryByCode(countryCode)?.name ?? ""}`;

    return (
        <div className="w-full space-y-4">
            <DefaultCard className="flex flex-col space-y-4" size="half">
                <div className="flex space-x-2">
                    <Link href="/eco-projects" className="inline-block">
                        <FontAwesomeIcon
                            icon={faArrowLeft}
                            size="lg"
                            className="mt-1.5 text-slate-400"
                        />
                    </Link>
                    <div>
                        <CardTitle>Create Project</CardTitle>
                        <CardDescription>
                            Create an eco project.
                        </CardDescription>
                    </div>
                </div>
                <Form
                    form={form}
                    onSubmit={async (project) => {
                        if (!images) return;
                        const currentLocation = cachedLocations?.find(
                            (location) =>
                                location.locationID === project.locationID,
                        );
                        if (!currentLocation) return;
                        const projectID = createId();
                        const fileNames = Object.keys(images);
                        const files = Object.values(images);
                        // find the key to use as the image name
                        const findKeyByValue = (image: File | null) =>
                            fileNames.find(
                                (key) =>
                                    images[key as keyof typeof images] ===
                                    image,
                            );

                        const urls = await createUrls(
                            files.map((image) => ({
                                key: `eco-projects/${projectID}/${
                                    findKeyByValue(image) ?? ""
                                }.png`,
                                contentType: "image/png",
                                acl: "public-read",
                            })),
                        );
                        // find which url belongs to which object in the `images` object state
                        for (const url of urls) {
                            const split = url.split("/");
                            let fileName = split[split.length - 1];
                            // split between the last / and the ? <- AWS uses for attributes, to get the file name of this url
                            fileName = fileName?.substring(
                                0,
                                fileName.indexOf("?"),
                            );
                            if (fileName) {
                                const file =
                                    images[
                                        fileName.replace(
                                            ".png",
                                            "",
                                        ) as keyof typeof images
                                    ];
                                await fetch(url, {
                                    method: "PUT",
                                    headers: {
                                        "Content-Type": "image/png",
                                        "x-amz-acl": "public-read",
                                    },
                                    mode: "cors",
                                    body: file,
                                });
                            }
                        }
                        const projectImages = Object.keys(images).map(
                            (imageKey) => ({
                                [imageKey]: `eco-projects/${projectID}/${imageKey}.png`,
                            }),
                        );
                        await mutateAsync({
                            ...project,
                            projectID,
                            ecoNftID: 10,
                            ecoTitle:
                                project.shortTitle +
                                " in " +
                                formatCountryAndState(
                                    currentLocation.cn,
                                    currentLocation.st,
                                ),
                            // eslint-disable-next-line
                            images: Object.assign({}, ...projectImages),
                        });
                    }}
                    className="flex w-fit flex-col gap-4"
                >
                    <FormInput
                        label="Short Title"
                        size="xl"
                        wrapperClass="w-fit"
                        {...form.register("shortTitle")}
                    />
                    <FormSelect
                        label="Project Type"
                        size="xl"
                        wrapperClass="w-fit"
                        {...form.register("ecoType")}
                    >
                        {createEcoProjectSchema.shape.ecoType.options?.map(
                            (type) => (
                                <option key={type} value={type}>
                                    {transformEnum(type)}
                                </option>
                            ),
                        )}
                    </FormSelect>
                    <FormSelect
                        label="Project Status"
                        size="xl"
                        wrapperClass="w-fit"
                        {...form.register("status")}
                    >
                        {createEcoProjectSchema.shape.status.options?.map(
                            (type) => (
                                <option key={type} value={type}>
                                    {transformEnum(type)}
                                </option>
                            ),
                        )}
                    </FormSelect>
                    <FormSelect
                        label="Location"
                        size="xl"
                        wrapperClass="w-fit"
                        defaultValue=""
                        {...form.register("locationID")}
                    >
                        <option value="" hidden></option>
                        {cachedLocations?.map((location) => (
                            <option
                                key={location.locationID}
                                value={location.locationID}
                            >
                                {`${location.location}, 
								${formatCountryAndState(location.cn, location.st)}`}
                            </option>
                        ))}
                    </FormSelect>
                    <FormSelect
                        label="Verifier"
                        size="xl"
                        wrapperClass="w-fit"
                        defaultValue=""
                        {...form.register("vfyUserID")}
                    >
                        <option value="" hidden></option>
                        {verifierUsers?.map((user) => (
                            <option key={user.userID} value={user.userID}>
                                {user.username}
                                {" - "}
                                {user.email}
                            </option>
                        ))}
                    </FormSelect>
                    <FormSelect
                        label="Producer"
                        size="xl"
                        wrapperClass="w-fit"
                        defaultValue=""
                        {...form.register("producerID")}
                    >
                        <option value="" hidden></option>
                        {producerUsers?.map((user) => (
                            <option key={user.userID} value={user.userID}>
                                {user.username}
                                {" - "}
                                {user.email}
                            </option>
                        ))}
                    </FormSelect>
                    <FormInput
                        label="Eco URL"
                        size="xl"
                        wrapperClass="w-fit"
                        {...form.register("ecoUrl")}
                    />
                    <FormInput
                        name="listImage"
                        label="List Image"
                        size="xl"
                        wrapperClass="w-fit"
                        type="file"
                        onChange={handleImageLoad}
                    />
                    <FormInput
                        name="headOne"
                        label="1st Image"
                        size="xl"
                        wrapperClass="w-fit"
                        type="file"
                        onChange={handleImageLoad}
                    />
                    <FormInput
                        name="headTwo"
                        label="2nd Head Image"
                        size="xl"
                        wrapperClass="w-fit"
                        type="file"
                        onChange={handleImageLoad}
                    />
                    <FormInput
                        name="headThree"
                        label="3rd Head Image"
                        size="xl"
                        wrapperClass="w-fit"
                        type="file"
                        onChange={handleImageLoad}
                    />
                    <FormTextArea
                        label="Intro"
                        width="xl"
                        height="md"
                        wrapperClass="w-fit"
                        {...form.register("intro")}
                    />
                    <FormTextArea
                        label="Project"
                        width="xl"
                        height="md"
                        wrapperClass="w-fit"
                        {...form.register("project")}
                    />
                    <FormTextArea
                        label="Overview"
                        width="xl"
                        wrapperClass="w-fit"
                        {...form.register("overview")}
                    />
                    <FormInput
                        label="Fund Amount"
                        type="number"
                        size="xl"
                        wrapperClass="w-fit"
                        {...form.register("fundAmount", {
                            valueAsNumber: true,
                        })}
                    />
                    <FormInput
                        label="Fund Recieved"
                        type="number"
                        size="xl"
                        wrapperClass="w-fit"
                        {...form.register("fundRecieved", {
                            valueAsNumber: true,
                        })}
                    />
                    <FormInput
                        label="Return"
                        type="number"
                        size="xl"
                        wrapperClass="w-fit"
                        {...form.register("return", {
                            valueAsNumber: true,
                        })}
                    />
                    <FormInput
                        label="Payback"
                        size="xl"
                        wrapperClass="w-fit"
                        {...form.register("payback")}
                    />
                    <FormInput
                        label="Start Date"
                        type="date"
                        size="xl"
                        wrapperClass="w-fit"
                        {...form.register("dateStart", {
                            valueAsDate: true,
                        })}
                    />
                    <FormInput
                        label="End Date"
                        type="date"
                        size="xl"
                        wrapperClass="w-fit"
                        {...form.register("dateEnd", {
                            valueAsDate: true,
                        })}
                    />
                    <FormInput
                        label="Visible"
                        type="checkbox"
                        size="xl"
                        wrapperClass="w-fit"
                        defaultChecked
                        {...form.register("isVisible")}
                    />
                    <Button
                        fullWidth
                        loading={
                            fetchingUsers ||
                            fetchingEcoLocations ||
                            isCreatingProject ||
                            isCreatingUrls
                        }
                    >
                        Create Project
                    </Button>
                </Form>
            </DefaultCard>
        </div>
    );
};

export default CreateEcoProject;
