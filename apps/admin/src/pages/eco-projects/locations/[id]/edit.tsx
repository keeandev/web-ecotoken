/*
 * Copyright (C) 2023 EcoToken Systems
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 */

import React, { Fragment } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { trpc } from "@/utils/trpc";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Transition } from "@headlessui/react";
import { Country, State } from "country-state-city";
import { toast } from "react-hot-toast";
import { updateEcoLocationSchema } from "@ecotoken/api/src/schema/location";
import Button from "@ecotoken/ui/components/Button";
import { CardDescription, CardTitle } from "@ecotoken/ui/components/Card";
import Form, {
    FormInput,
    FormSelect,
    useZodForm,
} from "@ecotoken/ui/components/Form";

export const EditEcoLocation: React.FC = () => {
    const router = useRouter();
    const context = trpc.useContext();

    const { id } = router.query;
    const { data: location, isLoading: isFetching } =
        trpc.ecoLocations.get.useQuery(
            {
                locationID: id as string,
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

    const { mutateAsync: editMutate, isLoading: isUpdating } =
        trpc.ecoLocations.update.useMutation({
            onSuccess: async () => {
                await context.ecoLocations.getAll.invalidate();
                await context.ecoLocations.get.invalidate({
                    locationID: id as string,
                });
                toast.success("Location has been edited.");
            },
            onError(e) {
                toast.error(e.message);
            },
        });

    const { mutateAsync: deleteMutate, isLoading: isDeleting } =
        trpc.ecoLocations.delete.useMutation({
            onSuccess: async () => {
                await context.ecoLocations.getAll.invalidate();
                await router.push("/eco-projects/locations");
                toast.success("Location has been deleted.");
            },
            onError(e) {
                toast.error(e.message);
            },
        });

    const form = useZodForm({
        schema: updateEcoLocationSchema,
        reValidateMode: "onChange",
    });

    const country = form.watch("cn");

    return (
        <Transition
            as={Fragment}
            show
            appear
            enter="ease-out duration-500"
            enterFrom="opacity-0 -translate-y-2"
            enterTo="opacity-100 translate-y-0"
            leave="ease-in duration-500"
            leaveFrom="opacity-100 translate-y-0"
            leaveTo="opacity-0 -translate-y-2"
        >
            <div className="space-y-4">
                <div className="flex space-x-2">
                    <Link
                        href="/eco-projects/locations"
                        className="inline-block"
                    >
                        <FontAwesomeIcon
                            icon={faArrowLeft}
                            size="lg"
                            className="mt-1.5 text-slate-400"
                        />
                    </Link>
                    <div>
                        <CardTitle>Edit Location</CardTitle>
                        <CardDescription>
                            Update a location for ecoProjects.
                        </CardDescription>
                    </div>
                </div>
                <Form
                    form={form}
                    className="flex w-full flex-col gap-4"
                    onSubmit={async (location) => {
                        await editMutate({
                            ...location,
                        });
                    }}
                >
                    <FormInput
                        label="Location"
                        size="full"
                        {...form.register("location")}
                    />
                    <FormSelect
                        label="Country"
                        size="full"
                        defaultValue=""
                        {...form.register("cn")}
                    >
                        <option value="" hidden></option>
                        {Country.getAllCountries().map((country) => (
                            <option
                                key={country.isoCode}
                                value={country.isoCode}
                            >
                                {country.name}
                            </option>
                        ))}
                    </FormSelect>
                    <FormSelect
                        label="State/Province"
                        size="full"
                        defaultValue=""
                        {...form.register("st")}
                    >
                        <option value="" hidden></option>
                        {country &&
                            State.getStatesOfCountry(country).map((country) => (
                                <option
                                    key={country.isoCode}
                                    value={country.isoCode}
                                >
                                    {country.name}
                                </option>
                            ))}
                    </FormSelect>
                    <div className="space-y-1.5">
                        <Button loading={isUpdating || isFetching} fullWidth>
                            Update
                        </Button>
                        <Button
                            intent="destructive"
                            type="button"
                            loading={isDeleting}
                            fullWidth
                            onClick={() => {
                                if (location)
                                    void deleteMutate({
                                        locationID: location?.locationID,
                                    });
                            }}
                        >
                            Delete
                        </Button>
                    </div>
                </Form>
            </div>
        </Transition>
    );
};

export default EditEcoLocation;
