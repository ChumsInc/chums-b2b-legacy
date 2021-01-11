export const noop = () => {};
const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export const isValidEmailAddress = (emailAddress) => {
    return emailRegex.test(emailAddress);
};

export const getClassName = (className, val) => {
    switch (typeof className) {
    case 'function':
        const _className = className(val);
        if (typeof _className === 'object') {
            return {
                ..._className,
            };
        }
        return {[_className]: true};
    case 'object':
        return {...className};
    default:
        return {[className]: true};
    }
};

