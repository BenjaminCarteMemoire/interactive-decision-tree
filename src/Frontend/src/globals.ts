import { Render } from './class-render';
import { Route } from  './class-route';
import { Question } from "./types/class-question";
import { Leaf } from "./types/class-leaf";

export const IDT_ERROR_CODES: Record<string, string> = {
    "-1": "DIV/Element not found",
    "-2": "Element not intialized"
};

export const IDT_TYPES: Record<string, any> = {
    "question": new Question(),
    "leaf": new Leaf(),
}

export const IDT_Render: Render = new Render();
export const IDT_Route: Route = new Route();