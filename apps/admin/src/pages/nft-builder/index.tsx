import DefaultCard, {
	CardDescription,
	CardTitle
} from "@ecotoken/ui/components/Card";

const NFTBuilder = () => {
	return (
		<div>
			<DefaultCard>
				<CardTitle>NFT Builder</CardTitle>
				<CardDescription>
					Construct an NFT based on some attributes.
				</CardDescription>
			</DefaultCard>
		</div>
	);
};

export default NFTBuilder;
