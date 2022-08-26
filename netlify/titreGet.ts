
import {FaunaError} from "./FaunaError.class"
import { INDEXES } from "./faunaConstantes"

/**
 *  @param event : {
 *    "path": "Path parameter (original URL encoding)",
 *    "httpMethod": "Incoming request’s method name",
 *    "headers": {Incoming request headers},
 *    "queryStringParameters": {Query string parameters},
 *    "body": "A JSON string of the request payload",
 *    "isBase64Encoded": "A boolean flag to indicate if the applicable request payload is Base64-encoded"
 * }
 *  @context : The context parameter includes information about the context in 
 *      which the function was called, like certain Identity user information, for example.
 *  @return : {
 *    "isBase64Encoded": true|false,
 *    "statusCode": httpStatusCode,
 *    "headers": { "headerName": "headerValue", ... },
 *    "multiValueHeaders": { "headerName": ["headerValue", "headerValue2", ...], ... },
 *    "body": "..."
 *  }
 *  @see : https://docs.netlify.com/functions/build-with-javascript/
 */
export async function get(q, client, event, context) {
    
    //if(event.queryStringParameters["key"] || !event.queryStringParameters["key"].match(REGEX.ALPHANUM64)){
    //  return (new FaunaError(["Malformed Request Body", "key `" + "key" + "` wasn't well formated"]).return())
    //}

    return await client.query(

      //Get first
      //FIXME
      q.Get(q.Match(q.Index(INDEXES.INDEXE_REACTIONS_By_MESSAGE) , 'thumbUp', 'channelID', 'someTS'))

    ).then((ret) => {
      return {
        statusCode: 200,
        body: JSON.stringify({ message: ret }, null, 2),
      }
    })
    .catch((err) => {
      return (new FaunaError(err)).return()
    })
}
