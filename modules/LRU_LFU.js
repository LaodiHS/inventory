
/**
 * @param {number} capacity
 */
 var LRUCache = function(capacity) {
    
};

/** 
 * @param {number} key
 * @return {number}
 */
LRUCache.prototype.get = function(key) {
    
};

/** 
 * @param {number} key 
 * @param {number} value
 * @return {void}
 */
LRUCache.prototype.put = function(key, value) {
    
};

/** 
 * Your LRUCache object will be instantiated and called as such:
 * var obj = Object.create(LRUCache).createNew(capacity)
 * var param_1 = obj.get(key)
 * obj.put(key,value)
 */

let a = 15%10
a













function LRUCache(capacity) {
    const map = new Map()
    const cap = capacity;

    return {
        get,
        put
    }

    function get(key) {
        let val = map.get(key)
        if (map.has(key)) {
            map.delete(key)
            map.set(key, val)
        } else {
            return -1
        }
        return val;
    }

    function put(key, value) {
        if (map.has(key)) {
            map.delete(key)

        } else {

            if (map.size === cap) {
                map.delete(first())
            }
        }
        map.set(key, value)
    }

    function first() {
        return map.keys().next().value
    }

}
let cache = new LRUCache(2)








cache.put(1, 1)
cache.put(2, 2)
cache.get(1) /*?*/
cache.put(3, 3)
cache.get(2) /*?*/
cache.put(4, 4)
cache.get(1) /*?*/
cache.get(3) /*?*/
cache.get(4) /*?*/


class LFUCache {
    constructor(capacity) {
        this.cap = capacity;
        this.vals = new Map()
        this.counts = new Map()
        this.lists = new Map()
        this.lists.set(1, new Set())
        this.min = -1;

    }

    get(key) {
        if (!this.vals.has(key)) return -1;
        // get the the current count of the requested resource 
        let count = this.counts.get(key);
        // advane the counts of the requested resource key
        this.counts.set(key, count + 1)
        // lookup the request range of the resource and remove the resource from that range 
        this.lists.get(count).delete(key)

        if (count === this.min && this.lists.get(count).size === 0)this.min++;
        // check if the request range exists and if not add it
        if (!this.lists.has(count + 1)) this.lists.set(count + 1, new Set());
        // Then add the resource to the new range
        this.lists.get(count + 1).add(key)
        // return the resource of the key
        return this.vals.get(key)
    }

    put(key, val) {
        if (this.cap <= 0) return;
        
        if (this.vals.has(key)) {
            //if the value exists reset the key to the end of the values map
            this.vals.delete(key)
            this.vals.set(key, val)
            //advance the range of counts     
            this.get(key)
            return;
        }
        // if the values table excced the buffer
        if (this.vals.size >= this.cap) {
            // we then grab the oldest lest requested resource . 
            let evit = this.lists.get(this.min).keys().next().value
            //and eliminate it
            this.lists.get(this.min).delete(evit)
            // subsquestly we also eliminate it from our key value pairs
            this.vals.delete(evit)
        }
        //set the key value pairs if the key does not already exist 
        this.vals.set(key, val)
        // set the initial count of the key 
        this.counts.set(key, 1)
        // reset the min to it's default value on this check:
        // "if (count === this.min && this.lists.get(count).size === 0)this.min++;""
        this.min = 1
        // add the key to the first range
        this.lists.get(1).add(key)
    }
}
let LFUCacheMake= new LFUCache(2)
    LFUCacheMake.put(2, 1);  
    LFUCacheMake.put(1, 1);    
    LFUCacheMake.put(2,3);      
    LFUCacheMake.put(4, 1);    
    LFUCacheMake.get(1) 
    LFUCacheMake.get(2)  







