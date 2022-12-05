



async function test_api_granularity(REST_type, route, params ){
    const selector_param_errors  = [ 
        ['missing_selector_field', {url:"http://youtube.com" }, {}, {
            stats : 400, statsText :'Bad Request', data : {message:'bad_request', errors:[
            {msg: 'This empty field parameter is required', param: 'selector', location: 'body'},
            {msg: 'This required parameter does not exists', param: 'selector', location: 'body'},
            {msg: 'This url parameter is less than the required minimum of 5 characters', param: 'selector', location: 'body'}
            
        ]}}
    ],
            ['empty_selector_filed',{url:"http://youtube.com", selector:"" },{},{
                stats : 400, statsText :'Bad Request', data : {message:'bad_request', errors:[
                {msg: 'This required parameter does not exists', param: 'selector', location: 'body'},
                {msg: 'This url parameter is less than the required minimum of 5 characters', param: 'selector', location: 'body'}
            ]}}],
                ['min_five_character_filed', {url:"http://youtube.com", selector:"1234" },{},{
                    stats : 400, statsText :'Bad Request', data : {message:'bad_request', errors:[
                    {msg: 'This url parameter is less than the required minimum of 5 characters', param: 'selector', location: 'body'}
                ]}}] 
    ];

    const responses = await  Promise.all( test_possible_errors.map(( ([_, request, obj]) => axios[REST_type](route, request).catch(err=> err))))
        while(responses.length){
            const errors = responses.pop();
            const test_index = responses.length;
            test_possible_errors[test_index][2] = errors.response; 
        }
    }



    test_api_granularity('post',`${app.name}${app.port}/api`, )