import { Render } from './class-render';
import { Route } from  './class-route';
import { Question } from "./types/class-question";
import { Leaf } from "./types/class-leaf";
import {Reset} from "./controls/class-reset";
import {Controls} from "./class-controls";
import { Visual_Tree as Visual_Tree_Control } from './controls/class-visual-tree';
import {Visual_Tree} from "./class-visual-tree";
import {Redirect} from "./actions/class-redirect";
import {Action} from "./types/class-action";

export const IDT_ERROR_CODES: Record<string, string> = {
    "-1": "DIV/Element not found",
    "-2": "Element not intialized"
};

export const IDT_TYPES: Record<string, any> = {
    "question": new Question(),
    "leaf": new Leaf(),
    "action": new Action(),
}

export const IDT_ACTIONS: Record<string, any> = {
    "redirect":  new Redirect()
};

export const IDT_CONTROLS: Record<string, any> = {
    "reset": new Reset(),
    "visual_tree": new Visual_Tree_Control()
};

export const IDT_Render: Render = new Render();
export const IDT_Route: Route = new Route();
export const IDT_Controls: Controls = new Controls();
export const IDT_Visual_Tree: Visual_Tree = new Visual_Tree();