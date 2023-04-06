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
import { userEvent, within } from "@storybook/testing-library";

import { Page } from "./Page";

const meta: Meta<typeof Page> = {
    title: "Example/Page",
    component: Page,
    parameters: {
        // More on how to position stories at: https://storybook.js.org/docs/7.0/react/configure/story-layout
        layout: "fullscreen",
    },
};

export default meta;
type Story = StoryObj<typeof Page>;

export const LoggedOut: Story = {};

// More on interaction testing: https://storybook.js.org/docs/7.0/react/writing-tests/interaction-testing
export const LoggedIn: Story = {
    play: ({ canvasElement }) => {
        const canvas = within(canvasElement);
        const loginButton = canvas.getByRole("button", {
            name: /Log in/i,
        });
        userEvent.click(loginButton);
    },
};
