export type ComponentGroupProps = React.PropsWithChildren<{
	layout: "horizontal" | "vertical";
}>;
const ComponentGroup: React.FC<ComponentGroupProps> = ({
	layout,
	children
}) => {
	return (
		<div className={`${layout === "vertical" && "flex-col"} flex`}>
			{children}
		</div>
	);
};

export default ComponentGroup;
