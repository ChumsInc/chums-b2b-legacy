/**
 * Created by steve on 1/10/2017.
 */

export default class UPCA {
    static CHUMS = '000298';
    static raw (upc) {
        let re = /[0-9]/;
        return upc.split('')
            .filter(c => re.test(c))
            .join('');
    }

    static format(upc) {
        if (typeof upc !== "string") {
            return upc;
        }


        upc = UPCA.raw(upc);

        if (upc.length === 5) {
            upc = UPCA.CHUMS + upc;
        }

        if (upc.length !== 11 && upc.length !== 12) {
            return upc;
        }

        return upc.substr(0, 1)
            + " "
            + upc.substr(1, 5)
            + " "
            + upc.substr(6, 5)
            + " "
            + UPCA.checkdigit(upc);
    }

    static checkdigit(upc) {
        if (typeof upc !== "string") {
            console.log('UPCA.checkdigit() UPC must be a string', upc);
            return upc;
        }
        upc = UPCA.raw(upc.trim()).substr(0, 11);

        if (upc.length === 5) {
            upc = UPCA.CHUMS + upc;
        }

        if (upc.length !== 11) {
            console.log('UPCA.checkdigit() UPC is too short', upc);
            return upc;
        }
        let cd = {
            even: 0,
            odd: 0
        };
        upc.split('').map((c, index) => {
            let parsed = parseInt(c, 10);
            if (index % 2 === 0) {
                cd.even += parsed;
            } else {
                cd.odd += parsed;
            }
        });
        cd.even *= 3;
        return (10 - (cd.odd + cd.even) % 10) % 10;
    }
}
