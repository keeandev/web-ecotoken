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

import { type Meta, type StoryObj } from "@storybook/react";

import { Button } from "./Button";

// More on how to set up stories at: https://storybook.js.org/docs/7.0/react/writing-stories/introduction
const meta: Meta<typeof Button> = {
    title: "Example/Button",
    component: Button,
    tags: ["autodocs"],
    argTypes: {
        backgroundColor: {
            control: "color",
        },
    },
};

export default meta;
type Story = StoryObj<typeof Button>;

// More on writing stories with args: https://storybook.js.org/docs/7.0/react/writing-stories/args
export const Primary: Story = {
    args: {
        primary: true,
        label: "Button",
    },
};

export const Secondary: Story = {
    args: {
        label: "Button",
    },
};

export const Large: Story = {
    args: {
        size: "large",
        label: "Button",
    },
};

export const Small: Story = {
    args: {
        size: "small",
        label: "Button",
    },
};
