import { WorkerEntrypoint } from "cloudflare:workers";

/**
 * Welcome to Cloudflare Workers! This is your first Durable Objects application.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your Durable Object in action
 * - Run `npm run deploy` to publish your application
 *
 * Bind resources to your worker in `wrangler.jsonc`. After adding bindings, a type definition for the
 * `Env` object can be regenerated with `npm run cf-typegen`.
 *
 * Learn more at https://developers.cloudflare.com/durable-objects
 */


/** A Durable Object's behavior is defined in an exported Javascript class */
export default class extends WorkerEntrypoint<Env> {
	override async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);
    const key = url.pathname.slice(1);
    
    switch(request.method){
      case 'GET':{
        const defaultHeaders = new Headers();
        defaultHeaders.set('Cache-Control', 'public, max-age=604800');
        defaultHeaders.set('Content-Type', 'text/html');
        return new Response("I hate LONASO!", {
          status: 200,
          headers: defaultHeaders
        })
        // const object = await (this.env).MY_BUCKET.get(key, {
        //   onlyIf: request.headers,
        //   range: request.headers,
        // });

        // if (!object) {
        //   return new Response("Object Not Found", { status: 404 });
        // }

        // const headers = new Headers();
        // object.writeHttpMetadata(headers);
        // headers.set("etag", object.httpEtag);

        // if("body" in object)
        //   return new Response(object.body, {
        //     status: 200,
        //     headers
        //   })

        // return new Response(undefined, {
        //   status: 412,
        //   headers
        // })
      }
      default: {
         return new Response("Method Not Allowed", {
          status: 405,
          headers: {
            Allow: "GET",
          },
        });
      }
    }
  }
}

