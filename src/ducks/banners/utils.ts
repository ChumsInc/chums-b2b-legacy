import {Banner} from "b2b-types";

export const bannerSorter = (a:Banner, b:Banner) => ((a.priority ?? a.id) - (b.priority ?? b.id));
