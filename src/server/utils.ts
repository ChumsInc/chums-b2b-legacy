import 'dotenv/config';
import Debug from 'debug';
import {NextFunction, Request, Response} from "express";
import fetch from 'isomorphic-fetch';
import {Keyword} from "b2b-types";
import {API_PORT} from "./config";

const debug = Debug('chums:server:utils');

export const handleInvalidURL = (req:Request, res:Response, next: NextFunction) => {
    try {
        decodeURI(req.url);
        next();
    } catch(err:unknown) {
        if (err instanceof Error) {
            res.status(404).json({error: err.message});
            return;
        }
        res.status(404).json({error: 'Invalid URL'});
    }
}

export const getAPIRequest = async (req:Request, res:Response) => {
    try {
        const result = await loadJSON(`http://localhost:${process.env.API_PORT}` + req.path);
        res.json(result);
    } catch(err:unknown) {
        if (err instanceof Error) {
            debug("getAPIRequest()", err.message);
            return res.json({error: err.message, name: err.name});
        }
        res.json({error: 'unknown error in getAPIRequest'});
    }
}

export async function loadJSON<T = any>(url:string, options?:RequestInit):Promise<T> {
    try {
        const res = await fetch(url, options);
        return await res.json() as T;
    } catch(err:unknown) {
        if (err instanceof Error) {
            console.debug("loadJSON()", err.message);
            return Promise.reject(err);
        }
        console.debug("loadJSON()", err);
        return Promise.reject(new Error('Error in loadJSON()'));
    }
}
export async function loadKeywords():Promise<Keyword[]> {
    try {
        const url = `http://localhost:${API_PORT}/keywords`;
        const response = await loadJSON<{result: Keyword[]}>(url);
        return response?.result ?? [];
    } catch(err:unknown) {
        if (err instanceof Error) {
            console.debug("loadKeywords()", err.message);
            return Promise.reject(err);
        }
        console.debug("loadKeywords()", err);
        return Promise.reject(new Error('Error in loadKeywords()'));
    }
}
