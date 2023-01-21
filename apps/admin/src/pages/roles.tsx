import { Tab } from "@headlessui/react";

const Roles = () => {
	return (
		<div className="h-full w-full">
			<Tab.Group as="div" className="space-y-8">
				<Tab.List className="space-x-2 border-slate-400">
					<Tab className="ui-selected:bg-slate-500 ui-selected:text-white ui-not-selected:bg-slate-200 ui-not-selected:text-black ui-selected: rounded-md px-4 py-2 duration-150 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-1 focus:ring-offset-slate-200">
						Roles
					</Tab>
					<Tab className="ui-selected:bg-slate-500 ui-selected:text-white ui-not-selected:bg-slate-200 ui-not-selected:text-black ui-selected: ui-selected:focus:ring-slate-500 ui-not-selected:focus:ring-slate-200 rounded-md px-4 py-2 duration-150 focus:outline-none  focus:ring-2 focus:ring-offset-1 focus:ring-offset-slate-200">
						Permissions
					</Tab>
				</Tab.List>
				<Tab.Panels>
					{/* Roles Panel */}
					<Tab.Panel>Roles</Tab.Panel>
					{/* Permissions Panel */}
					<Tab.Panel>Permissions</Tab.Panel>
				</Tab.Panels>
			</Tab.Group>
		</div>
	);
};

export default Roles;
