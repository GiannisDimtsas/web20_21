export class Preprocessor{
    parse(har_file){
        let feature_collection = {
            'type': 'ObjectFeatures',
            'features': []
        }

        let log = har_file.log;
        feature_collection.features.push(...this.parse_features(log));
        return feature_collection;
    }

    parse_features(log){
        let features = [];
        if('entries' in log){
            for(let entries of log.entries){
                features.push({
                    'entries': {
                        'request': {
                            'method': entries.request.method,
                            'url': entries.request.url,
                            'headers': entries.request.headers,
 
                        },
                        'response': {
                            'status': entries.response.status,
                            'statustext': entries.response.statustext,
                            'headers': entries.request.headers,
                        },
                        'serverIPAddress': entries.serverIPAddress,
                        'startedDateTime':entries.startedDateTime,
                        'timings':{
                            'wait':entries.timings.wait
                        }                         
                    }
                                                 
                });
            }
        }
        return features;
    }
}