import { serve } from "https://deno.land/std@0.120.0/http/server.ts";
import { configure, renderFile } from "https://deno.land/x/eta@v1.12.3/mod.ts";
import { extractPerson } from "./utils/formUtils.js";
import * as peopleService from "./services/peopleService.js";

configure({
  views: `${Deno.cwd()}/views/`,
});

const responseDetails = {
  headers: { "Content-Type": "text/html;charset=UTF-8" },
};

const addPerson = async (request) => {
  const person = await extractPerson(request);
  peopleService.add(person);
};

const handleRequest = async (request) => {
  if (request.method === "POST") {
    await addPerson(request);
  }

  const data = {
    people: peopleService.findAll(),
  };

  return new Response(await renderFile("index.eta", data), responseDetails);
};

serve(handleRequest, { port: 7777 });
