/**
 * Created by steve on 1/10/2017.
 */

export default class UPCA {
    static CHUMS = '000298';
    static raw (upc:string) {
        let re = /[0-9]/;
        return upc.split('')
            .filter(c => re.test(c))
            .join('');
    }

    static format(upc:string) {
        upc = UPCA.raw(upc);

        if (upc.length === 5) {
            upc = UPCA.CHUMS + upc;
        }

        if (upc.length !== 11 && upc.length !== 12) {
            return upc;
        }
        const [full, p1, p2, p3] = /(\d)(\d{5})(\d{5})(\d)/.exec(upc) ?? [];
        return [p1, p2, p3, UPCA.checkdigit(upc)].join(' ');
    }

    static checkdigit(upc:string) {
        upc = UPCA.raw(upc.trim()).slice(0, 11);

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
