import axios from 'axios';
import test from 'simple-test-framework';
// index represents the positions url 0 = url0 1= url1 

// rankings 0 => length of all values 0-> length [[count,url],[count, url],[count, url],[ count, url],[ count, url]] 







export class Circle_Buffer {

    constructor(buffer) {
        this.buffer = [...buffer].map((val, i) => ({ index: i, count: 0, url: val }));
        this.s = 0;

    }

    start() {

        const set_value = this.s++ % this.buffer.length;

        this.s = this.s % this.buffer.length;

        return set_value;
    }


    swap(one, two) {

        let a = this.buffer[two.index];

        let b = two.index;

        this.buffer[two.index] = this.buffer[one.index];

        this.buffer[one.index] = a

        two.index = one.index;

        one.index = b;

    }


queue_smallest_count(node){
    node.count--;
    const ahead = this.s
    const forward_count = this.buffer[ahead].count
    if (node.count < forward_count) {

        this.swap(node, this.buffer[ahead])

        console.log("swapped")
    }


}

    async request(request_object) {
        const iter = this.start()
        const node = this.buffer[iter]
        node.count++;
      return await new Promise( async (resolve, reject) => {
            try {
            const response = await axios.get(node.url, request_object)
                const data = await response.data
               this.queue_smallest_count(node)
                resolve(data);
            } catch (error) {
               this.queue_smallest_count(node)
                reject(error);
            }
          
        })

    }

    remove(url) {
        let index = this.mapped.get(url)
        const val = this.begin();
        if (this.buffer[val]) {
            this.buffer[val]--;

        }
    }
}





const buffer = new Circle_Buffer(["pture-image.herokuapp.com/capture0", "pture-image.herokuapp.com/capture1", "pture-image.herokuapp.com/capture2", "pture-image.herokuapp.com/capture3", "pture-image.herokuapp.com/capture4", "pture-image.herokuapp.com/capture5", "pture-image.herokuapp.com/capture6"]);
test("Your project works", function (t) {
    t.check(buffer.buffer.constructor === Array, "the buffer is an array");
    t.test("make a request", (t) => {




let k = 100;
        while(k-- > 0){
            setTimeout(()=>{
buffer.request({ url: "http://abc.com" })

            },1)


        }
        
      

    })

    t.finish();


})