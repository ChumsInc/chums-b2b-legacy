import {MenuItem} from "b2b-types";

export const defaultFormatter = (val: string) => val;

export const defaultMenuSorter = (a: MenuItem, b: MenuItem) => a.priority === b.priority
    ? (
        a.title.toLocaleLowerCase() === b.title.toLocaleLowerCase()
            ? 0
            : (a.title.toLocaleLowerCase() > b.title.toLocaleLowerCase() ? 1 : -1)
    )
    : (a.priority > b.priority ? 1 : -1);



export const defaultMenuItem:MenuItem = {
    title: '',
    url: '',
    id: 0,
    description: '',
    className: '',
    parentId: 0,
    priority: 0,
    status: true,
}
