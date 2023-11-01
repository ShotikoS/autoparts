import moment from "moment";
const Util = {
    camel: {
        toDash: s => s.replace(/[A-Z]/g, m => "-" + m.toLowerCase()),
        toSpace: s => Util.camel.toDash(s).replaceAll("-", " ")
    },
    object: {
        toLabel: s => {
            if(!s) return '';
            let label = '';
            const tmpArray = []
            if(Array.isArray(s)) {
                s.map((i)=>{
                    typeof i === 'object'?tmpArray.push(i.name):tmpArray.push(i)
                })
                label = tmpArray.join(', ')
            }
            else if(typeof s === 'object') label = s.name;
            else label = s;
            return label;
        },
        has: (s, term) => {
            const searchee = s.name ?? s
            return searchee.toString().toLowerCase().includes(term.toLowerCase())
        },
        isEmpty: s => s && Object.keys(s).length === 0,
        isObject: s => typeof s === 'object' && !Array.isArray(s) && s !== null,
        isUrl: (url) => {
            try {
                return Boolean(new URL(url))
            }
            catch (_){
                return false;
            }
        }
    },
    array: {
        unique: arr => {
            const hash = { }
            arr.forEach(i => hash[i.id] = i)
            return Object.values(hash).sort((a, b) => a.id - b.id)
        },
        isEmpty: arr => {
            return Array.isArray(arr) && arr.length === 0
        },
    },
    func: {
        empty: () => { /* NOP */ }
    },
    date:{
        from:(date)=>{
            return moment(date).fromNow();
        },
        only:(date)=>{
            return moment(date).format('l');
        },
        hub:(date)=>{
            return moment(date).format('MM/DD/YYYY');
        },
        time:(date)=>{
            return moment(date).format("MM-DD-YYYY HH:mm:ss");
        }
    },
    getParam(key) {
    let result = false,
        tmp = [];
    let items = window.location.search.substr(1).split("&");
    for (let index = 0; index < items.length; index++) {
        tmp = items[index].split("=");
        if (tmp[0] === key) {
            result = decodeURIComponent(tmp[1]);
        }
    }
    return result;
    }
}

export default Util