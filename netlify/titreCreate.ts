
import {FaunaError} from "./FaunaError.class"
import { COLLECTION, INDEXES } from "./faunaConstantes"
import { Reaction } from "./struct"

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
export async function create(q, client, event, context) {

    let reactionEvent: Reaction
    let body: object = JSON.parse(event.body)

    //Challenge of Slack, used only once.
    if(body['challenge']){
      return doChallenge(body['challenge'])
    }
    //Sanitize object
    try{
        reactionEvent = new Reaction(body)
    } catch (error){
        return (new FaunaError(["Malformed Request Body", error]).return())
    }

    if(reactionEvent.type !== 'reaction_added' || reactionEvent.reaction !== 'thumbsup' || reactionEvent.item.type !== 'message'){
      return {
        statusCode: 200,
        body: JSON.stringify({'message':'parameters were provided but not valid. This event isn\'t stored'}),
      }
    }

    return insert(q, client, reactionEvent)
  }

/**
   * Subfunction to answer the Slack POST request for Challenge
   * @param challenge the challenge password of Slack
   */
async function doChallenge(challenge){
  return {
    statusCode: 200,
    body: JSON.stringify({ challenge: challenge }, null, 2),
  }
}
  /**
   * Subfunction to create a new FaunaDB Document
   * @param q a FaunaDb Query
   * @param client a Faunadb Client
   * @param reaction a <Reaction> object
   * @returns a exception if necessary or an js object with { statusCode: 201, body: <string> }
   */
async function insert(q, client, reaction: Reaction){
  return await client.query(
      q.Create(
          q.Collection(COLLECTION.CURRENT_COLLECTION),
          {data: reaction}
      )

    ).then((ret) => {
      return {
        statusCode: 201,
        body: JSON.stringify({ message: ret }, null, 2),
      }
    })
    .catch((err) => {
      return (new FaunaError(err)).return()
    })

}