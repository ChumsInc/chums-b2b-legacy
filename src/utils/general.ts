import {LoadStatus} from "@/types/generic";

export const noop = () => {};
const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export const isValidEmailAddress = (emailAddress:string):boolean => {
    return emailRegex.test(emailAddress);
};

export const fetchStatusToLoadStatus = (value:'FETCH_INIT'|'FETCH_SUCCESS'|'FETCH_FAILURE'):LoadStatus => {
    switch (value) {
        case 'FETCH_INIT':
            return 'pending';
        case 'FETCH_FAILURE':
            return 'rejected'
    }
    return 'idle';
}
