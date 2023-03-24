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

import Link from "next/link";
import { useRouter } from "next/router";
import OrderModal from "@/components/eco-project/order-modal";
import { trpc } from "@/utils/trpc";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Transition } from "@headlessui/react";
import { toast } from "react-hot-toast";
import { CardDescription, CardTitle } from "@ecotoken/ui/components/Card";

const OrderCredits = () => {
    const router = useRouter();
    const { mutateAsync, isLoading: isCreatingOrder } =
        trpc.ecoOrders.create.useMutation({
            async onSuccess() {
                await router.push("/eco-projects/orders");
                toast.success("Order created successfully.");
            },
        });

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
                <Link href="/eco-projects/orders" className="inline-block">
                    <FontAwesomeIcon
                        icon={faArrowLeft}
                        size="lg"
                        className="mt-1.5 text-slate-400"
                    />
                </Link>
                <div>
                    <CardTitle>Purchase Credits</CardTitle>
                    <CardDescription>
                        Purchase some carbon credits.
                    </CardDescription>
                </div>
            </div>
            <OrderModal
                admin
                onOrder={(order) => {
                    void mutateAsync({
                        ...order,
                        payAmount: 0.5,
                        payFee: 0.1,
                        payHash: "bsmomboisdmfsbosd",
                        userWallet: "sdjfldskj",
                    });
                }}
                creditType="RH20"
                loading={isCreatingOrder}
            />
        </Transition>
    );
};

export default OrderCredits;
