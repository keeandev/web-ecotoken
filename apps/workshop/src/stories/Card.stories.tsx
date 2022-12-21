import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import Card from "@ecotoken/ui/components/Card";
import Button from "@ecotoken/ui/components/Button";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
	title: "Components/Card",
	component: Card,
	argTypes: {
		size: {
			options: [
				"default",
				// "sm",
				// "md",
				// "lg",
				// "xl",
				"quarter",
				"half",
				"third",
				"twoThird",
				"threeQuarter",
				"full"
			],
			control: { type: "select" }
		}
	}
	// More on argTypes: https://storybook.js.org/docs/react/api/argtypes
} as ComponentMeta<typeof Card>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof Card> = (args) => <Card {...args} />;

export const Primary = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Primary.args = {
	children: <Button>Primary</Button>,
	size: "default"
};

export const Secondary = Template.bind({});
Secondary.args = {
	children: <Button intent="secondary">Primary</Button>,
	size: "default"
};
